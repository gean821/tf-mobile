# TruckFlow Driver App — Mobile (Motorista)

App mobile do motorista. Cliente-alvo: **Aurora Alimentos**.

## Stack

- **Expo SDK 54** + **React Native 0.81** + **TypeScript 5.9**
- **expo-router 6** (navegação file-based)
- **Zustand 5** (estado global)
- **Axios 1.13** (HTTP)
- **expo-secure-store 15** (storage seguro de tokens — Keychain/Keystore)
- **AsyncStorage** (storage não-sensível — evitar pra tokens)
- **TanStack Query** (mesma convenção do web)

## Navegação (expo-router)

```
app/
├── (auth)/       # Grupo: telas pré-login (login.tsx)
├── (app)/        # Grupo: telas autenticadas (após login)
└── _layout.tsx   # Bootstrap: loadSession() + splash
```

Grupos `(auth)` e `(app)` ficam fora da URL — só organizam guards.

## Estrutura

```
src/
├── Dtos/         # DTOs espelhando backend
├── Entities/     # Types
├── components/
├── hooks/
├── queries/      # vue-query equivalents (TanStack Query RN)
├── services/     # AuthService etc
├── stores/       # Zustand (useAuthStore)
├── enums/
└── http/         # axios.ts (instância + interceptors)
```

## Autenticação atual

- Tela: `app/(auth)/login.tsx`
- Service: `src/services/AuthService.ts` → `POST /AuthMotorista/login`
- Storage: **expo-secure-store** key `user_session_token` (correto)
  - ⚠️ Há resquício de `AsyncStorage.setItem("token", ...)` em `AuthService.ts:17` — redundante, remover.
- Store: `src/stores/useAuthStore.ts` — `signIn`, `signOut`, `loadSession`
- Bootstrap: `_layout.tsx:36-38` chama `loadSession()` no app start, mantém splash até `isLoading=false`
- Validação JWT: decodifica e checa `decoded.exp * 1000 < Date.now()` no `loadSession`
- Interceptor: `src/http/axios.ts:24-36` anexa `Authorization: Bearer`, no 401 faz logout + redirect

**Em implementação (refresh token rotation):** refresh token em SecureStore (sem cookie httpOnly no mobile), rotation no 401, fila de requests em retry.

## Variáveis de ambiente

`.env`:
```
EXPO_PUBLIC_API_URL=http://192.168.18.6:8080/v1/
```

Vars `EXPO_PUBLIC_*` são automaticamente expostas (sem babel plugin). Apenas URL pública — nunca segredos.

## Backend

API .NET em `C:\ESTUDO\TruckFlow`. IP local `192.168.18.6:8080` pra dev em dispositivo físico. Endpoint motorista: `/AuthMotorista/login`. JWT carrega claim `MotoristaId`.

## Permissões & LGPD (tracking)

Decisão por ADR-0003 (no backend): tracking só foreground, geofencing, retenção 90 dias. **Não** ativar background location sem revisão.

## Convenções

- `expo-secure-store` para qualquer dado sensível (tokens, credenciais).
- `AsyncStorage` apenas para preferências/cache não-sensível.
- TanStack Query igual ao web (mesma convenção de queryKey).
- Componentes funcionais + hooks.
- Logout em 401 (até refresh token estar pronto).

## Comandos

```bash
npx expo start         # Metro bundler
npx expo run:android   # Build dev Android
npx expo run:ios       # Build dev iOS (macOS)
eas build              # Build EAS (cloud)
```
