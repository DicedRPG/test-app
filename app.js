// app.js - Main application for DICED app with compatibility for both modes
console.log("Loading main application module...");

// Define a simple store implementation to mimic the original store
// This ensures backward compatibility
const store = {
  _state: {
    attributeHours: {
      technique: 0,
      management: 0,
      flavor: 0,
      ingredients: 0
    },
    completedQuests: [],
    visibleQuests: [],
    lastUpdate: new Date().toISOString()
  },
  
  getState() {
    return {...this._state};
  },
  
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
    this._saveToStorage();
    this._notifyListeners();
  },
  
  _listeners: [],
  
  subscribe(listener) {
    this._listeners.push(listener);
    return () => {
      this._listeners = this._listeners.filter(l => l !== listener);
    };
  },
  
  _notifyListeners() {
    this._listeners.forEach(listener => listener(this._state));
  },
  
  _saveToStorage() {
    try {
      this._state.lastUpdate = new Date().toISOString();
      localStorage.setItem('diced_rpg_state', JSON.stringify(this._state));
    } catch (error) {
      console.error('Failed to save state:', error);
    }
  },
  
  loadFromStorage() {
    try {
      const saved = localStorage.getItem('diced_rpg_state');
      if (saved) {
        const parsedState = JSON.parse(saved);
        // Merge with initial state to ensure all properties exist
        this._state = {
          ...this._state,
          ...parsedState,
          attributeHours: {
            ...this._state.attributeHours,
            ...(parsedState.attributeHours || {})
          }
        };
        this._notifyListeners();
      }
    } catch (error) {
      console.error('Failed to load state:', error);
    }
  }
};

// Make store globally available
window.store = store;

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', async () => {
  console.log("DOM loaded, initializing app...");
  
  try {
    // Check if we're using the database approach
    const usingDatabase = typeof window.dicedDB !== 'undefined' && 
                          typeof window.userService !== 'undefined';
    
    console.log(`Using ${usingDatabase ? 'database' : 'localStorage'} mode`);
    
    if (usingDatabase) {
      // Database approach
      await initializeDatabaseMode();
    } else {
      // Traditional localStorage approach
      initializeLocalStorageMode();
    }
    
    // Set up event listeners for either mode
    setupEventListeners(usingDatabase);
    
  } catch (error) {
    console.error("Application initialization failed:", error);
    showErrorMessage("Failed to initialize application", error.message);
  }
});

// Add to the initializeDatabaseMode function
async function initializeDatabaseMode() {
  try {
    // Initialize database
    await window.dicedDB.init();
    console.log("Database initialized");
    
    // Get attribute hours
    const attributeHours = await window.userService.getAllAttributeHours();
    console.log("Attribute hours loaded:", attributeHours);
    
    // Check if we need to initialize quest data
    const existingQuests = await window.questService.getAllQuests();
    if (!existingQuests || existingQuests.length === 0) {
      // Initialize quests from the original data source
      if (typeof QUEST_DATA !== 'undefined') {
        console.log("Initializing quest data...");
        await window.questService.initializeWithQuestData(QUEST_DATA);
      } else {
        console.warn("QUEST_DATA not available, skipping quest initialization");
      }
    }
    
    // Update displays with database data
    updateAttributeDisplays(attributeHours);
    
    // Initialize quest system display
    await initializeQuestDisplay();
    
    console.log("Database mode initialization complete");
    return true;
  } catch (error) {
    console.error("Database mode initialization failed:", error);
    // Fall back to localStorage mode
    console.log("Falling back to localStorage mode");
    initializeLocalStorageMode();
    return false;
  }
} // Add this at the end
  console.log("Running UI inspection...");
  inspectQuestUI();
  
  console.log("Database mode initialization complete");
  return true;
}

