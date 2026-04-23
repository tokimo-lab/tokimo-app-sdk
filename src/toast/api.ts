export type ToastLevel = "info" | "success" | "warning" | "error";

export interface ShellToastApi {
  show: (
    level: ToastLevel,
    message: string,
    opts?: { duration?: number },
  ) => void;
  info: (message: string, opts?: { duration?: number }) => void;
  success: (message: string, opts?: { duration?: number }) => void;
  warning: (message: string, opts?: { duration?: number }) => void;
  error: (message: string, opts?: { duration?: number }) => void;
}
