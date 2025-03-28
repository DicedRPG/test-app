// State Management
const STORAGE_KEY = 'diced_rpg_state';

const initialState = {
    attributeHours: {
        technique: 0,
        ingredients: 0,
        flavor: 0,
        management: 0
    },
    completedQuests: [],
    visibleQuests: [], // For quest progression
    pathProgress: {},  // For path-based learning
    activeView: 'list', // 'list', 'detail', 'path', 'completion'
    currentQuest: null,
    questRolls: {},    // For dice mechanics
    lastUpdate: new Date().toISOString()
};

class Store {
    constructor() {
        this._state = {...initialState};
        this._listeners = [];
    }
    
    getState() {
        return {...this._state};
    }
    
    setState(newState) {
        this._state = {...newState};
        this._notifyListeners();
        this._saveToStorage();
    }
    
    updateState(path, value) {
        // Handle dot notation paths (e.g., 'attributeHours.technique')
        const parts = path.split('.');
        let current = this._state;
        const lastKey = parts.pop();
        
        for (const key of parts) {
            if (current[key] === undefined) {
                current[key] = {};
            }
            current = current[key];
        }
        
        current[lastKey] = value;
        
        this._notifyListeners();
        this._saveToStorage();
    }
    
    subscribe(listener) {
        this._listeners.push(listener);
        return () => {
            this._listeners = this._listeners.filter(l => l !== listener);
        };
    }
    
    _notifyListeners() {
        this._listeners.forEach(listener => listener(this._state));
    }
    
    _saveToStorage() {
        try {
            this._state.lastUpdate = new Date().toISOString();
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this._state));
        } catch (error) {
            console.error('Failed to save state:', error);
        }
    }
    
    loadFromStorage() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const parsedState = JSON.parse(saved);
                // Merge with initial state to ensure all properties exist
                this._state = {
                    ...initialState,
                    ...parsedState,
                    attributeHours: {
                        ...initialState.attributeHours,
                        ...parsedState.attributeHours
                    }
                };
                this._notifyListeners();
            }
        } catch (error) {
            console.error('Failed to load state:', error);
        }
    }
}

const store = new Store();

