import { NatureObject } from "@/game/entities/nature/nature-object";

class NatureObjectStore {
  private static instance: NatureObjectStore;
  private natureObjects: Map<string, NatureObject> = new Map();

  private constructor() {}

  static getInstance(): NatureObjectStore {
    if (!NatureObjectStore.instance) {
      NatureObjectStore.instance = new NatureObjectStore();
    }
    return NatureObjectStore.instance;
  }

  addNatureObject(natureObject: NatureObject): void {
    this.natureObjects.set(natureObject.id, natureObject);
  }

  addNatureObjects(natureObjects: NatureObject[]): void {
    natureObjects.forEach((natureObject) => {
      this.natureObjects.set(natureObject.id, natureObject);
    });
  }

  getNatureObject(id: string): NatureObject | undefined {
    return this.natureObjects.get(id);
  }

  deleteNatureObject(id: string): void {
    this.natureObjects.delete(id);
  }

  getNatureObjects(): NatureObject[] {
    return Array.from(this.natureObjects.values());
  }

  clear(): void {
    this.natureObjects.clear();
  }

  clearAllNatureObjects(): void {
    this.natureObjects.forEach((natureObject) => {
      natureObject.destroy(true);
    });
    this.natureObjects.clear();
  }
}

export const natureObjectStore = NatureObjectStore.getInstance();