// Add a function to initialize quest display
async function initializeQuestDisplay() {
  try {
    const allQuests = await window.questService.getAllQuests();
    console.log(`Loaded ${allQuests.length} quests`);
    
    // Set up quest display UI
    setupQuestUI(allQuests);
  } catch (error) {
    console.error("Failed to initialize quest display:", error);
  }
}

// Updated setupQuestUI function
function setupQuestUI(quests) {
  console.log(`Setting up quest UI with ${quests.length} quests...`);
  
  // Find the container for quests
  const questList = document.querySelector('#quest-list');
  if (!questList) {
    console.error("Quest list element not found");
    // Try to find by other means
    const questContainer = document.querySelector('#quest-system .content');
    if (questContainer) {
      console.log("Found quest container, adding quest list element");
      const newQuestList = document.createElement('div');
      newQuestList.id = 'quest-list';
      questContainer.appendChild(newQuestList);
    } else {
      console.error("Cannot find quest container or list");
      return;
    }
  }
  
  // Set up event listeners for quest buttons - try multiple ways to find buttons
  // First by ID
  let viewAllButton = document.getElementById('view-all');
  // If not found, try by text content
  if (!viewAllButton) {
    document.querySelectorAll('button').forEach(button => {
      if (button.textContent.includes('View All')) {
        viewAllButton = button;
      }
    });
  }
  
  if (viewAllButton) {
    console.log("Found View All button");
    viewAllButton.addEventListener('click', () => {
      console.log("View All clicked");
      showAllQuests(quests);
    });
  } else {
    console.error("View All button not found");
  }
  
  // Same for Random Quest button
  let randomQuestButton = document.getElementById('random-quest');
  if (!randomQuestButton) {
    document.querySelectorAll('button').forEach(button => {
      if (button.textContent.includes('Random Quest')) {
        randomQuestButton = button;
      }
    });
  }
  
  if (randomQuestButton) {
    console.log("Found Random Quest button");
    randomQuestButton.addEventListener('click', () => {
      console.log("Random Quest clicked");
      showRandomQuest(quests);
    });
  } else {
    console.error("Random Quest button not found");
  }
  
  // Show available quests
  console.log("Displaying all quests...");
  showAllQuests(quests);
}

// Function to display all quests
function showAllQuests(quests) {
  console.log(`Showing all quests (${quests.length})...`);
  
  const questList = document.querySelector('#quest-list');
  if (!questList) {
    console.error("Quest list element not found when trying to show quests");
    return;
  }
  
  // Clear current content
  questList.innerHTML = '';
  
  if (quests.length === 0) {
    questList.innerHTML = '<p>No quests available.</p>';
    return;
  }
  
  // Create a grid for quests
  const questGrid = document.createElement('div');
  questGrid.className = 'quest-grid';
  
  // Add each quest
  quests.forEach(quest => {
    console.log(`Creating quest item for "${quest.questName}"`);
    const questItem = createQuestItem(quest);
    questGrid.appendChild(questItem);
  });
  
  questList.appendChild(questGrid);
  console.log("Quest list populated");
}

// Initialize with traditional localStorage approach
function initializeLocalStorageMode() {
  // Load from localStorage
  store.loadFromStorage();
  console.log("State loaded from localStorage");
  
  // Initialize quest system
  if (typeof questSystem !== 'undefined') {
    questSystem.initialize();
  }
  
  // Call original update function if available
  if (typeof updateDisplay === 'function') {
    updateDisplay();
  } else {
    // Basic update for attributes
    const state = store.getState();
    updateBasicDisplay(state.attributeHours);
  }
  
  console.log("localStorage mode initialization complete");
  return true;
}

// Set up event listeners for either mode
function setupEventListeners(usingDatabase) {
  console.log(`Setting up event listeners for ${usingDatabase ? 'database' : 'localStorage'} mode`);
  
  // Add hours button
  const addHoursButton = document.getElementById('add-hours-button');
  if (addHoursButton) {
    addHoursButton.addEventListener('click', 
      usingDatabase ? handleDatabaseAddHours : handleAddHours);
  }

  // Adjust hours button
  const adjustHoursButton = document.getElementById('adjust-hours-button');
  if (adjustHoursButton) {
    adjustHoursButton.addEventListener('click', 
      usingDatabase ? handleDatabaseAdjustHours : handleAdjustHours);
  }
}

