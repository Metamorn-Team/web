import { LocalStorageData } from "@/types/storage/local-storage";

export const persistItem = <T extends LocalStorageData, K extends keyof T>(
  key: K,
  value: T[K]
): void => {
  try {
    const serializedValue =
      typeof value === "string" ? value : JSON.stringify(value);
    localStorage.setItem(String(key), serializedValue);
  } catch (error) {
    console.error(`LocalStorage 저장 실패 - key: ${String(key)}`, error);
  }
};

export const getItem = <K extends keyof LocalStorageData>(
  key: K
): LocalStorageData[K] | null => {
  const item = localStorage.getItem(key);

  try {
    if (!item) throw new Error("no item");
    return (JSON.parse(item) as LocalStorageData[K]) || null;
  } catch {
    return (item as LocalStorageData[K]) || null;
  }
};

export const removeItem = (key: keyof LocalStorageData): void => {
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
