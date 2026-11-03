export const LAST_ACTIVITY_KEY = "tf_last_activity";

const minutos = Number(process.env.EXPO_PUBLIC_IDLE_TIMEOUT_MIN);
export const IDLE_TIMEOUT_MS =
  (Number.isFinite(minutos) && minutos > 0 ? minutos : 60) * 60_000;