// app.js - Main application entry point for DICED Cooking RPG App

// Constants for application settings
const APP_VERSION = '1.0.0';

// Wait for the DOM to be fully loaded before initializing
document.addEventListener('DOMContentLoaded', async () => {
  try {
    console.log('DICED Cooking RPG App initializing...');
    
    // Initialize the database first
    await dicedDB.init();
    console.log('Database initialized successfully');
    
    // Initialize quest system
    await questSystem.initialize();
    console.log('Quest system initialized');
    
    // Load user's attribute hours
    const attributeHours = await userService.getAllAttributeHours();
    console.log('User attribute hours loaded:', attributeHours);
    
    // Make key objects available globally for debugging (optional)
    window.dicedDB = dicedDB;
    window.questService = questService;
    window.userService = userService;
    window.questSystem = questSystem;
    
    // Update the attribute displays with current data
    updateAttributeDisplays(attributeHours);
    
    // Set up event listeners for the attribute UI controls
    setupAttributeEventListeners();
    
    // Remove loading state if present
    const loadingElement = document.getElementById('loading-overlay');
    if (loadingElement) {
      loadingElement.classList.add('hidden');
    }
  } catch (error) {
    // Handle initialization errors gracefully
    console.error('Failed to initialize application:', error);
    showErrorMessage('Application initialization failed', 
      'Please reload the page or check your browser console for details.');
  }
});

/**
 * Update all attribute displays with current hours and progress
 * @param {Object} attributeHours - Object containing hours for each attribute
 */
function updateAttributeDisplays(attributeHours) {
  // Define attributes to update
  const attributes = ['technique', 'management', 'flavor', 'ingredients'];
  let totalHours = 0;
  
  // Update each individual attribute
  attributes.forEach(attribute => {
    const hours = attributeHours[attribute] || 0;
    totalHours += hours;
    
    // Update hours display
    const hoursElement = document.getElementById(`${attribute}-hours`);
    if (hoursElement) {
      hoursElement.textContent = hours.toFixed(1);
    }
    
    // Calculate level and next level target
    // This would use your existing level calculation logic from the previous app.js
    const levelInfo = calculateLevel(hours);
    
    // Update level display
    const levelElement = document.getElementById(`${attribute}-level`);
    if (levelElement) {
      levelElement.textContent = levelInfo.level;
    }
    
    // Update next level hours
    const nextLevelElement = document.getElementById(`${attribute}-next-level`);
    if (nextLevelElement) {
      nextLevelElement.textContent = levelInfo.hoursForLevel;
    }
    
    // Update progress bar
    const progressBar = document.querySelector(`.attribute-card:nth-child(${attributes.indexOf(attribute) + 1}) .progress-fill`);
    if (progressBar) {
      const progressPercent = (levelInfo.currentLevelHours / levelInfo.hoursForLevel * 100);
      progressBar.style.width = `${Math.min(progressPercent, 100)}%`;
      progressBar.style.backgroundColor = levelInfo.color;
    }
  });
  
  // Update overall rank and progress
  updateOverallRank(totalHours);
}

/**
 * Calculate level information for a specific attribute based on hours
 * @param {number} totalHours - Total hours for the attribute
 * @return {Object} Level information
 */
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

/**
 * Update the overall rank display
 * @param {number} totalHours - Total hours across all attributes
 */
