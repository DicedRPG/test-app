// Constants - Quest Types Colors
const QUEST_TYPE_COLORS = {
    'Training': '#64D949', // Green
    'Main': '#5F647C',     // Dark Gray
    'Side': '#FE3E53',     // Red
    'Explore': '#23D2E2'   // Blue
};

// Rank definitions
const RANKS = [
    { name: 'Home Cook', hoursNeeded: 55, totalHoursNeeded: 220, color: '#CD7F32' },  // Bronze
    { name: 'Culinary Student', hoursNeeded: 209, totalHoursNeeded: 836, color: '#43464B' },  // Iron
    { name: 'Kitchen Assistant', hoursNeeded: 530, totalHoursNeeded: 2120, color: '#C0C0C0' },  // Silver
    { name: 'Line Cook', hoursNeeded: 1177, totalHoursNeeded: 4708, color: '#FFD700' },  // Gold
    { name: 'Sous Chef', hoursNeeded: 2500, totalHoursNeeded: 10000, color: '#E5E4E2' },  // Platinum
    { name: 'Head Chef', hoursNeeded: Infinity, totalHoursNeeded: Infinity, color: '#FF1493' }  // Master
];

// Level definitions (for Home Cook)
const LEVELS = [
    { level: 1, hours: 5, startAt: 0 },
    { level: 2, hours: 5, startAt: 5 },
    { level: 3, hours: 5, startAt: 10 },
    { level: 4, hours: 5, startAt: 15 },
    { level: 5, hours: 5, startAt: 20 },
    { level: 6, hours: 6, startAt: 25 },
    { level: 7, hours: 7, startAt: 31 },
    { level: 8, hours: 8, startAt: 38 },
    { level: 9, hours: 9, startAt: 46 }
];

// Quest Data
// Enhanced quest data structure
const QUEST_DATA = [
  {
    id: 1,
    questName: "Kitchen Safety & Cleaning",
    rank: "Home Cook",
    type: "Training",
    primaryFocus: "Management",
    secondaryFocus: "Technique",
    primaryHours: 1,
    secondaryHours: 0.5,
    diceRequired: false,
    description: "Learn safe food handling cleaning and cross-contamination prevention",
    
    // Enhanced content
    stageId: 1,
    stageName: "Kitchen Fundamentals",
    learningObjectives: [
      "Understand fundamental food safety principles",
      "Master proper handwashing and personal hygiene techniques",
      "Learn to prevent cross-contamination between different food items",
      "Develop proper cleaning routines for different kitchen surfaces and tools",
      "Understand safe food storage temperatures and practices",
      "Create systems for maintaining a clean, efficient kitchen workspace"
    ],
    equipmentNeeded: [
      "Cleaning supplies (dish soap, all-purpose cleaner, sanitizing solution)",
      "Cleaning tools (scrub brushes, sponges, microfiber cloths)",
      "Cutting boards (preferably multiple)",
      "Storage containers"
    ],
    contentSections: [
      {
        title: "Kitchen Safety Fundamentals",
        subsections: [
          {
            subtitle: "Personal Hygiene",
            content: "Proper handwashing is the foundation of kitchen safety. Follow this process: 1. Wet your hands with clean, running water (warm or cold) 2. Apply soap and lather by rubbing hands together 3. Scrub all surfaces for at least 20 seconds..."
          },
          {
            subtitle: "Cross-Contamination Prevention",
            content: "Cross-contamination occurs when harmful bacteria from one food item are transferred to another. Prevent this through separation strategies..."
          }
          // Additional subsections
        ]
      },
      // Additional sections
    ],
    practicalExercises: [
      {
        title: "Kitchen Safety Audit",
        steps: [
          "Assess your current kitchen setup",
          "Identify potential cross-contamination risks",
          "Check for proper food storage",
          "Evaluate cleaning product storage",
          "Verify presence and location of safety equipment",
          "Create an improvement action plan"
        ]
      }
      // Additional exercises
    ],
    completionChecklist: [
      "Completed kitchen safety audit",
      "Implemented refrigerator organization system",
      "Created and posted cleaning schedule",
      "Established color-coding system for cutting boards and cleaning tools",
      "Set up proper cleaning supply storage"
      // Additional checklist items
    ],
    tipsForSuccess: [
      "Start with a complete clean of your kitchen before implementing new systems",
      "Color-coding is one of the most effective ways to prevent cross-contamination",
      "Clean as you go is easier than cleaning everything at the end"
    ]
  },
  // Additional quests would follow the same structure
// Add this at the end of data.js or after QUEST_DATA is defined
console.log("QUEST_DATA available:", QUEST_DATA ? `${QUEST_DATA.length} quests found` : "Not found");
];
