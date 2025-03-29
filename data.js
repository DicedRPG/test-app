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
    {
    id: 2,
    questName: "Basic Knife Skills I",
    rank: "Home Cook", 
    type: "Training",
    primaryFocus: "Technique",
    secondaryFocus: "Management",
    primaryHours: 1,
    secondaryHours: 0.5,
    diceRequired: false,
    description: "Master basic vegetable cuts: rough chop, dice, and slice",
    stageId: 2,
    stageName: "Knife Skills & Heat Control",
    learningObjectives: [
      "Understand the anatomy of a chef's knife and proper handling",
      "Master fundamental knife grips and safe cutting techniques",
      "Learn three essential vegetable cutting methods: rough chop, dice, and slice",
      "Practice proper knife safety and care",
      "Develop efficient cutting workspace organization"
    ],
    equipmentNeeded: [
      "Chef's knife",
      "Cutting board",
      "Vegetables for practice (onions, carrots, celery)",
      "Kitchen towel or paper towels",
      "Container for scraps",
      "Honing rod (optional)"
    ],
    contentSections: [
      {
        title: "Knife Fundamentals",
        subsections: [
          {
            subtitle: "Understanding Your Knife",
            content: "Learn the parts of a chef's knife: tip, edge, heel, spine, bolster, handle, and tang. Understand different knife types and their specific purposes in the kitchen."
          },
          {
            subtitle: "Proper Knife Grip",
            content: "Master two primary grips: 1) Blade grip (pinch grip): Pinch blade between thumb and forefinger at bolster, wrap remaining fingers around handle. 2) Handle grip: For more delicate tasks, grip the handle more traditionally."
          }
        ]
      }
    ],
    practicalExercises: [
      {
        title: "Cutting Technique Practice",
        steps: [
          "Practice slicing various vegetables with uniform thickness",
          "Create perfect dice with consistent cube sizes",
          "Perform rough chopping for herbs and leafy vegetables",
          "Focus on proper hand positioning and safety",
          "Compare and assess your cutting consistency"
        ]
      }
    ],
    completionChecklist: [
      "Demonstrated safe knife handling",
      "Created consistent slices of various thicknesses",
      "Produced uniform diced vegetables",
      "Performed rough chopping with efficiency",
      "Maintained a clean and organized workspace"
    ],
    tipsForSuccess: [
      "Start slowly and focus on accuracy rather than speed",
      "Keep your knife sharp—dull knives are more dangerous",
      "Let the weight of the knife do much of the work",
      "Practice regularly with different vegetables",
      "Always maintain the 'claw' hand position for safety"
    ]
  },
  // Additional quests would follow the same structure
];
