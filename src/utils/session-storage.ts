import { SessionStorageData } from "@/types/storage/session-storage";

export const setItem = <T extends SessionStorageData, K extends keyof T>(
  key: K,
  value: T[K]
): void => {
  try {
    const serializedValue =
      typeof value === "string" ? value : JSON.stringify(value);
    sessionStorage.setItem(String(key), serializedValue);
  } catch (error) {
    console.error(`LocalStorage 저장 실패 - key: ${String(key)}`, error);
  }
};

export const getItem = <K extends keyof SessionStorageData>(key: K) => {
  const item = sessionStorage.getItem(key);

  try {
    if (!item) throw new Error("no item");
    return (JSON.parse(item) as SessionStorageData[K]) || null;
  } catch {
    return (item as SessionStorageData[K]) || null;
  }
};

export const removeItem = (key: keyof SessionStorageData): void => {
  try {
    sessionStorage.removeItem(key);
  } catch (error) {
    console.error(`LocalStorage 삭제 실패 - key: ${key}`, error);
  }
};

export const clear = (): void => {
  try {
    sessionStorage.clear();
  } catch (error) {
    console.error("LocalStorage 초기화 실패", error);
  }
};
