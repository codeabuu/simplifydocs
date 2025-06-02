// src/utils/IndexedDB.ts
class IndexedDB {
  private dbName: string;
  private dbVersion: number;
  private db: IDBDatabase | null = null;

  constructor(dbName: string, dbVersion: number) {
    this.dbName = dbName;
    this.dbVersion = dbVersion;
  }

  async open(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains('spreadsheet')) {
          db.createObjectStore('spreadsheet', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('pdf')) {
          db.createObjectStore('pdf', { keyPath: 'id' });
        }
      };

      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        resolve(this.db);
      };

      request.onerror = (event) => {
        reject((event.target as IDBOpenDBRequest).error);
      };
    });
  }

  async get<T>(storeName: string, id: string): Promise<T | undefined> {
    if (!this.db) await this.open();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(id);

      request.onsuccess = () => {
        resolve(request.result?.data);
      };

      request.onerror = (event) => {
        reject((event.target as IDBRequest).error);
      };
    });
  }

  async set(storeName: string, id: string, data: any): Promise<void> {
    if (!this.db) await this.open();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put({ id, data });

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = (event) => {
        reject((event.target as IDBRequest).error);
      };
    });
  }

  async getSpreadsheetState(): Promise<SpreadsheetState | undefined> {
    return this.get<SpreadsheetState>('spreadsheet', 'spreadsheet-state');
  }

  async setSpreadsheetState(state: SpreadsheetState): Promise<void> {
    const { file, ...rest } = state;
    const toSave = {
      ...rest,
      file: file ? { name: file.name, type: file.type, size: file.size } : null
    };
    return this.set('spreadsheet', 'spreadsheet-state', toSave);
  }

  async getPdfState(): Promise<PdfState | undefined> {
    return this.get<PdfState>('pdf', 'pdf-state');
  }

  async setPdfState(state: PdfState): Promise<void> {
    const { file, ...rest } = state;
    const toSave = {
      ...rest,
      file: file ? { name: file.name, type: file.type, size: file.size } : null
    };
    return this.set('pdf', 'pdf-state', toSave);
  }

  async clearSpreadsheetState(): Promise<void> {
    return this.delete('spreadsheet', 'spreadsheet-state');
  }

  async clearPdfState(): Promise<void> {
    return this.delete('pdf', 'pdf-state');
  }

  async delete(storeName: string, id: string): Promise<void> {
    if (!this.db) await this.open();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(id);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = (event) => {
        reject((event.target as IDBRequest).error);
      };
    });
  }
}

export const db = new IndexedDB('AskAnalytIQ', 1);