// Handle adding hours with database
async function handleDatabaseAddHours() {
  const attribute = document.getElementById('attribute-select').value;
  const hours = parseFloat(document.getElementById('hours-input').value);
  
  if (isNaN(hours) || hours <= 0) {
    alert('Please enter a valid number of hours');
    return;
  }
  
  try {
    console.log(`Adding ${hours} hours to ${attribute} via database`);
    
    // Add hours using userService
    await window.userService.addAttributeHours(attribute, hours);
    
    // Get updated attribute hours
    const attributeHours = await window.userService.getAllAttributeHours();
    
    // Update displays
    updateAttributeDisplays(attributeHours);
    
    // Reset input
    document.getElementById('hours-input').value = '1';
    
  } catch (error) {
    console.error("Failed to add hours:", error);
    alert(`Failed to add hours: ${error.message}`);
  }
}

// Handle adding hours with localStorage (original function)
function handleAddHours() {
  const attribute = document.getElementById('attribute-select').value;
  const hours = parseFloat(document.getElementById('hours-input').value);
  
  if (isNaN(hours) || hours <= 0) {
    alert('Please enter a valid number of hours');
    return;
  }
  
  const currentState = store.getState();
  store.updateState(`attributeHours.${attribute}`, 
    (currentState.attributeHours[attribute] || 0) + hours
  );
  
  // Reset input
  document.getElementById('hours-input').value = '1';
  
  // Call original update function if available
  if (typeof updateDisplay === 'function') {
    updateDisplay();
  } else {
    // Basic update for attributes
    const updatedState = store.getState();
    updateBasicDisplay(updatedState.attributeHours);
  }
}

// Handle adjusting hours with database
async function handleDatabaseAdjustHours() {
  const attribute = document.getElementById('attribute-select').value;
  
  try {
    // Get current hours
    const currentHours = await window.userService.getAttributeHours(attribute);
    
    // Prompt for new hours
    const newHours = prompt(
      `Current hours for ${attribute}: ${currentHours}\nEnter new total hours:`,
      currentHours
    );
    
    if (newHours === null) return; // User cancelled
    
    // Validate input
    const newHoursNum = parseFloat(newHours);
    if (isNaN(newHoursNum) || newHoursNum < 0) {
      alert('Please enter a valid number of hours');
      return;
    }
    
    // Confirm action
    if (confirm(`Are you sure you want to set ${attribute} to ${newHoursNum} hours?`)) {
      console.log(`Setting ${attribute} to ${newHoursNum} hours via database`);
      
      // Update hours using userService
      await window.userService.updateAttributeHours(attribute, newHoursNum);
      
      // Get updated attribute hours
      const attributeHours = await window.userService.getAllAttributeHours();
      
      // Update displays
      updateAttributeDisplays(attributeHours);
    }
  } catch (error) {
    console.error("Failed to adjust hours:", error);
    alert(`Failed to adjust hours: ${error.message}`);
  }
}

// Handle adjusting hours with localStorage (original function)
function handleAdjustHours() {
  const attribute = document.getElementById('attribute-select').value;
  const currentState = store.getState();
  const currentHours = currentState.attributeHours[attribute] || 0;
  
  const newHours = prompt(
    `Current hours for ${attribute}: ${currentHours}\nEnter new total hours:`,
    currentHours
  );
  
  if (newHours === null) return; // User cancelled
  
  const newHoursNum = parseFloat(newHours);
  if (isNaN(newHoursNum) || newHoursNum < 0) {
    alert('Please enter a valid number of hours');
    return;
  }
  
  if (confirm(`Are you sure you want to set ${attribute} to ${newHoursNum} hours?`)) {
    store.updateState(`attributeHours.${attribute}`, newHoursNum);
    
    // Call original update function if available
    if (typeof updateDisplay === 'function') {
      updateDisplay();
    } else {
      // Basic update for attributes
      const updatedState = store.getState();
      updateBasicDisplay(updatedState.attributeHours);
    }
  }
}