// Quest System
const questSystem = {
    currentFilter: 'all',
    
    initialize() {
        console.log('Initializing quest system...');
        
        // Set up event listeners
        document.getElementById('random-quest').addEventListener('click', 
            () => this.selectRandomQuest());
            
        document.getElementById('view-all-quests').addEventListener('click', 
            () => this.showQuestList());
            
        // Set up filter buttons
        this.setupFilterButtons();
        
        // Initialize progression if needed
        const state = store.getState();
        if (!state.visibleQuests || state.visibleQuests.length === 0) {
            this.initializeVisibleQuests();
        }
        
        // Show initial quest list
        this.showQuestList();
    },
    
    initializeVisibleQuests() {
        // Group quests by type
        const questsByType = {
            'Training': QUEST_DATA.filter(q => q.type === 'Training'),
            'Main': QUEST_DATA.filter(q => q.type === 'Main'),
            'Side': QUEST_DATA.filter(q => q.type === 'Side'),
            'Explore': QUEST_DATA.filter(q => q.type === 'Explore')
        };
        
        // Show 3 of each type initially
        let initialQuests = [];
        for (const [type, quests] of Object.entries(questsByType)) {
            // Sort by ID (lower ID = easier)
            const sortedQuests = [...quests].sort((a, b) => a.id - b.id);
            // Take first 3
            initialQuests = initialQuests.concat(sortedQuests.slice(0, 3));
        }
        
        // Save to state
        store.updateState('visibleQuests', initialQuests.map(q => q.id));
    },
    
    setupFilterButtons() {
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
        
        // Add type-specific filters
        const questTypes = [...new Set(QUEST_DATA.map(q => q.type))];
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
    
    getFilteredQuests() {
        // Get quests matching current filter
        const filteredByType = this.currentFilter === 'all' 
            ? QUEST_DATA 
            : QUEST_DATA.filter(q => q.type === this.currentFilter);
            
        // Filter to only show visible quests (for progression)
        const state = store.getState();
        const visibleQuestIds = state.visibleQuests || [];
        
        return filteredByType.filter(quest => visibleQuestIds.includes(quest.id));
    },
    
    selectRandomQuest() {
        const quests = this.getFilteredQuests();
        if (quests.length === 0) {
            alert('No quests available with current filter');
            return;
        }
        
        const randomIndex = Math.floor(Math.random() * quests.length);
        this.showQuestDetails(quests[randomIndex]);
    },
    
    showQuestList() {
        const questList = document.getElementById('quest-list');
        const currentQuest = document.getElementById('current-quest');
        
        if (!questList || !currentQuest) return;
        
        const filteredQuests = this.getFilteredQuests();
        
        // Show quest list, hide details
        questList.classList.remove('hidden');
        currentQuest.classList.add('hidden');
        
        // Show filtered quests count
        questList.innerHTML = `
            <div class="quest-list-header">
                <div class="quest-list-counts">
                    Showing ${filteredQuests.length} of ${QUEST_DATA.length} quests
                    ${this.currentFilter !== 'all' ? ` (filtered to ${this.currentFilter})` : ''}
                </div>
            </div>
        `;
        
        // Create quest grid
        const questGrid = document.createElement('div');
        questGrid.className = 'quest-grid';
        
        // Add quest items
        filteredQuests.forEach(quest => {
            const questItem = this.createQuestItem(quest);
            questGrid.appendChild(questItem);
        });
        
        questList.appendChild(questGrid);
    },
    
    createQuestItem(quest) {
        const state = store.getState();
        const completions = state.completedQuests.filter(c => c.questId === quest.id);
        const hasCompleted = completions.length > 0;
        
        const questItem = document.createElement('div');
        questItem.className = `quest-item ${hasCompleted ? 'completed' : ''}`;
        
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
                    ${hasCompleted ? `<span class="completion-badge">✓ ${completions.length}</span>` : ''}
                </div>
            </div>
        `;
        
        // Add click handler
        questItem.addEventListener('click', () => this.showQuestDetails(quest));
        
        return questItem;
    },
    
    showQuestDetails(quest) {
        const questList = document.getElementById('quest-list');
        const currentQuest = document.getElementById('current-quest');
        
        if (!questList || !currentQuest) return;
        
        // Get completion info
        const state = store.getState();
        const completions = state.completedQuests.filter(c => c.questId === quest.id);
        const completionCount = completions.length;
        
        // Show quest details, hide list
        questList.classList.add('hidden');
        currentQuest.classList.remove('hidden');
        
        // Update current quest in state
        store.updateState('currentQuest', quest.id);
        
        // Quest type color
        const questColor = QUEST_TYPE_COLORS[quest.type] || '#888888';
        
        // Build details HTML
        currentQuest.innerHTML = `
            <div class="quest-details">
                <div class="quest-type-banner-large" style="background-color: ${questColor}"></div>
                <div class="quest-header">
                    <div>
                        <h4 class="text-xl font-bold mb-1">${quest.questName}</h4>
                        <p class="text-sm text-gray-600">
                            ${quest.rank} • <span class="quest-type-text" style="color: ${questColor}">${quest.type}</span>
                            ${completionCount > 0 ? `
                                <span class="completed-text">
                                    • Completed ${completionCount} time${completionCount > 1 ? 's' : ''}
                                </span>
                            ` : ''}
                        </p>
                    </div>
                    ${quest.diceRequired ? `
                        <div class="quest-dice-required">
                            <span>🎲</span>
                            Dice Roll Required
                        </div>
                    ` : ''}
                </div>
                
                <p class="text-gray-700 mb-4">${quest.description}</p>
                
                <div class="quest-focus-grid">
                    <div class="focus-box primary">
                        <p class="text-sm font-semibold text-blue-700">Primary Focus</p>
                        <p class="text-lg">${quest.primaryFocus} • ${quest.primaryHours}h</p>
                    </div>
                    <div class="focus-box secondary">
                        <p class="text-sm font-semibold text-green-700">Secondary Focus</p>
                        <p class="text-lg">${quest.secondaryFocus} • ${quest.secondaryHours}h</p>
                    </div>
                </div>
                
                ${quest.diceRequired ? this.buildDiceRollSection(quest) : ''}
                
                <div class="mt-6 flex justify-between">
                    <button id="back-to-quest-list" 
                        class="quest-button secondary">
                        Back to List
                    </button>
                    <button id="start-quest-button"
                        class="quest-button primary">
                        ${quest.diceRequired && !this.hasRolledDice(quest.id) 
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
            if (quest.diceRequired && !this.hasRolledDice(quest.id)) {
                this.rollDiceForQuest(quest);
            } else {
                this.showCookingMode(quest);
            }
        });
    },
    
    hasRolledDice(questId) {
        const state = store.getState();
        return state.questRolls && state.questRolls[questId];
    },
    
    buildDiceRollSection(quest) {
        const state = store.getState();
        const rolls = state.questRolls && state.questRolls[quest.id];
        
        if (!rolls) {
            return `
                <div class="dice-roll-section">
                    <h4>Dice Roll Required</h4>
                    <p>This quest requires dice rolls to determine specific elements.</p>
                </div>
            `;
        }
        
        // Show rolled results
        let rollHtml = `
            <div class="dice-roll-section">
                <h4>Your Roll Results</h4>
                <ul class="dice-results">
        `;
        
        for (const [key, value] of Object.entries(rolls)) {
            rollHtml += `<li><strong>${key}:</strong> ${value}</li>`;
        }
        
        rollHtml += `
                </ul>
            </div>
        `;
        
        return rollHtml;
    },
    
    rollDiceForQuest(quest) {
        if (!quest.diceRequired) return;
        
        // Define possible roll options
        const rollOptions = {
            'Protein Type': ['Chicken', 'Beef', 'Pork', 'Tofu', 'Shrimp'],
            'Sauce Style': ['Tomato Basil', 'Alfredo', 'Pesto', 'Garlic Butter', 'Spicy Arrabbiata'],
            'Knife Type': ['Chef\'s Knife', 'Santoku', 'Utility Knife', 'Paring Knife'],
            'Cutting Style': ['Julienne', 'Brunoise', 'Chiffonade', 'Batonnet']
        };
        
        // Figure out what we need to roll for
        const rollTypes = [];
        if (quest.description.includes('protein')) rollTypes.push('Protein Type');
        if (quest.description.includes('sauce')) rollTypes.push('Sauce Style');
        if (quest.description.includes('knife')) rollTypes.push('Knife Type');
        if (quest.description.includes('cut')) rollTypes.push('Cutting Style');
        
        // If no specific types found, pick random ones based on focus
        if (rollTypes.length === 0) {
            if (quest.primaryFocus === 'Technique') {
                rollTypes.push('Knife Type', 'Cutting Style');
            } else if (quest.primaryFocus === 'Flavor') {
                rollTypes.push('Sauce Style', 'Protein Type');
            } else {
                // Default to protein and sauce
                rollTypes.push('Protein Type', 'Sauce Style');
            }
        }
        
        // Roll the dice!
        const rollResults = {};
        
        rollTypes.forEach(type => {
            const options = rollOptions[type] || [];
            if (options.length > 0) {
                const randomIndex = Math.floor(Math.random() * options.length);
                rollResults[type] = options[randomIndex];
            }
        });
        
        // Save the results
        const state = store.getState();
        const questRolls = {...state.questRolls, [quest.id]: rollResults};
        store.updateState('questRolls', questRolls);
        
        // Show the updated quest details
        this.showQuestDetails(quest);
    },
    
    showCookingMode(quest) {
        // Simplified cooking mode for HTML version
        const currentQuest = document.getElementById('current-quest');
        if (!currentQuest) return;
        
        // Get dice rolls if applicable
        const state = store.getState();
        const rolls = state.questRolls && state.questRolls[quest.id] || {};
        
        // Set basic cooking steps based on quest type
        let steps = [];
        
        if (quest.type === 'Main') {
            steps = [
                { title: 'Preparation', instructions: ['Gather all ingredients', 'Prepare your workspace'] },
                { title: 'Main Step', instructions: ['Follow the recipe guidelines'] },
                { title: 'Completion', instructions: ['Plate your dish', 'Clean your workspace'] }
            ];
        } else if (quest.type === 'Side') {
            steps = [
                { title: 'Preparation', instructions: ['Gather all ingredients'] },
                { title: 'Cooking', instructions: ['Follow the recipe guidelines'] }
            ];
        } else {
            steps = [
                { title: 'Preparation', instructions: ['Get ready for the training exercise'] },
                { title: 'Practice', instructions: ['Practice the technique described'] }
            ];
        }
        
        // Show cooking mode UI
        currentQuest.innerHTML = `
            <div class="cooking-mode">
                <div class="cooking-header">
                    <h3>${quest.questName}</h3>
                    <p>Follow these steps to complete your quest</p>
                </div>
                
                ${Object.keys(rolls).length > 0 ? `
                    <div class="roll-results">
                        <h4>Your Roll Results:</h4>
                        <ul>
                            ${Object.entries(rolls).map(([key, value]) => 
                                `<li><strong>${key}:</strong> ${value}</li>`
                            ).join('')}
                        </ul>
                    </div>
                ` : ''}
                
                <div class="cooking-steps">
                    ${steps.map((step, index) => `
                        <div class="cooking-step">
                            <h4>Step ${index + 1}: ${step.title}</h4>
                            <ul>
                                ${step.instructions.map(instruction => 
                                    `<li>${instruction}</li>`
                                ).join('')}
                            </ul>
                        </div>
                    `).join('')}
                </div>
                
                <div class="cooking-actions">
                    <button id="back-to-details" class="quest-button secondary">Back</button>
                    <button id="complete-quest" class="quest-button primary">Complete Quest</button>
                </div>
            </div>
        `;
        
        // Add event listeners
        document.getElementById('back-to-details').addEventListener('click', () => {
            this.showQuestDetails(quest);
        });
        
        document.getElementById('complete-quest').addEventListener('click', () => {
            this.showCompletionScreen(quest);
        });
    },
    
    showCompletionScreen(quest) {
        // Honor system completion
        const currentQuest = document.getElementById('current-quest');
        if (!currentQuest) return;
        
        currentQuest.innerHTML = `
            <div class="quest-completion">
                <h3>Quest Complete: ${quest.questName}</h3>
                
                <div class="completion-assessment">
                    <h4>How did it go?</h4>
                    
                    <div class="completion-options">
                        <label class="completion-option">
                            <input type="radio" name="completion-level" value="mastered" checked>
                            <span>Mastered it! (100% reward)</span>
                        </label>
                        
                        <label class="completion-option">
                            <input type="radio" name="completion-level" value="wellDone">
                            <span>Did well, need practice (80% reward)</span>
                        </label>
                        
                        <label class="completion-option">
                            <input type="radio" name="completion-level" value="struggled">
                            <span>Struggled but completed (60% reward)</span>
                        </label>
                    </div>
                </div>
                
                <div class="completion-notes">
                    <h4>Notes (optional):</h4>
                    <textarea id="completion-notes" placeholder="Add your reflections here..."></textarea>
                </div>
                
                <div class="completion-actions">
                    <button id="back-to-cooking" class="quest-button secondary">Back</button>
                    <button id="confirm-completion" class="quest-button primary">Confirm Completion</button>
                </div>
            </div>
        `;
        
        // Add event listeners
        document.getElementById('back-to-cooking').addEventListener('click', () => {
            this.showCookingMode(quest);
        });
        
        document.getElementById('confirm-completion').addEventListener('click', () => {
            const completionLevel = document.querySelector('input[name="completion-level"]:checked').value;
            const notes = document.getElementById('completion-notes').value;
            
            this.completeQuest(quest, completionLevel, notes);
        });
    },
    
    completeQuest(quest, completionLevel = 'mastered', notes = '') {
        // Calculate rewards based on completion level
        let primaryMultiplier = 1.0;
        let secondaryMultiplier = 1.0;
        
        if (completionLevel === 'wellDone') {
            primaryMultiplier = 0.8;
            secondaryMultiplier = 0.8;
        } else if (completionLevel === 'struggled') {
            primaryMultiplier = 0.6;
            secondaryMultiplier = 0.6;
        }
        
        const primaryHours = quest.primaryHours * primaryMultiplier;
        const secondaryHours = quest.secondaryHours * secondaryMultiplier;
        
        // Add completion record
        const state = store.getState();
        const newCompletions = [
            ...state.completedQuests,
            {
                questId: quest.id,
                completedAt: new Date().toISOString(),
                completionLevel,
                notes
            }
        ];
        
        store.updateState('completedQuests', newCompletions);
        
        // Add attribute hours
        const primaryAttr = quest.primaryFocus.toLowerCase();
        const secondaryAttr = quest.secondaryFocus.toLowerCase();
        
        store.updateState(
            `attributeHours.${primaryAttr}`, 
            (state.attributeHours[primaryAttr] || 0) + primaryHours
        );
        
        store.updateState(
            `attributeHours.${secondaryAttr}`, 
            (state.attributeHours[secondaryAttr] || 0) + secondaryHours
        );
        
        // Unlock new quests
        this.unlockNewQuests(quest);
        
        // Show completion summary
        this.showCompletionSummary(quest, primaryHours, secondaryHours);
    },
    
    unlockNewQuests(completedQuest) {
        // Find similar quests to unlock
        const state = store.getState();
        const visibleQuestIds = new Set(state.visibleQuests || []);
        const completedQuestIds = new Set(state.completedQuests.map(c => c.questId));
        
        // Find similar quests (same type and focus)
        let similarQuests = QUEST_DATA.filter(q => 
            !visibleQuestIds.has(q.id) && // Not already visible
            !completedQuestIds.has(q.id) && // Not already completed
            q.type === completedQuest.type && // Same type
            (q.primaryFocus === completedQuest.primaryFocus || 
             q.secondaryFocus === completedQuest.primaryFocus) // Similar focus
        );
        
        // If not enough similar quests, find more of the same type
        if (similarQuests.length < 2) {
            const sameTypeQuests = QUEST_DATA.filter(q => 
                !visibleQuestIds.has(q.id) && 
                !completedQuestIds.has(q.id) && 
                q.type === completedQuest.type &&
                !similarQuests.includes(q)
            );
            
            similarQuests = similarQuests.concat(sameTypeQuests);
        }
        
        // Sort by ID (proxy for difficulty)
        similarQuests.sort((a, b) => a.id - b.id);
        
        // Take the first 2 quests to unlock
        const questsToUnlock = similarQuests.slice(0, 2);
        
        // Add to visible quests
        for (const quest of questsToUnlock) {
            visibleQuestIds.add(quest.id);
        }
        
        // Update state
        store.updateState('visibleQuests', Array.from(visibleQuestIds));
        
        return questsToUnlock;
    },
    
    showCompletionSummary(quest, primaryHours, secondaryHours) {
        const currentQuest = document.getElementById('current-quest');
        if (!currentQuest) return;
        
        // Get newly unlocked quests
        const state = store.getState();
        const visibleQuestIds = state.visibleQuests || [];
        const completedQuestIds = state.completedQuests.map(c => c.questId);
        
        // Find quests that might have been newly unlocked
        const newlyUnlocked = QUEST_DATA.filter(q => 
            visibleQuestIds.includes(q.id) && 
            !completedQuestIds.includes(q.id) && 
            q.type === quest.type
        ).slice(0, 2); // Just show up to 2
        
        currentQuest.innerHTML = `
            <div class="quest-reflection">
                <h3>Quest Completed!</h3>
                
                <div class="quest-rewards">
                    <h4>Rewards Earned:</h4>
                    <p>${quest.primaryFocus}: +${primaryHours.toFixed(1)} hours</p>
                    <p>${quest.secondaryFocus}: +${secondaryHours.toFixed(1)} hours</p>
                </div>
                
                ${newlyUnlocked.length > 0 ? `
                    <div class="newly-unlocked">
                        <h4>New Quests Unlocked:</h4>
                        <ul>
                            ${newlyUnlocked.map(q => `
                                <li>${q.questName} (${q.type})</li>
                            `).join('')}
                        </ul>
                    </div>
                ` : ''}
                
                <div class="reflection-actions">
                    <button id="return-home" class="quest-button primary">Return Home</button>
                </div>
            </div>
        `;
        
        // Add event listener
        document.getElementById('return-home').addEventListener('click', () => {
            this.showQuestList();
        });
    }
};

