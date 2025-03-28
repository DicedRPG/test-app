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

// Initialize with database approach
async function initializeDatabaseMode() {
  try {
    // Initialize database
    await window.dicedDB.init();
    console.log("Database initialized");
    
    // Get attribute hours
    const attributeHours = await window.userService.getAllAttributeHours();
    console.log("Attribute hours loaded:", attributeHours);
    
    // Update displays with database data
    updateAttributeDisplays(attributeHours);
    
    // Initialize quest system if available
    if (typeof window.questSystem !== 'undefined') {
      await window.questSystem.initialize();
    } else if (typeof questSystem !== 'undefined') {
      questSystem.initialize();
    } else {
      console.log("Quest system not available in database mode");
    }
    
    console.log("Database mode initialization complete");
    return true;
  } catch (error) {
    console.error("Database mode initialization failed:", error);
    // Fall back to localStorage mode
    console.log("Falling back to localStorage mode");
    initializeLocalStorageMode();
    return false;
  }
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

console.log("Main application module loaded");