// Update attribute displays with database data
function updateAttributeDisplays(attributeHours) {
  updateBasicDisplay(attributeHours);
  
  // Call original updateDisplay if available, for other elements
  if (typeof updateDisplay === 'function') {
    try {
      updateDisplay();
    } catch (error) {
      console.warn("Error in original updateDisplay function:", error);
    }
  }
}

// Basic display update for attributes (works in both modes)
function updateBasicDisplay(attributeHours) {
  // Update each attribute display
  const attributes = ['technique', 'management', 'flavor', 'ingredients'];
  let totalHours = 0;
  
  attributes.forEach(attribute => {
    const hours = attributeHours[attribute] || 0;
    totalHours += hours;
    
    // Update hours display
    const hoursElement = document.getElementById(`${attribute}-hours`);
    if (hoursElement) {
      hoursElement.textContent = hours.toFixed(1);
    }
  });
  
  // Update total hours if element exists
  const overallHoursElement = document.getElementById('overall-hours');
  if (overallHoursElement) {
    overallHoursElement.textContent = totalHours.toFixed(1);
  }
}

// Show error message
function showErrorMessage(title, message) {
  console.error(`${title}: ${message}`);
  
  // Create error element
  const errorElement = document.createElement('div');
  errorElement.style.backgroundColor = '#ffebee';
  errorElement.style.color = '#b71c1c';
  errorElement.style.padding = '20px';
  errorElement.style.margin = '20px';
  errorElement.style.borderRadius = '8px';
  errorElement.style.border = '1px solid #f44336';
  
  errorElement.innerHTML = `
    <h3 style="margin-top: 0">${title}</h3>
    <p>${message}</p>
    <div>
      <button onclick="location.reload()">Reload App</button>
      <button onclick="this.parentNode.parentNode.style.display='none'">Dismiss</button>
    </div>
  `;
  
  // Add to page
  const container = document.querySelector('.dashboard');
  if (container) {
    container.appendChild(errorElement);
  } else {
    document.body.appendChild(errorElement);
  }
}

// Add near the bottom
function inspectQuestUI() {
  console.log("Inspecting Quest UI Elements:");
  
  // Check quest container
  const questContainer = document.querySelector('#quest-system');
  console.log("Quest system container:", questContainer ? "Found" : "Not found");
  
  // Check quest list
  const questList = document.querySelector('#quest-list');
  console.log("Quest list element:", questList ? "Found" : "Not found");
  
  // Check buttons
  const viewAllButton = document.getElementById('view-all');
  console.log("View All button:", viewAllButton ? "Found" : "Not found");
  
  const randomQuestButton = document.getElementById('random-quest');
  console.log("Random Quest button:", randomQuestButton ? "Found" : "Not found");
  
  // Check if QUEST_TYPE_COLORS is defined
  console.log("QUEST_TYPE_COLORS:", typeof QUEST_TYPE_COLORS !== 'undefined' ? "Defined" : "Not defined");
}

// Add this function to app.js and call it during initialization
function examinePageStructure() {
  console.log("Examining page structure...");
  
  // Log all button elements on the page
  const buttons = document.querySelectorAll('button');
  console.log(`Found ${buttons.length} buttons:`);
  buttons.forEach((button, i) => {
    console.log(`Button ${i}:`, button.id || "(no id)", button.textContent.trim());
  });
  
  // Log structure of quest system
  const questSystem = document.querySelector('#quest-system');
  if (questSystem) {
    console.log("Quest system HTML:", questSystem.innerHTML);
  }
}

console.log("Main application module loaded");
