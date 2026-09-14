import { Icon } from '@/components/ui/icon';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { X } from 'lucide-react-native';
import { useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Props {
  onScanned: (chave: string) => void;
  onClose: () => void;
}

export default function Scanner({ onScanned, onClose }: Props) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

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
    if (scanned) return;

    // Limpa para garantir apenas números
    const chaveLimpa = data.replace(/[^0-9]/g, '');

    // Validação básica de NF-e (44 dígitos)
    if (chaveLimpa.length === 44) {
      setScanned(true);
      onScanned(chaveLimpa);
    }
    // Opcional: Adicionar feedback de erro se ler algo que não é NF
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        onBarcodeScanned={handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["code128", "qr"], // Code128 é o padrão da barra linear da DANFE
        }}
      />

      <View style={styles.overlay}>
        <View style={styles.topOverlay} />
        <View style={styles.middleRow}>
          <View style={styles.sideOverlay} />
          <View style={styles.scanArea}>

            <View className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white" />
            <View className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white" />
            <View className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white" />
            <View className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white" />

            <View className="w-full h-[1px] bg-red-500 opacity-50 top-1/2 absolute" />
          </View>
          <View style={styles.sideOverlay} />
        </View>
        <View style={styles.bottomOverlay}>
          <Text className="text-white mt-10 font-bold text-lg drop-shadow-md">Aponte para o código de barras</Text>

          <TouchableOpacity onPress={onClose} className="mt-10 bg-white/20 p-4 rounded-full">
            <Icon as={X} size="xl" className="text-white" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  overlay: { flex: 1 },
  topOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' },
  middleRow: { flexDirection: 'row', height: 150 },
  sideOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' },
  scanArea: { width: '90%', backgroundColor: 'transparent' },
  bottomOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', alignItems: 'center' },
});