function updateOverallRank(totalHours) {
  // Calculate overall rank based on total hours
  // This uses the same logic from your previous app.js
  let currentRank = RANKS[0];
  let previousRankTotal = 0;
  
  for (const rank of RANKS) {
    if (totalHours < rank.totalHoursNeeded) {
      currentRank = rank;
      break;
    }
    previousRankTotal = rank.totalHoursNeeded;
  }
  
  // Calculate progress percentage
  const progressPercent = Math.min(
    ((totalHours - previousRankTotal) / (currentRank.totalHoursNeeded - previousRankTotal)) * 100,
    100
  );
  
  // Update rank display
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

/**
 * Set up event listeners for attribute management controls
 */
function setupAttributeEventListeners() {
  // Add hours button
  const addHoursButton = document.getElementById('add-hours-button');
  if (addHoursButton) {
    addHoursButton.addEventListener('click', handleAddHours);
  }

  // Adjust hours button
  const adjustHoursButton = document.getElementById('adjust-hours-button');
  if (adjustHoursButton) {
    adjustHoursButton.addEventListener('click', handleAdjustHours);
  }
}

/**
 * Handle adding hours to an attribute
 */
async function handleAddHours() {
  // Get selected attribute and hours value
  const attribute = document.getElementById('attribute-select').value;
  const hours = parseFloat(document.getElementById('hours-input').value);
  
  // Validate input
  if (isNaN(hours) || hours <= 0) {
    showNotification('Please enter a valid number of hours', 'error');
    return;
  }
  
  try {
    // Show loading state
    showNotification(`Adding ${hours} hours to ${attribute}...`, 'info');
    
    // Add hours to the attribute using userService
    await userService.addAttributeHours(attribute, hours);
    
    // Get updated hours and refresh display
    const attributeHours = await userService.getAllAttributeHours();
    updateAttributeDisplays(attributeHours);
    
    // Reset input
    document.getElementById('hours-input').value = '1';
    
    // Show success notification
    showNotification(`Added ${hours} hours to ${attribute}!`, 'success');
    
  } catch (error) {
    console.error('Failed to add hours:', error);
    showNotification('Failed to add hours. Please try again.', 'error');
  }
}

/**
 * Handle adjusting total hours for an attribute
 */
async function handleAdjustHours() {
  // Get selected attribute
  const attribute = document.getElementById('attribute-select').value;
  
  try {
    // Get current hours
    const currentHours = await userService.getAttributeHours(attribute);
    
    // Prompt user for new total
    const newHours = prompt(
      `Current hours for ${attribute}: ${currentHours}\nEnter new total hours:`,
      currentHours
    );
    
    if (newHours === null) return; // User cancelled
    
    // Validate input
    const newHoursNum = parseFloat(newHours);
    if (isNaN(newHoursNum) || newHoursNum < 0) {
      showNotification('Please enter a valid number of hours', 'error');
      return;
    }
    
    // Confirm action
    if (confirm(`Are you sure you want to set ${attribute} to ${newHoursNum} hours?`)) {
      // Show loading state
      showNotification(`Updating ${attribute} to ${newHoursNum} hours...`, 'info');
      
      // Update hours using userService
      await userService.updateAttributeHours(attribute, newHoursNum);
      
      // Get updated hours and refresh display
      const attributeHours = await userService.getAllAttributeHours();
      updateAttributeDisplays(attributeHours);
      
      // Show success notification
      showNotification(`Updated ${attribute} to ${newHoursNum} hours!`, 'success');
    }
  } catch (error) {
    console.error('Failed to adjust hours:', error);
    showNotification('Failed to adjust hours. Please try again.', 'error');
  }
}

/**
 * Display a notification to the user
 * @param {string} message - The message to display
 * @param {string} type - The type of notification (info, success, error)
 */
function showNotification(message, type = 'info') {
  // Create notification element if it doesn't exist
  let notification = document.querySelector('.notification');
  if (!notification) {
    notification = document.createElement('div');
    notification.className = 'notification';
    document.body.appendChild(notification);
  }
  
  // Set message and type
  notification.textContent = message;
  notification.className = `notification ${type}`;
  
  // Show notification
  notification.style.display = 'block';
  
  // Hide after 3 seconds
  setTimeout(() => {
    notification.style.display = 'none';
  }, 3000);
}

/**
 * Display an error message to the user
 * @param {string} title - The error title
 * @param {string} message - The detailed error message
 */
function showErrorMessage(title, message) {
  // Create error container
  const errorContainer = document.createElement('div');
  errorContainer.className = 'error-container';
  errorContainer.innerHTML = `
    <h3>${title}</h3>
    <p>${message}</p>
    <button onclick="location.reload()">Reload Page</button>
  `;
  
  // Replace body content or append
  const mainContent = document.querySelector('.dashboard');
  if (mainContent) {
    mainContent.innerHTML = '';
    mainContent.appendChild(errorContainer);
  } else {
    document.body.innerHTML = '';
    document.body.appendChild(errorContainer);
  }
}

/**
 * Register service worker for offline support
 */
function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
      })
      .catch(error => {
        console.log('ServiceWorker registration failed: ', error);
      });
    });
  }
}

// Initialize service worker if needed
registerServiceWorker();

/**
 * Check for app updates
 */
function checkForUpdates() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistration().then(reg => {
      if (reg) reg.update().catch(err => console.error('Error checking for updates:', err));
    });
  }
}

// Add update detection
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    // New service worker activated
    window.location.reload(); // Reload the page to get new content
  });
  
  // Check for updates when the page loads and periodically
  checkForUpdates();
  setInterval(checkForUpdates, 60 * 60 * 1000); // Check hourly
}

// Make checkForUpdates available globally
window.checkForUpdates = checkForUpdates;