// Attribute system
const attributeSystem = {
    initialize() {
        console.log('Initializing attribute system...');
        this.updateDisplay();
        
        // Add event listeners for add hours
        document.getElementById('add-hours-button').addEventListener('click', 
            () => this.handleAddHours());
        
        document.getElementById('adjust-hours-button').addEventListener('click', 
            () => this.handleAdjustHours());
        
        // Subscribe to state changes
        store.subscribe(() => this.updateDisplay());
    },
    
    // Calculate level for a specific attribute hours
    calculateLevel(totalHours) {
        // Find current rank
        let currentRank = RANKS[RANKS.length - 1];
        for (const rank of RANKS) {
            if (totalHours < rank.hoursNeeded) {
                currentRank = rank;
                break;
            }
        }
        
        // Find level within rank
        for (let i = 0; i < LEVELS.length; i++) {
            const level = LEVELS[i];
            const nextLevel = LEVELS[i + 1];
            
            if (!nextLevel || totalHours < nextLevel.startAt) {
                const hoursIntoLevel = totalHours - level.startAt;
                
                return {
                    level: level.level,
                    currentLevelHours: hoursIntoLevel,
                    hoursForLevel: level.hours,
                    totalHours: totalHours,
                    rank: currentRank.name,
                    color: currentRank.color
                };
            }
        }
        
        // Default to last level if not found
        const lastLevel = LEVELS[LEVELS.length - 1];
        return {
            level: lastLevel.level,
            currentLevelHours: totalHours - lastLevel.startAt,
            hoursForLevel: lastLevel.hours,
            totalHours: totalHours,
            rank: currentRank.name,
            color: currentRank.color
        };
    },
    
    // Calculate overall rank
    calculateOverallRank() {
        const state = store.getState();
        const totalHours = Object.values(state.attributeHours).reduce((sum, hours) => sum + hours, 0);
        const minAttributeHours = Math.min(...Object.values(state.attributeHours));
        
        // Find current rank
        let currentRank = RANKS[0];
        let previousRankTotal = 0;
        
        for (const rank of RANKS) {
            if (minAttributeHours < rank.hoursNeeded) {
                currentRank = rank;
                break;
            }
            previousRankTotal = rank.totalHoursNeeded;
        }
        
        return {
            name: currentRank.name,
            color: currentRank.color,
            totalHours: totalHours,
            currentRankHours: Math.max(0, totalHours - previousRankTotal),
            nextRankHours: currentRank.totalHoursNeeded - previousRankTotal,
            progress: ((totalHours - previousRankTotal) / (currentRank.totalHoursNeeded - previousRankTotal)) * 100
        };
    },
    
    // Update UI displays
    updateDisplay() {
        const state = store.getState();
        
        // Update overall rank display
        const overallRank = this.calculateOverallRank();
        
        document.getElementById('overall-rank').textContent = overallRank.name;
        document.getElementById('overall-hours').textContent = overallRank.totalHours.toFixed(1);
        document.getElementById('overall-next-rank').textContent = overallRank.nextRankHours.toFixed(1);
        
        // Update progress bar
        const progressBar = document.querySelector('.overall-rank-card .progress-fill');
        progressBar.style.width = `${Math.min(overallRank.progress, 100)}%`;
        progressBar.style.backgroundColor = overallRank.color;
        
        // Update each attribute
        ['technique', 'ingredients', 'flavor', 'management'].forEach(attribute => {
            const hours = state.attributeHours[attribute] || 0;
            const levelInfo = this.calculateLevel(hours);
            
            // Update hours display
            document.getElementById(`${attribute}-hours`).textContent = levelInfo.currentLevelHours.toFixed(1);
            
            // Update next level display
            document.getElementById(`${attribute}-next-level`).textContent = levelInfo.hoursForLevel;
            
            // Update level display
            document.getElementById(`${attribute}-level`).textContent = levelInfo.level;
            
            // Find and update attribute card
            const cards = document.querySelectorAll('.attribute-card');
            const card = Array.from(cards).find(card => {
                const header = card.querySelector('h3');
                return header && header.textContent.toLowerCase() === attribute;
            });
            
            if (card) {
                // Update rank display
                const rankDisplay = card.querySelector('.stats p:first-child');
                rankDisplay.textContent = `Current Rank: ${levelInfo.rank}`;
                
                // Update progress bar
                const progressFill = card.querySelector('.progress-fill');
                const progressPercent = (levelInfo.currentLevelHours / levelInfo.hoursForLevel * 100);
                progressFill.style.width = `${Math.min(progressPercent, 100)}%`;
                progressFill.style.backgroundColor = levelInfo.color;
            }
        });
    },
    
    handleAddHours() {
        const attribute = document.getElementById('attribute-select').value;
        const hours = parseFloat(document.getElementById('hours-input').value || 0);
        
        if (hours <= 0) {
            alert('Please enter a valid number of hours');
            return;
        }
        
        const state = store.getState();
        store.updateState(
            `attributeHours.${attribute}`, 
            (state.attributeHours[attribute] || 0) + hours
        );
        
        // Reset input
        document.getElementById('hours-input').value = '1';
    },
    
    handleAdjustHours() {
        const attribute = document.getElementById('attribute-select').value;
        const state = store.getState();
        const currentHours = state.attributeHours[attribute] || 0;
        
        const newHours = prompt(
            `Current ${attribute} hours: ${currentHours}\nEnter new total hours:`, 
            currentHours
        );
        
        if (newHours === null) return; // User cancelled
        
        const newHoursNum = parseFloat(newHours);
        if (isNaN(newHoursNum) || newHoursNum < 0) {
            alert('Please enter a valid number of hours');
            return;
        }
        
        store.updateState(`attributeHours.${attribute}`, newHoursNum);
    }
};

// Initialize everything when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Load saved state
    store.loadFromStorage();
    
    // Initialize systems
    attributeSystem.initialize();
    questSystem.initialize();
});