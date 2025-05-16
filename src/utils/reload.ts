// stores/ReloadModalSingleton.ts
type ReloadCallback = (message: string) => void;

class ReloadModalSingleton {
  private callback: ReloadCallback | null = null;

  setCallback(cb: ReloadCallback) {
    this.callback = cb;
  }

  open(message: string) {
    if (this.callback) {
      this.callback(message);
    } else {
      console.warn("No reload modal callback registered");
    }
  }
}

const Reload = new ReloadModalSingleton();
export default Reload;
