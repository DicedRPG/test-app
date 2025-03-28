// questService.js - Quest operations

class QuestService {
  constructor(db) {
    this.db = db;
  }
  
  // Initialize database with quest data
  async initializeWithData(questsData, stagesData) {
    try {
      // Add quests
      await this.db.bulkAdd(STORES.QUESTS, questsData);
      
      // Add stages
      await this.db.bulkAdd(STORES.QUEST_STAGES, stagesData);
      
      console.log('Quest data initialized successfully');
      return true;
    } catch (error) {
      console.error('Failed to initialize quest data:', error);
      return false;
    }
  }
  
  // Get all quest basic information
  async getAllQuests() {
    return this.db.getAll(STORES.QUESTS);
  }
  
  // Get quests by stage
  async getQuestsByStage(stageId) {
    return this.db.getAll(STORES.QUESTS, 'stageId', stageId);
  }
  
  // Get quests by type
  async getQuestsByType(type) {
    return this.db.getAll(STORES.QUESTS, 'type', type);
  }
  
  // Get quests by rank
  async getQuestsByRank(rank) {
    return this.db.getAll(STORES.QUESTS, 'rank', rank);
  }
  
  // Get a specific quest's basic info
  async getQuest(questId) {
    return this.db.get(STORES.QUESTS, questId);
  }
  
  // Get detailed quest information
  async getQuestDetails(questId) {
    // Try to get from database
    let details = await this.db.get(STORES.QUEST_DETAILS, questId);
    
    // If not found in database, try to load from external source
    if (!details) {
      details = await this.loadQuestDetailsFromExternal(questId);
      
      // Save to database if loaded successfully
      if (details) {
        await this.db.add(STORES.QUEST_DETAILS, details);
      }
    }
    
    return details;
  }
  
  // Load quest details from external file
  async loadQuestDetailsFromExternal(questId) {
    try {
      const response = await fetch(`data/quest-details/${questId}.json`);
      if (!response.ok) {
        throw new Error(`Failed to load quest details for quest ${questId}`);
      }
      
      const details = await response.json();
      return {
        questId,
        ...details
      };
    } catch (error) {
      console.warn(`No detailed data found for quest ${questId}:`, error);
      // Return empty structure as fallback
      return {
        questId,
        learningObjectives: [],
        equipmentNeeded: [],
        contentSections: [],
        practicalExercises: [],
        completionChecklist: [],
        tipsForSuccess: []
      };
    }
  }
  
  // Get full quest data with details
  async getFullQuestData(questId) {
    const [basic, details] = await Promise.all([
      this.getQuest(questId),
      this.getQuestDetails(questId)
    ]);
    
    if (!basic) {
      throw new Error(`Quest ${questId} not found`);
    }
    
    // Merge basic and detailed information
    return {
      ...basic,
      ...details
    };
  }
  
  // Record quest completion
  async recordQuestCompletion(questId, userId, completionLevel, notes, checkedItems) {
    const now = new Date();
    
    // Try to get existing progress
    let progress;
    try {
      progress = await this.db.get(STORES.USER_PROGRESS, [questId, userId]);
    } catch (error) {
      // If not found, create new
      progress = {
        questId,
        userId,
        completions: [],
        checkedItems: [],
        notes: ''
      };
    }
    
    // Add new completion record
    progress.completions.push({
      timestamp: now,
      completionLevel,
      notes
    });
    
    // Update checked items and notes
    if (checkedItems) {
      progress.checkedItems = checkedItems;
    }
    
    if (notes) {
      progress.notes = notes;
    }
    
    progress.lastAttempted = now;
    
    // Save back to database
    await this.db.update(STORES.USER_PROGRESS, progress);
    
    return progress;
  }
  
  // Get quest stages
  async getAllStages() {
    return this.db.getAll(STORES.QUEST_STAGES);
  }
  
  // Get specific stage
  async getStage(stageId) {
    return this.db.get(STORES.QUEST_STAGES, stageId);
  }
}

// Create and export service instance
const questService = new QuestService(dicedDB);