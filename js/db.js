// db.js - Database management module

class DicedDatabase {
  constructor() {
    this.db = null;
    this.isInitializing = false;
    this.initCallbacks = [];
  }

  async init() {
    if (this.db) return this.db;
    if (this.isInitializing) {
      // Return a promise that resolves when initialization completes
      return new Promise(resolve => {
        this.initCallbacks.push(resolve);
      });
    }

    this.isInitializing = true;
    
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      
      request.onerror = event => {
        console.error("Database error:", event.target.error);
        this.isInitializing = false;
        reject(event.target.error);
      };
      
      request.onsuccess = event => {
        this.db = event.target.result;
        this.isInitializing = false;
        
        // Resolve all pending callbacks
        this.initCallbacks.forEach(callback => callback(this.db));
        this.initCallbacks = [];
        
        resolve(this.db);
      };
      
      request.onupgradeneeded = event => {
        const db = event.target.result;
        
        // Create object stores if they don't exist
        if (!db.objectStoreNames.contains(STORES.QUESTS)) {
          const questStore = db.createObjectStore(STORES.QUESTS, { keyPath: "id" });
          questStore.createIndex("stageId", "stageId", { unique: false });
          questStore.createIndex("type", "type", { unique: false });
          questStore.createIndex("rank", "rank", { unique: false });
        }
        
        if (!db.objectStoreNames.contains(STORES.QUEST_DETAILS)) {
          db.createObjectStore(STORES.QUEST_DETAILS, { keyPath: "questId" });
        }
        
        if (!db.objectStoreNames.contains(STORES.QUEST_STAGES)) {
          const stageStore = db.createObjectStore(STORES.QUEST_STAGES, { keyPath: "id" });
          stageStore.createIndex("recommendedOrder", "recommendedOrder", { unique: false });
        }
        
        if (!db.objectStoreNames.contains(STORES.USER_PROGRESS)) {
          const progressStore = db.createObjectStore(STORES.USER_PROGRESS, { keyPath: ["questId", "userId"] });
          progressStore.createIndex("userId", "userId", { unique: false });
        }
        
        if (!db.objectStoreNames.contains(STORES.ATTRIBUTE_HOURS)) {
          db.createObjectStore(STORES.ATTRIBUTE_HOURS, { keyPath: "attribute" });
        }
      };
    });
  }

  // Generic CRUD operations
  async add(storeName, data) {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, "readwrite");
      const store = transaction.objectStore(storeName);
      const request = store.add(data);
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
  
  async get(storeName, key) {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, "readonly");
      const store = transaction.objectStore(storeName);
      const request = store.get(key);
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
  
  async getAll(storeName, indexName = null, query = null) {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, "readonly");
      const store = transaction.objectStore(storeName);
      
      let request;
      if (indexName && query !== null) {
        const index = store.index(indexName);
        request = index.getAll(query);
      } else {
        request = store.getAll();
      }
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
  
  async update(storeName, data) {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, "readwrite");
      const store = transaction.objectStore(storeName);
      const request = store.put(data);
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
  
  async delete(storeName, key) {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, "readwrite");
      const store = transaction.objectStore(storeName);
      const request = store.delete(key);
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
  
  async bulkAdd(storeName, items) {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, "readwrite");
      const store = transaction.objectStore(storeName);
      
      let completed = 0;
      const total = items.length;
      const results = [];
      
      transaction.oncomplete = () => resolve(results);
      transaction.onerror = () => reject(transaction.error);
      
      items.forEach(item => {
        const request = store.add(item);
        request.onsuccess = () => {
          results.push(request.result);
          completed++;
          
          if (completed === total) {
            resolve(results);
          }
        };
      });
    });
  }
}

// Create and export a single instance
const dicedDB = new DicedDatabase();