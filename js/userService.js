// userService.js - User progress operations

class UserService {
  constructor(db) {
    this.db = db;
    this.currentUserId = 'default_user'; // For single-user mode
  }
  
  // Set current user
  setCurrentUser(userId) {
    this.currentUserId = userId;
  }
  
  // Get current user ID
  getCurrentUserId() {
    return this.currentUserId;
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
      
      // Format into an object with attribute names as keys
      const result = {};
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
    const now = new Date();
    
    try {
      const currentData = await this.db.get(STORES.ATTRIBUTE_HOURS, attribute);
      
      if (currentData) {
        // Update existing record
        currentData.hours = hours;
        currentData.lastUpdated = now;
        await this.db.update(STORES.ATTRIBUTE_HOURS, currentData);
        return currentData;
      } else {
        // Create new record
        const newData = {
          attribute,
          hours,
          lastUpdated: now
        };
        await this.db.add(STORES.ATTRIBUTE_HOURS, newData);
        return newData;
      }
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
  
  // Get user's quest progress
  async getQuestProgress(questId) {
    try {
      return await this.db.get(STORES.USER_PROGRESS, [questId, this.currentUserId]);
    } catch (error) {
      console.warn(`No progress found for quest ${questId}:`, error);
      return null;
    }
  }
  
  // Get all completed quests for current user
  async getCompletedQuests() {
    try {
      const allProgress = await this.db.getAll(
        STORES.USER_PROGRESS,
        'userId',
        this.currentUserId
      );
      
      // Filter to include only quests with at least one completion
      return allProgress.filter(progress => 
        progress.completions && progress.completions.length > 0
      );
    } catch (error) {
      console.error('Failed to get completed quests:', error);
      return [];
    }
  }
}

// Create and export service instance
const userService = new UserService(dicedDB);