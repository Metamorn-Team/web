type AlertType = "info" | "warn" | "error" | "done";
type AlertCallback = (message: string, type: AlertType) => void;

class AlertSingleton {
  private callback: AlertCallback | null = null;

  setCallback(cb: AlertCallback) {
    this.callback = cb;
  }

  private trigger(message: string, type: AlertType) {
    if (this.callback) {
      this.callback(message, type);
    } else {
      console.warn("No alert callback registered");
    }
  }

  info(message: string) {
    this.trigger(message, "info");
  }

  warn(message: string) {
    this.trigger(message, "warn");
  }

  error(message: string) {
    this.trigger(message, "error");
  }

  done(message: string) {
    this.trigger(message, "done");
  }
}

const Alert = new AlertSingleton();
export default Alert;
