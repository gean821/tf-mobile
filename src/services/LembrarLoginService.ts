import * as SecureStore from "expo-secure-store";

const LOGIN_KEY = "tf_lembrar_login";
const SENHA_KEY = "tf_lembrar_senha";
const BIOMETRIA_KEY = "tf_lembrar_biometria";

export default class LembrarLoginService {

  static biometriaDisponivel(): boolean {
    try {
      return SecureStore.canUseBiometricAuthentication();
    } catch {
      return false;
    }
  }

  static async salvar(login: string, senha: string): Promise<boolean> {
    await SecureStore.setItemAsync(LOGIN_KEY, login);

    if (!LembrarLoginService.biometriaDisponivel()) {
      await LembrarLoginService.limparSenha();
      return false;
    }

    try {
      await SecureStore.setItemAsync(SENHA_KEY, senha, {
        requireAuthentication: true,
        authenticationPrompt: "Confirme sua digital ou rosto para entrar mais rápido",
      });
      await SecureStore.setItemAsync(BIOMETRIA_KEY, "1");
      return true;
    } catch {
      await LembrarLoginService.limparSenha();
      return false;
    }
  }

  static async obterLogin(): Promise<string | null> {
    return SecureStore.getItemAsync(LOGIN_KEY);
  }

  static async temSenhaSalva(): Promise<boolean> {
    return (await SecureStore.getItemAsync(BIOMETRIA_KEY)) === "1";
  }

  static async obterSenhaComBiometria(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(SENHA_KEY, {
        requireAuthentication: true,
        authenticationPrompt: "Entrar no TruckFlow Motorista",
      });
    } catch {
      return null;
    }
  }

  static async limparSenha(): Promise<void> {
    await SecureStore.deleteItemAsync(SENHA_KEY);
    await SecureStore.deleteItemAsync(BIOMETRIA_KEY);
  }

  static async limpar(): Promise<void> {
    await SecureStore.deleteItemAsync(LOGIN_KEY);
    await LembrarLoginService.limparSenha();
  }
}
