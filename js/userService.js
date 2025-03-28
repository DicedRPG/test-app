// userService.js - User service for DICED app
console.log("Loading user service module...");

class UserService {
  constructor(db) {
    this.db = db;
    console.log("UserService instance created");
  }
  
  async getAttributeHours(attribute) {
    try {
      const data = await this.db.get(STORES.ATTRIBUTE_HOURS, attribute);
      return data ? data.hours : 0;
    } catch (error) {
      console.warn(`No hours found for ${attribute}:`, error);
      return 0;
    }
  }
  
  async getAllAttributeHours() {
    try {
      const attributes = await this.db.getAll(STORES.ATTRIBUTE_HOURS);
      
      const result = {
        technique: 0,
        management: 0,
        flavor: 0,
        ingredients: 0
      };
      
      attributes.forEach(item => {
        result[item.attribute] = item.hours;
      });
      
      return result;
    } catch (error) {
      console.error('Failed to get attribute hours:', error);
      return {
        technique: 0,
        management: 0,
        flavor: 0,
        ingredients: 0
      };
    }
  }
  
  async updateAttributeHours(attribute, hours) {
    try {
      const now = new Date();
      const data = {
        attribute,
        hours,
        lastUpdated: now
      };
      
      await this.db.update(STORES.ATTRIBUTE_HOURS, data);
      return data;
    } catch (error) {
      console.error(`Failed to update hours for ${attribute}:`, error);
      throw error;
    }
  }
  
  async addAttributeHours(attribute, additionalHours) {
    try {
      const currentHours = await this.getAttributeHours(attribute);
      const newTotal = currentHours + additionalHours;
      return this.updateAttributeHours(attribute, newTotal);
    } catch (error) {
      console.error(`Failed to add hours to ${attribute}:`, error);
      throw error;
    }
  }
}

// Create a global instance
window.userService = new UserService(window.dicedDB);
console.log("User service module loaded");
