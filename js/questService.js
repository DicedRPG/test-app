// questService.js - Basic quest service implementation
console.log("Loading quest service module...");

class QuestService {
  constructor(db) {
    this.db = db;
    this.userId = 'default_user'; // For single-user mode
    console.log("QuestService instance created");
  }
  
  // Initialize database with quest data
  async initializeWithQuestData(questsData) {
    try {
      // Add all quests to the database
      for (const quest of questsData) {
        await this.db.update(STORES.QUESTS, quest);
      }
      console.log(`Initialized database with ${questsData.length} quests`);
      return true;
    } catch (error) {
      console.error('Failed to initialize quest data:', error);
      return false;
    }
  }
  
  // Get all quests
  async getAllQuests() {
    return this.db.getAll(STORES.QUESTS);
  }
  
  // Get quests by type
  async getQuestsByType(type) {
    return this.db.getAll(STORES.QUESTS, 'type', type);
  }
  
  // Get a specific quest
  async getQuest(questId) {
    return this.db.get(STORES.QUESTS, questId);
  }
}

// Create and export instance
window.questService = new QuestService(window.dicedDB);
console.log("Quest service module loaded");
