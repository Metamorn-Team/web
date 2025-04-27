type AlertType = "info" | "warn" | "error" | "done";
type AlertCallback = (
  message: string,
  type: AlertType,
  iconVisible?: boolean
) => void;

class AlertSingleton {
  private callback: AlertCallback | null = null;

  setCallback(cb: AlertCallback) {
    this.callback = cb;
  }

  private trigger(message: string, type: AlertType, iconVisible?: boolean) {
    if (this.callback) {
      this.callback(message, type, iconVisible);
    } else {
      console.warn("No alert callback registered");
    }
  }

  info(message: string, iconVisible?: boolean) {
    this.trigger(message, "info", iconVisible);
  }

  warn(message: string, iconVisible?: boolean) {
    this.trigger(message, "warn", iconVisible);
  }

  error(message: string, iconVisible?: boolean) {
    this.trigger(message, "error", iconVisible);
  }

  done(message: string, iconVisible?: boolean) {
    this.trigger(message, "done", iconVisible);
  }
}

const Alert = new AlertSingleton();
export default Alert;
