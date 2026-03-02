import { Icon } from '@/components/ui/icon';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { X, Zap, ZapOff } from 'lucide-react-native';
import { useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';


interface Props {
  onScanned: (chave: string) => void;
  onClose: () => void;
}

export default function Scanner({ onScanned, onClose }: Props) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [torch, setTorch] = useState(false);

  if (!permission) {
    return <View className="flex-1 bg-black" />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container} className="bg-gray-900 items-center justify-center">
        <Text className="text-white mb-4 text-center px-10">Precisamos de acesso à câmera para ler o código de barras da nota.</Text>
        <Button onPress={requestPermission} title="Permitir Câmera" />
        <Button onPress={onClose} title="Cancelar" color="red" />
      </View>
    );
  }

  const handleBarCodeScanned = ({ type, data }: any) => {
    if (scanned) {
      return;
    }

    console.log(`[SCANNER] Tipo: ${type} | Dados brutos: ${data}`);

    const chaveLimpa = data.replace(/[^0-9]/g, '');
    console.log(`[SCANNER] Tamanho limpo: ${chaveLimpa.length}`);

    if (chaveLimpa.length === 44) {
      setScanned(true);
      onScanned(chaveLimpa);
    } else {
      // Opcional: Feedback visual rápido se ler algo errado (mas cuidado pra não flodar)
      console.warn("Leu algo, mas não é uma chave válida.");
    }
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        onBarcodeScanned={handleBarCodeScanned}
        // barcodeScannerSettings={{
        //   barcodeTypes: ["code128", "qr"], // Code128 é o padrão da barra linear da DANFE
        // }}
        enableTorch={torch}
      />

      {/* Overlay Visual (Mascara escura com buraco no meio) */}
      <View style={styles.overlay}>
        <View style={styles.topOverlay} />
        <View style={styles.middleRow}>
          <View style={styles.sideOverlay} />
          <View style={styles.scanArea}>
            {/* Cantoneiras visuais */}
            <View className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white" />
            <View className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white" />
            <View className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white" />
            <View className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white" />

            {/* Linha vermelha de "laser" (Animação opcional) */}
            <View className="w-full h-[1px] bg-red-500 opacity-50 top-1/2 absolute" />
          </View>
          <View style={styles.sideOverlay} />
        </View>
        <View style={styles.bottomOverlay}>
          <Text className="text-white mt-10 font-bold text-lg drop-shadow-md">Aponte para o código de barras</Text>


          <View className="flex-row gap-8 mt-8">
            {/* Botão Lanterna */}
            <TouchableOpacity
              onPress={() => setTorch(!torch)}
              className="bg-white/20 p-4 rounded-full"
            >
              <Icon as={torch ? ZapOff : Zap} size="xl" className={torch ? "text-yellow-400" : "text-white"} />
            </TouchableOpacity>

            {/* Botão Fechar */}
            <TouchableOpacity onPress={onClose} className="bg-white/20 p-4 rounded-full">
              <Icon as={X} size="xl" className="text-white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  overlay: { flex: 1 },
  topOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' },
  middleRow: { flexDirection: 'row', height: 150 }, // Altura da área de scan
  sideOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' },
  scanArea: { width: '90%', backgroundColor: 'transparent' }, // Área transparente
  bottomOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', alignItems: 'center' },
});