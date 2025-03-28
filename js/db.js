// db.js - Database foundation for DICED app
console.log("Loading database module...");

// Database configuration
const DB_NAME = "DicedRPG";
const DB_VERSION = 1;
const STORES = {
  ATTRIBUTE_HOURS: "attributeHours"
};

// Database management class
class DicedDatabase {
  constructor() {
    this.db = null;
    this.isInitializing = false;
    this.initCallbacks = [];
    console.log("DicedDatabase instance created");
  }

  // Initialize the database
  async init() {
    if (this.db) return this.db;
    if (this.isInitializing) {
      // Return a promise that resolves when initialization completes
      return new Promise(resolve => {
        this.initCallbacks.push(resolve);
      });
    }

    console.log("Initializing database...");
    this.isInitializing = true;
    
    return new Promise((resolve, reject) => {
      // Open the IndexedDB database
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      
      // Handle errors
      request.onerror = event => {
        console.error("Database error:", event.target.error);
        this.isInitializing = false;
        reject(event.target.error);
      };
      
      // Handle successful opening
      request.onsuccess = event => {
        console.log("Database opened successfully");
        this.db = event.target.result;
        this.isInitializing = false;
        
        // Resolve all pending callbacks
        this.initCallbacks.forEach(callback => callback(this.db));
        this.initCallbacks = [];
        
        resolve(this.db);
      };
      
      // Handle database upgrades
      request.onupgradeneeded = event => {
        console.log("Database upgrade needed, creating stores...");
        const db = event.target.result;
        
        // Create attribute hours store if it doesn't exist
        if (!db.objectStoreNames.contains(STORES.ATTRIBUTE_HOURS)) {
          db.createObjectStore(STORES.ATTRIBUTE_HOURS, { keyPath: "attribute" });
          console.log("Created attribute hours store");
        }
      };
    });
  }

  // Basic get operation
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
  
  // Basic getAll operation
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
  
  // Basic add operation
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
  
  // Basic update operation
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
