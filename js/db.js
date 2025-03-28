// db.js - Database foundation for DICED app
console.log("Loading database module...");

// Database configuration
const DB_NAME = "DicedRPG";
const DB_VERSION = 1;
const STORES = {
  ATTRIBUTE_HOURS: "attributeHours",
  QUESTS: "quests",           // Basic quest information
  QUEST_DETAILS: "questDetails", // Detailed quest content
  USER_PROGRESS: "userProgress"  // User's quest completion status
};

// Database management class
class DicedDatabase {
  constructor() {
    this.db = null;
    this.isInitializing = false;
    this.initCallbacks = [];
    console.log("DicedDatabase instance created");
  }

  async init() {
    if (this.db) return this.db;
    if (this.isInitializing) {
      return new Promise(resolve => {
        this.initCallbacks.push(resolve);
      });
    }

    console.log("Initializing database...");
    this.isInitializing = true;
    
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      
      request.onerror = event => {
        console.error("Database error:", event.target.error);
        this.isInitializing = false;
        reject(event.target.error);
      };
      
      request.onsuccess = event => {
        console.log("Database opened successfully");
        this.db = event.target.result;
        this.isInitializing = false;
        
        this.initCallbacks.forEach(callback => callback(this.db));
        this.initCallbacks = [];
        
        resolve(this.db);
      };
      
      request.onupgradeneeded = event => {
        console.log("Database upgrade needed, creating stores...");
        const db = event.target.result;
        
      if (!db.objectStoreNames.contains(STORES.QUESTS)) {
  const questStore = db.createObjectStore(STORES.QUESTS, { keyPath: "id" });
  questStore.createIndex("type", "type", { unique: false });
  questStore.createIndex("stageId", "stageId", { unique: false });
}

if (!db.objectStoreNames.contains(STORES.QUEST_DETAILS)) {
  db.createObjectStore(STORES.QUEST_DETAILS, { keyPath: "questId" });
}

if (!db.objectStoreNames.contains(STORES.USER_PROGRESS)) {
  const progressStore = db.createObjectStore(STORES.USER_PROGRESS, { 
    keyPath: ["questId", "userId"] 
  });
  progressStore.createIndex("userId", "userId", { unique: false });
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
  
  async getAll(storeName) {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, "readonly");
      const store = transaction.objectStore(storeName);
      const request = store.getAll();
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
  
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
}

// Create a global instance
window.dicedDB = new DicedDatabase();
console.log("Database module loaded, dicedDB object created");
