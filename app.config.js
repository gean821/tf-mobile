module.exports = ({ config }) => ({
  ...config,
  android: {
    ...config.android,
    googleServicesFile: process.env.GOOGLE_SERVICES_JSON ?? config.android.googleServicesFile,
    blockedPermissions: [
      "android.permission.RECORD_AUDIO",
      "android.permission.READ_EXTERNAL_STORAGE",
      "android.permission.WRITE_EXTERNAL_STORAGE",
      "android.permission.READ_MEDIA_IMAGES",
      "android.permission.READ_MEDIA_VIDEO",
      "android.permission.SYSTEM_ALERT_WINDOW",
    ],
  },
  plugins: [
    ...config.plugins,
    [
      "expo-camera",
      {
        cameraPermission:
          "O TruckFlow Motorista usa a câmera para ler o código de barras da nota fiscal (DANFE) e agendar sua descarga.",
        recordAudioAndroid: false,
      },
    ],
  ],
});
