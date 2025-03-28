// app.js - Updated to work with database or localStorage
console.log("Loading DICED application...");

// Check if database is available
const usingDatabase = typeof dicedDB !== 'undefined' && typeof userService !== 'undefined';
console.log(`Using ${usingDatabase ? 'database' : 'localStorage'} mode`);

// Compatibility store object for localStorage support
if (!window.store) {
  window.store = {
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
}

// Update display function that works with both modes
function updateDisplay() {
  if (usingDatabase) {
    // Get attribute hours from database and update display
    userService.getAllAttributeHours().then(attributeHours => {
      updateAttributeDisplaysWithData(attributeHours);
    }).catch(error => {
      console.error("Error getting attribute hours:", error);
      // Fall back to localStorage data
      const state = store.getState();
      updateAttributeDisplaysWithData(state.attributeHours);
    });
  } else {
    // Use localStorage data
    const state = store.getState();
    updateAttributeDisplaysWithData(state.attributeHours);
  }
}

// Update display with attribute data
function updateAttributeDisplaysWithData(attributeHours) {
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
    
    // Calculate level info
    const levelInfo = calculateLevel(hours);
    
    // Update level display
    const levelElement = document.getElementById(`${attribute}-level`);
    if (levelElement) {
      levelElement.textContent = levelInfo.level;
    }
    
    // Update next level target
    const nextLevelElement = document.getElementById(`${attribute}-next-level`);
    if (nextLevelElement) {
      nextLevelElement.textContent = levelInfo.hoursForLevel;
    }
    
    // Find attribute card and update progress bar
    const cards = document.querySelectorAll('.attribute-card');
    const card = Array.from(cards).find(card => {
      const header = card.querySelector('h3');
      return header && header.textContent.toLowerCase() === attribute;
    });
    
    if (card) {
      // Update rank display
      const rankDisplay = card.querySelector('.stats p:first-child');
      if (rankDisplay) {
        rankDisplay.textContent = `Current Rank: ${levelInfo.rank}`;
      }
      
      // Update progress bar
      const progressFill = card.querySelector('.progress-fill');
      if (progressFill) {
        const progressPercent = (levelInfo.currentLevelHours / levelInfo.hoursForLevel * 100);
        progressFill.style.width = `${Math.min(progressPercent, 100)}%`;
        progressFill.style.backgroundColor = levelInfo.color;
      }
    }
  });
  
  // Update overall rank
  updateOverallRank(totalHours);
}

// Calculate level for an attribute based on hours
function calculateLevel(totalHours) {
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
}

// Update overall rank display
function updateOverallRank(totalHours) {
  // Calculate overall rank
  let currentRank = RANKS[0];
  let previousRankTotal = 0;
  
  for (const rank of RANKS) {
    if (totalHours < rank.totalHoursNeeded) {
      currentRank = rank;
      break;
    }
    previousRankTotal = rank.totalHoursNeeded;
  }
  
  // Calculate progress
  const progressPercent = Math.min(
    ((totalHours - previousRankTotal) / (currentRank.totalHoursNeeded - previousRankTotal)) * 100,
    100
  );
  
  // Update UI
  document.getElementById('overall-rank').textContent = currentRank.name;
  document.getElementById('overall-hours').textContent = totalHours.toFixed(1);
  document.getElementById('overall-next-rank').textContent = 
    (currentRank.totalHoursNeeded - previousRankTotal).toFixed(1);
  
  // Update progress bar
  const progressBar = document.querySelector('.overall-rank-card .progress-fill');
  if (progressBar) {
    progressBar.style.width = `${progressPercent}%`;
    progressBar.style.backgroundColor = currentRank.color;
  }
}

// Event handler functions
function handleAddHours() {
  const attribute = document.getElementById('attribute-select').value;
  const hours = parseFloat(document.getElementById('hours-input').value || 0);
  
  if (isNaN(hours) || hours <= 0) {
    alert('Please enter a valid number of hours');
    return;
  }
  
  if (usingDatabase) {
    // Add hours using database
    userService.addAttributeHours(attribute, hours)
      .then(() => {
        // Update display
        updateDisplay();
        // Reset input
        document.getElementById('hours-input').value = '1';
      })
      .catch(error => {
        console.error("Error adding hours:", error);
        alert("Failed to add hours. See console for details.");
      });
  } else {
    // Add hours using localStorage
    const currentState = store.getState();
    store.updateState(`attributeHours.${attribute}`, 
      (currentState.attributeHours[attribute] || 0) + hours
    );
    
    // Reset input
    document.getElementById('hours-input').value = '1';
  }
}

function handleAdjustHours() {
  const attribute = document.getElementById('attribute-select').value;
  
  if (usingDatabase) {
    // Get current hours from database
    userService.getAttributeHours(attribute)
      .then(currentHours => {
        promptAndAdjustHours(attribute, currentHours);
      })
      .catch(error => {
        console.error("Error getting hours:", error);
        alert("Failed to get current hours. See console for details.");
      });
  } else {
    // Get current hours from localStorage
    const currentState = store.getState();
    const currentHours = currentState.attributeHours[attribute] || 0;
    promptAndAdjustHours(attribute, currentHours);
  }
}

function promptAndAdjustHours(attribute, currentHours) {
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
    if (usingDatabase) {
      // Update hours in database
      userService.updateAttributeHours(attribute, newHoursNum)
        .then(() => {
          // Update display
          updateDisplay();
        })
        .catch(error => {
          console.error("Error updating hours:", error);
          alert("Failed to update hours. See console for details.");
        });
    } else {
      // Update hours in localStorage
      store.updateState(`attributeHours.${attribute}`, newHoursNum);
    }
  }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
  console.log("DOM loaded, initializing app...");
  
  // Load saved state from localStorage as fallback
  store.loadFromStorage();
  
  // Set up event listeners
  const addHoursButton = document.getElementById('add-hours-button');
  if (addHoursButton) {
    addHoursButton.addEventListener('click', handleAddHours);
  }

  const adjustHoursButton = document.getElementById('adjust-hours-button');
  if (adjustHoursButton) {
    adjustHoursButton.addEventListener('click', handleAdjustHours);
  }
  
  // Initialize quest system if available
  if (typeof questSystem !== 'undefined') {
    questSystem.initialize();
  }
  
  // Update display
  updateDisplay();
  
  console.log("App initialization complete");
});
