import "@testing-library/jest-dom";

// Mock localStorage & sessionStorage
class StorageMock {
  private store: Record<string, string> = {};

  getItem(key: string) {
    return this.store[key] ?? null;
  }

  setItem(key: string, value: string) {
    this.store[key] = value.toString();
  }

  removeItem(key: string) {
    delete this.store[key];
  }

  clear() {
    this.store = {};
  }
}

globalThis.localStorage = new StorageMock() as unknown as Storage;
globalThis.sessionStorage = new StorageMock() as unknown as Storage;
