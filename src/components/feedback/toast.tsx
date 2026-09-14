import { Icon } from "@/components/ui/icon";
import {
  AlertTriangle,
  CheckCircle2,
  Info,
  X,
  XCircle,
} from "lucide-react-native";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export type ToastVariant = "success" | "error" | "info" | "warning";

export interface ToastOptions {
  variant?: ToastVariant;
  title: string;
  description?: string;
  duration?: number;
  action?: { label: string; onPress: () => void };
}

interface ToastItem extends ToastOptions {
  id: string;
}

interface ToastContextValue {
  show: (options: ToastOptions) => void;
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
  info: (title: string, description?: string) => void;
  warning: (title: string, description?: string) => void;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const VARIANT_CONFIG: Record<
  ToastVariant,
  {
    icon: any;
    iconColor: string;
    accent: string;
    iconBg: string;
    titleColor: string;
  }
> = {
  success: {
    icon: CheckCircle2,
    iconColor: "#059669",
    accent: "#10b981",
    iconBg: "#d1fae5",
    titleColor: "#064e3b",
  },
  error: {
    icon: XCircle,
    iconColor: "#dc2626",
    accent: "#ef4444",
    iconBg: "#fee2e2",
    titleColor: "#7f1d1d",
  },
  info: {
    icon: Info,
    iconColor: "#195FA0",
    accent: "#195FA0",
    iconBg: "#dbeafe",
    titleColor: "#0c3a6e",
  },
  warning: {
    icon: AlertTriangle,
    iconColor: "#d97706",
    accent: "#f59e0b",
    iconBg: "#fef3c7",
    titleColor: "#78350f",
  },
};

function ToastCard({
  toast,
  onDismiss,
}: {
  toast: ToastItem;
  onDismiss: (id: string) => void;
}) {
  const config = VARIANT_CONFIG[toast.variant ?? "info"];
  const translateY = useRef(new Animated.Value(-120)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  const duration = toast.duration ?? 4000;

  const hide = useCallback(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -140,
        duration: 220,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start(() => onDismiss(toast.id));
  }, [onDismiss, opacity, toast.id, translateY]);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 320,
        easing: Easing.out(Easing.back(1.2)),
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(hide, duration);
    return () => clearTimeout(timer);
  }, [duration, hide, opacity, translateY]);

  return (
    <Animated.View
      style={[
        styles.toastWrapper,
        {
          opacity,
          transform: [{ translateY }],
        },
      ]}
    >
      <Pressable
        onPress={() => {
          if (!toast.action) hide();
        }}
        style={({ pressed }) => [
          styles.toast,
          {
            opacity: pressed && !toast.action ? 0.92 : 1,
          },
        ]}
      >
        <View style={[styles.accent, { backgroundColor: config.accent }]} />

        <View style={styles.content}>
          <View style={[styles.iconBox, { backgroundColor: config.iconBg }]}>
            <Icon as={config.icon} size="md" color={config.iconColor} />
          </View>

          <View style={styles.textBox}>
            <Text style={[styles.title, { color: config.titleColor }]}>
              {toast.title}
            </Text>
            {toast.description ? (
              <Text style={styles.description} numberOfLines={3}>
                {toast.description}
              </Text>
            ) : null}

            {toast.action ? (
              <Pressable
                onPress={() => {
                  toast.action?.onPress();
                  hide();
                }}
                style={({ pressed }) => [
                  styles.actionButton,
                  {
                    backgroundColor: config.accent,
                    opacity: pressed ? 0.85 : 1,
                  },
                ]}
              >
                <Text style={styles.actionLabel}>{toast.action.label}</Text>
              </Pressable>
            ) : null}
          </View>

          <Pressable
            onPress={hide}
            hitSlop={10}
            style={({ pressed }) => [
              styles.closeBtn,
              { opacity: pressed ? 0.5 : 1 },
            ]}
          >
            <Icon as={X} size="xs" color="#94a3b8" />
          </Pressable>
        </View>
      </Pressable>
    </Animated.View>
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const show = useCallback((options: ToastOptions) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setToasts((prev) => [...prev, { ...options, id }]);
  }, []);

  const success = useCallback(
    (title: string, description?: string) =>
      show({ variant: "success", title, description }),
    [show],
  );
  const error = useCallback(
    (title: string, description?: string) =>
      show({ variant: "error", title, description }),
    [show],
  );
  const info = useCallback(
    (title: string, description?: string) =>
      show({ variant: "info", title, description }),
    [show],
  );
  const warning = useCallback(
    (title: string, description?: string) =>
      show({ variant: "warning", title, description }),
    [show],
  );

  return (
    <ToastContext.Provider
      value={{ show, success, error, info, warning, dismiss }}
    >
      {children}
      <SafeAreaView
        edges={["top"]}
        pointerEvents="box-none"
        style={styles.host}
      >
        {toasts.map((t) => (
          <ToastCard key={t.id} toast={t} onDismiss={dismiss} />
        ))}
      </SafeAreaView>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return ctx;
}

let externalToast: ToastContextValue | null = null;

export function ToastBridge() {
  const toast = useToast();
  useEffect(() => {
    externalToast = toast;
    return () => {
      externalToast = null;
    };
  }, [toast]);
  return null;
}

export const toast: ToastContextValue = {
  show: (opts) => externalToast?.show(opts),
  success: (title, description) => externalToast?.success(title, description),
  error: (title, description) => externalToast?.error(title, description),
  info: (title, description) => externalToast?.info(title, description),
  warning: (title, description) => externalToast?.warning(title, description),
  dismiss: (id) => externalToast?.dismiss(id),
};

const styles = StyleSheet.create({
  host: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    zIndex: 9999,
  },
  toastWrapper: {
    marginTop: 8,
  },
  toast: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    flexDirection: "row",
    overflow: "hidden",
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 12,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  accent: {
    width: 4,
  },
  content: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 14,
    paddingLeft: 12,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  textBox: {
    flex: 1,
    paddingTop: 2,
  },
  title: {
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 18,
  },
  description: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 3,
    lineHeight: 17,
  },
  actionButton: {
    alignSelf: "flex-start",
    marginTop: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  actionLabel: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "700",
  },
  closeBtn: {
    padding: 4,
    marginLeft: 8,
  },
});