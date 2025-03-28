// questService.js - Enhanced with better logging
console.log("Loading quest service module...");

class QuestService {
  constructor(db) {
    this.db = db;
    this.userId = 'default_user';
    console.log("QuestService instance created");
  }
  
  async initializeWithQuestData(questsData) {
    try {
      console.log(`Attempting to initialize ${questsData.length} quests...`);
      
      // Add all quests to the database
      for (const quest of questsData) {
        await this.db.update(STORES.QUESTS, quest);
      }
      
      // Verify they were stored
      const storedQuests = await this.getAllQuests();
      console.log(`Successfully stored ${storedQuests.length} quests in database`);
      return true;
    } catch (error) {
      console.error('Failed to initialize quest data:', error);
      return false;
    }
  }
  
  async getAllQuests() {
    try {
      const quests = await this.db.getAll(STORES.QUESTS);
      console.log(`Retrieved ${quests.length} quests from database`);
      return quests;
    } catch (error) {
      console.error('Error retrieving quests:', error);
      return [];
    }
  }
  
  async getQuestsByType(type) {
    try {
      const quests = await this.db.getAll(STORES.QUESTS, 'type', type);
      console.log(`Retrieved ${quests.length} quests of type ${type}`);
      return quests;
    } catch (error) {
      console.error(`Error retrieving quests of type ${type}:`, error);
      return [];
    }
  }
  
  async getQuest(questId) {
    try {
      const quest = await this.db.get(STORES.QUESTS, questId);
      console.log(`Retrieved quest ${questId}:`, quest ? "Found" : "Not found");
      return quest;
    } catch (error) {
      console.error(`Error retrieving quest ${questId}:`, error);
      return null;
    }
  }
}

// Create and export instance
window.questService = new QuestService(window.dicedDB);
console.log("Quest service module loaded");
