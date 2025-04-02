export const persistItem = <T>(key: string, value: T): void => {
  try {
    const serializedValue =
      typeof value === "string" ? value : JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
  } catch (error) {
    console.error(`LocalStorage 저장 실패 - key: ${key}`, error);
  }
};

export const getItem = <T>(key: string) => {
  try {
    const item = localStorage.getItem(key);

    try {
      if (!item) throw new Error("no item");
      return JSON.parse(item) as T;
    } catch {
      return item as unknown as T;
    }
  } catch (error) {
    console.error(`LocalStorage 읽기 실패 - key: ${key}`, error);
  }
};

export const removeItem = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`LocalStorage 삭제 실패 - key: ${key}`, error);
  }
};

export const clear = (): void => {
  try {
    localStorage.clear();
  } catch (error) {
    console.error("LocalStorage 초기화 실패", error);
  }
};
