// userService.js - User service for DICED app
console.log("Loading user service module...");

class UserService {
  constructor(db) {
    this.db = db;
    console.log("UserService instance created");
  }
  
  // Get attribute hours
  async getAttributeHours(attribute) {
    try {
      const data = await this.db.get(STORES.ATTRIBUTE_HOURS, attribute);
      return data ? data.hours : 0;
    } catch (error) {
      console.warn(`No hours found for ${attribute}:`, error);
      return 0;
    }
  }
  
  // Get all attribute hours
  async getAllAttributeHours() {
    try {
      const attributes = await this.db.getAll(STORES.ATTRIBUTE_HOURS);
      
      // Default attributes with zero hours
      const result = {
        technique: 0,
        management: 0,
        flavor: 0,
        ingredients: 0
      };
      
      // Update with stored values
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
  
  // Update attribute hours
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
  
  // Add attribute hours (increment)
  async addAttributeHours(attribute, additionalHours) {
    try {
      // Get current hours
      const currentHours = await this.getAttributeHours(attribute);
      
      // Calculate new total
      const newTotal = currentHours + additionalHours;
      
      // Update storage
      return this.updateAttributeHours(attribute, newTotal);
    } catch (error) {
      console.error(`Failed to add hours to ${attribute}:`, error);
      throw error;
    }
  }
}

// Create a global instance
window.userService = new UserService(window.dicedDB);
console.log("User service module loaded, userService object created");
