// questSystem.js - Updated to use database

const questSystem = {
  currentFilter: 'all',
  
  async initialize() {
    console.log('Initializing quest system...');
    
    // Check if we need to load initial data
    const existingQuests = await questService.getAllQuests();
    if (!existingQuests || existingQuests.length === 0) {
      console.log('Loading initial quest data...');
      await this.loadInitialData();
    }
    
    // Set up event listeners
    document.getElementById('random-quest').addEventListener('click', 
      () => this.selectRandomQuest());
        
    document.getElementById('view-all-quests').addEventListener('click', 
      () => this.showQuestList());
        
    // Set up filter buttons
    this.setupFilterButtons();
    
    // Show initial quest list
    await this.showQuestList();
  },
  
  async loadInitialData() {
    // Load quests data
    const questsResponse = await fetch('data/quests.json');
    const questsData = await questsResponse.json();
    
    // Load stages data
    const stagesResponse = await fetch('data/stages.json');
    const stagesData = await stagesResponse.json();
    
    // Initialize database with data
    await questService.initializeWithData(questsData, stagesData);
  },
  
  async setupFilterButtons() {
    const filterContainer = document.getElementById('quest-filters');
    if (!filterContainer) return;
    
    // Clear previous filters
    filterContainer.innerHTML = '';
    
    // Add 'All' filter
    const allButton = document.createElement('button');
    allButton.className = `filter-button ${this.currentFilter === 'all' ? 'active' : ''}`;
    allButton.textContent = 'All Quests';
    allButton.addEventListener('click', () => this.setFilter('all'));
    filterContainer.appendChild(allButton);
    
    // Get all quest types from database
    const quests = await questService.getAllQuests();
    const questTypes = [...new Set(quests.map(q => q.type))];
    
    // Add type-specific filters
    questTypes.forEach(type => {
      const button = document.createElement('button');
      button.className = `filter-button ${this.currentFilter === type ? 'active' : ''}`;
      button.setAttribute('data-type', type);
      button.textContent = type;
      button.addEventListener('click', () => this.setFilter(type));
      filterContainer.appendChild(button);
    });
  },
  
  setFilter(filter) {
    this.currentFilter = filter;
    
    // Update button styles
    document.querySelectorAll('.filter-button').forEach(button => {
      button.classList.toggle('active', 
        button.textContent === (filter === 'all' ? 'All Quests' : filter));
    });
    
    // Refresh quest list
    this.showQuestList();
  },
  
  async getFilteredQuests() {
    // Get quests matching current filter
    let filteredQuests;
    
    if (this.currentFilter === 'all') {
      filteredQuests = await questService.getAllQuests();
    } else {
      filteredQuests = await questService.getQuestsByType(this.currentFilter);
    }
    
    return filteredQuests;
  },
  
  async selectRandomQuest() {
    const quests = await this.getFilteredQuests();
    if (quests.length === 0) {
      alert('No quests available with current filter');
      return;
    }
    
    const randomIndex = Math.floor(Math.random() * quests.length);
    this.showQuestDetails(quests[randomIndex]);
  },
  
  async showQuestList() {
    const questList = document.getElementById('quest-list');
    const currentQuest = document.getElementById('current-quest');
    
    if (!questList || !currentQuest) return;
    
    const filteredQuests = await this.getFilteredQuests();
    
    // Show quest list, hide details
    questList.classList.remove('hidden');
    currentQuest.classList.add('hidden');
    
    // Show filtered quests count
    questList.innerHTML = `
      <div class="quest-list-header">
        <div class="quest-list-counts">
          Showing ${filteredQuests.length} quests
          ${this.currentFilter !== 'all' ? ` (filtered to ${this.currentFilter})` : ''}
        </div>
      </div>
    `;
    
    // Create quest grid
    const questGrid = document.createElement('div');
    questGrid.className = 'quest-grid';
    
    // Get user's completed quests
    const userProgress = await userService.getCompletedQuests();
    const completedQuestIds = userProgress.map(p => p.questId);
    
    // Add quest items
    for (const quest of filteredQuests) {
      const questItem = await this.createQuestItem(quest, completedQuestIds.includes(quest.id));
      questGrid.appendChild(questItem);
    }
    
    questList.appendChild(questGrid);
  },
  
  async createQuestItem(quest, isCompleted) {
    const questItem = document.createElement('div');
    questItem.className = `quest-item ${isCompleted ? 'completed' : ''}`;
    
    // Get completion count
    let completionCount = 0;
    if (isCompleted) {
      const progress = await userService.getQuestProgress(quest.id);
      completionCount = progress ? progress.completions.length : 0;
    }
    
    // Color indicator based on quest type
    const typeColor = QUEST_TYPE_COLORS[quest.type] || '#888888';
    
    questItem.innerHTML = `
      <div class="quest-type-banner" style="background-color: ${typeColor};"></div>
      <div class="quest-content">
        <h4>${quest.questName}</h4>
        <p>${quest.description}</p>
        <div class="quest-details">
          <span>${quest.primaryFocus}: ${quest.primaryHours}h</span>
          <span>${quest.secondaryFocus}: ${quest.secondaryHours}h</span>
          ${quest.diceRequired ? '<span class="dice-required">🎲</span>' : ''}
          ${isCompleted ? `<span class="completion-badge">✓ ${completionCount}</span>` : ''}
        </div>
      </div>
    `;
    
    // Add click handler
    questItem.addEventListener('click', () => this.showQuestDetails(quest));
    
    return questItem;
  },
  
  async showQuestDetails(quest) {
    const questList = document.getElementById('quest-list');
    const currentQuest = document.getElementById('current-quest');
    
    if (!questList || !currentQuest) return;
    
    // Show loading state
    currentQuest.innerHTML = '<div class="loading">Loading quest details...</div>';
    
    // Show quest details, hide list
    questList.classList.add('hidden');
    currentQuest.classList.remove('hidden');
    
    try {
      // Load full quest data with details
      const fullQuest = await questService.getFullQuestData(quest.id);
      
      // Get completion info
      const progress = await userService.getQuestProgress(fullQuest.id);
      const completionCount = progress ? progress.completions.length : 0;
      
      // Quest type color
      const questColor = QUEST_TYPE_COLORS[fullQuest.type] || '#888888';
      
      // Build the details HTML
      currentQuest.innerHTML = `
        <div class="quest-details">
          <div class="quest-type-banner-large" style="background-color: ${questColor}"></div>
          
          <div class="quest-header">
            <div>
              <h2 class="quest-title">${fullQuest.questName}</h2>
              <p class="quest-meta">
                Stage ${fullQuest.stageId || '?'}: ${fullQuest.stageName || 'Unknown'} • 
                <span class="quest-type-text" style="color: ${questColor}">${fullQuest.type}</span>
                ${completionCount > 0 ? `
                  <span class="completed-text">
                    • Completed ${completionCount} time${completionCount > 1 ? 's' : ''}
                  </span>
                ` : ''}
              </p>
            </div>
            ${fullQuest.diceRequired ? `
              <div class="quest-dice-required">
                <span>🎲</span>
                Dice Roll Required
              </div>
            ` : ''}
          </div>
          
          <div class="quest-description">
            <p>${fullQuest.description}</p>
          </div>
          
          <div class="quest-focus-grid">
            <div class="focus-box primary">
              <p class="focus-label">Primary Focus</p>
              <p class="focus-value">${fullQuest.primaryFocus} • ${fullQuest.primaryHours}h</p>
            </div>
            <div class="focus-box secondary">
              <p class="focus-label">Secondary Focus</p>
              <p class="focus-value">${fullQuest.secondaryFocus} • ${fullQuest.secondaryHours}h</p>
            </div>
          </div>
          
          ${this.buildDetailedQuestContent(fullQuest)}
          
          ${fullQuest.diceRequired ? this.buildDiceRollSection(fullQuest) : ''}
          
          <div class="quest-actions">
            <button id="back-to-quest-list" class="quest-button secondary">
              Back to Quest List
            </button>
            <button id="start-quest-button" class="quest-button primary">
              ${fullQuest.diceRequired && !this.hasRolledDice(fullQuest.id) 
                ? 'Roll Dice & Start Quest' 
                : 'Start Quest'}
            </button>
          </div>
        </div>
      `;
      
      // Add event listeners
      document.getElementById('back-to-quest-list').addEventListener('click', () => {
        this.showQuestList();
      });
      
      document.getElementById('start-quest-button').addEventListener('click', () => {
        if (fullQuest.diceRequired && !this.hasRolledDice(fullQuest.id)) {
          this.rollDiceForQuest(fullQuest);
        } else {
          this.showCookingMode(fullQuest);
        }
      });
      
      // Add expand/collapse functionality to sections
      document.querySelectorAll('.section-header').forEach(header => {
        header.addEventListener('click', () => {
          const content = header.nextElementSibling;
          content.classList.toggle('collapsed');
          header.classList.toggle('collapsed');
        });
      });
    } catch (error) {
      console.error('Failed to load quest details:', error);
      currentQuest.innerHTML = `
        <div class="error-message">
          <h3>Error Loading Quest</h3>
          <p>Failed to load details for quest ${quest.id}. Please try again later.</p>
          <button id="back-to-quest-list" class="quest-button secondary">
            Back to Quest List
          </button>
        </div>
      `;
      
      document.getElementById('back-to-quest-list').addEventListener('click', () => {
        this.showQuestList();
      });
    }
  },

  // Additional methods for dice rolling, cooking mode, etc.
  // (These would be similar to your existing implementation, but adapted to use the database services)
};