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
    description: "Learn safe food handling, cleaning, and cross-contamination prevention",
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
      "Storage containers",
      "Sanitizing solution or bleach",
      "Kitchen towels"
    ],
    contentSections: [
      {
        title: "Food Safety Fundamentals",
        subsections: [
          {
            subtitle: "Personal Hygiene",
            content: "Learn comprehensive handwashing technique: Wet hands with clean water, apply soap, lather thoroughly for 20 seconds, scrub all surfaces, rinse completely, and dry with a clean towel. Understand critical handwashing moments in food preparation."
          },
          {
            subtitle: "Cross-Contamination Prevention",
            content: "Implement strategies to prevent bacterial transfer between foods. Use color-coded cutting boards, separate raw and ready-to-eat foods, wash hands between handling different food types, and maintain proper food storage practices."
          }
        ]
      },
      {
        title: "Kitchen Cleaning Systems",
        subsections: [
          {
            subtitle: "Surface Cleaning",
            content: "Master cleaning techniques for different kitchen surfaces. Learn to create effective cleaning solutions, understand proper sanitization methods, and develop a systematic approach to kitchen cleanliness."
          }
        ]
      }
    ],
    practicalExercises: [
      {
        title: "Kitchen Safety Audit",
        steps: [
          "Assess current kitchen setup for safety and cleanliness",
          "Identify potential cross-contamination risks",
          "Create a comprehensive cleaning and organization plan",
          "Implement color-coding system for kitchen tools",
          "Develop a personal food safety checklist"
        ]
      }
    ],
    completionChecklist: [
      "Completed thorough kitchen safety assessment",
      "Implemented proper food storage practices",
      "Created cleaning and sanitization routine",
      "Established cross-contamination prevention system",
      "Developed personal hygiene protocol for food preparation"
    ],
    tipsForSuccess: [
      "Clean as you go to maintain a safe cooking environment",
      "Regularly sanitize cutting boards and kitchen surfaces",
      "Create a systematic approach to kitchen organization",
      "Stay vigilant about personal hygiene during food preparation",
      "Regularly update and review your kitchen safety practices"
    ]
  },
  {
    id: 3,
    questName: "Mise en Place",
    rank: "Home Cook",
    type: "Training",
    primaryFocus: "Management",
    secondaryFocus: "Technique",
    primaryHours: 1,
    secondaryHours: 0.5,
    diceRequired: false,
    description: "Master the art of preparation and organization in cooking",
    stageId: 1,
    stageName: "Kitchen Fundamentals",
    learningObjectives: [
      "Understand the concept and importance of mise en place",
      "Learn to properly prepare and organize ingredients before cooking",
      "Develop efficient workspace organization techniques",
      "Practice time management in recipe preparation",
      "Create systems for reducing cooking stress and improving results"
    ],
    equipmentNeeded: [
      "Cutting board",
      "Chef's knife",
      "Various prep bowls or containers",
      "Measuring cups and spoons",
      "Kitchen towels",
      "Timer or clock"
    ],
    contentSections: [
      {
        title: "Mise en Place Fundamentals",
        subsections: [
          {
            subtitle: "Understanding Preparation",
            content: "Mise en place, meaning 'everything in its place' in French, is a crucial culinary principle. It involves completely preparing and organizing ingredients before cooking begins, reducing stress and improving efficiency in the kitchen."
          },
          {
            subtitle: "Workspace Organization",
            content: "Create clear zones in your kitchen: preparation zone, cooking zone, and finishing zone. Learn to arrange tools and ingredients for maximum efficiency and minimal movement."
          }
        ]
      }
    ],
    practicalExercises: [
      {
        title: "Recipe Preparation Challenge",
        steps: [
          "Select a recipe with multiple components",
          "Read the entire recipe carefully",
          "Measure and prepare all ingredients before starting",
          "Create a timeline for recipe preparation",
          "Practice 'clean as you go' method",
          "Reflect on efficiency and organization"
        ]
      }
    ],
    completionChecklist: [
      "Prepared all ingredients before cooking",
      "Organized workspace efficiently",
      "Created a logical preparation timeline",
      "Maintained cleanliness during preparation",
      "Reduced stress and improved cooking flow"
    ],
    tipsForSuccess: [
      "Always read the entire recipe before beginning",
      "Group ingredients by preparation stage",
      "Use small bowls to organize measured ingredients",
      "Clean work surfaces between preparation steps",
      "Practice mise en place even for simple meals"
    ]
  },
  {
    id: 4,
    questName: "Recipe Reading",
    rank: "Home Cook",
    type: "Training",
    primaryFocus: "Management",
    secondaryFocus: "Technique",
    primaryHours: 1,
    secondaryHours: 0.5,
    diceRequired: false,
    description: "Develop skills to effectively read, understand, and follow recipes",
    stageId: 1,
    stageName: "Kitchen Fundamentals",
    learningObjectives: [
      "Understand standard recipe formats and terminology",
      "Develop skills to interpret cooking instructions",
      "Learn to identify implicit techniques and requirements",
      "Practice recipe adaptation and scaling",
      "Create personal systems for recipe annotation and organization"
    ],
    equipmentNeeded: [
      "Cookbook or recipe collection",
      "Notebook or digital note-taking device",
      "Highlighters or colored pens",
      "Measuring tools",
      "Cooking reference guide (optional)"
    ],
    contentSections: [
      {
        title: "Recipe Comprehension",
        subsections: [
          {
            subtitle: "Recipe Components",
            content: "Identify key recipe elements: title, ingredient list, equipment requirements, step-by-step instructions, and additional notes. Learn to quickly extract critical information from various recipe formats."
          },
          {
            subtitle: "Terminology Mastery",
            content: "Study common cooking verbs, measurement abbreviations, and technical terms. Create a personal glossary of culinary terminology to improve recipe understanding."
          }
        ]
      }
    ],
    practicalExercises: [
      {
        title: "Recipe Analysis Challenge",
        steps: [
          "Select recipes of varying complexity",
          "Analyze recipe components and terminology",
          "Practice scaling recipes for different serving sizes",
          "Develop a personal recipe annotation system",
          "Attempt recipe modifications based on available ingredients"
        ]
      }
    ],
    completionChecklist: [
      "Analyzed multiple recipes thoroughly",
      "Created personal recipe terminology reference",
      "Successfully scaled a recipe",
      "Developed recipe annotation method",
      "Identified potential ingredient substitutions"
    ],
    tipsForSuccess: [
      "Always read the entire recipe before starting",
      "Pay attention to recipe headnotes and additional instructions",
      "Create a personal system for marking and organizing recipes",
      "Don't be afraid to adapt recipes to your taste or available ingredients",
      "Practice reading recipes as if you were following them step-by-step"
    ]
  },
  {
    id: 6,
    questName: "Measuring & Scaling",
    rank: "Home Cook",
    type: "Training",
    primaryFocus: "Management",
    secondaryFocus: "Technique",
    primaryHours: 1,
    secondaryHours: 0.5,
    diceRequired: false,
    description: "Master precise measurement techniques and recipe scaling",
    stageId: 1,
    stageName: "Kitchen Fundamentals",
    learningObjectives: [
      "Learn accurate measuring techniques for different ingredient types",
      "Understand measurement conversions and equivalents",
      "Develop skills for scaling recipes up or down",
      "Practice weight vs. volume measurements",
      "Learn to adjust recipes for different pan sizes"
    ],
    equipmentNeeded: [
      "Dry measuring cups",
      "Liquid measuring cups",
      "Measuring spoons",
      "Digital scale (if available)",
      "Various ingredients for practice",
      "Calculator",
      "Notebook"
    ],
    contentSections: [
      {
        title: "Measurement Fundamentals",
        subsections: [
          {
            subtitle: "Measuring Tool Techniques",
            content: "Master different measuring methods: spoon and level for flour, pack firmly for brown sugar, read liquid measurements at eye level. Understand the importance of precise measurement in cooking and baking."
          },
          {
            subtitle: "Conversion Mastery",
            content: "Learn standard measurement equivalents: teaspoons to tablespoons, cups to pints, weight conversions. Develop skills to quickly and accurately convert between different measurement systems."
          }
        ]
      }
    ],
    practicalExercises: [
      {
        title: "Measurement Precision Challenge",
        steps: [
          "Practice measuring various ingredient types",
          "Compare weight and volume measurements",
          "Scale a recipe up and down",
          "Adjust a recipe for different pan sizes",
          "Create a personal measurement conversion reference"
        ]
      }
    ],
    completionChecklist: [
      "Demonstrated accurate measuring techniques",
      "Successfully converted between different measurement units",
      "Scaled a recipe for different serving sizes",
      "Created a personal measurement reference guide",
      "Understood impact of precise measurements on cooking results"
    ],
    tipsForSuccess: [
      "Consistency matters more than the exact method",
      "Write down scaled measurements before starting",
      "Baking requires more precision than cooking",
      "A digital scale dramatically improves measurement accuracy",
      "Create a personal reference sheet for common conversions"
    ]
  },
  {
    id: 103,
    questName: "Basic Cookbook Research",
    rank: "Home Cook",
    type: "Explore",
    primaryFocus: "Management",
    secondaryFocus: "Technique",
    primaryHours: 1,
    secondaryHours: 0.5,
    diceRequired: false,
    description: "Develop research skills through systematic cookbook exploration",
    stageId: 1,
    stageName: "Kitchen Fundamentals",
    learningObjectives: [
      "Develop critical recipe analysis skills",
      "Learn to identify key techniques across multiple recipes",
      "Practice comparing different approaches to similar dishes",
      "Build a personalized collection of recipes to try",
      "Understand how cookbooks communicate cooking principles"
    ],
    equipmentNeeded: [
      "At least one cookbook (physical or digital)",
      "Notebook or digital note-taking system",
      "Bookmarks or sticky notes",
      "Writing utensils",
      "Access to additional cookbooks (optional)"
    ],
    contentSections: [
      {
        title: "Cookbook Exploration",
        subsections: [
          {
            subtitle: "Cookbook Selection",
            content: "Choose cookbooks that match your current interests and skill level. Look for books with clear explanations, technique sections, and comprehensive information beyond just recipes."
          },
          {
            subtitle: "Analytical Reading",
            content: "Go beyond simply reading recipes. Study introductory chapters, technique explanations, equipment recommendations, and author's notes to gain deeper culinary insights."
          }
        ]
      }
    ],
    practicalExercises: [
      {
        title: "Cookbook Analysis Challenge",
        steps: [
          "Select 2-3 cookbooks from different sources",
          "Read introductory and technique sections thoroughly",
          "Compare similar recipes across different cookbooks",
          "Document key techniques and principles",
          "Choose 3 recipes to potentially cook"
        ]
      }
    ],
    completionChecklist: [
      "Analyzed multiple cookbooks in-depth",
      "Documented key cooking techniques",
      "Compared approaches in different cookbooks",
      "Selected recipes for future cooking",
      "Created a personal cooking technique reference"
    ],
    tipsForSuccess: [
      "Don't just look at recipes—read introductory sections carefully",
      "Pay attention to sidebars and chef's notes",
      "Look for cookbooks with explanations of why techniques work",
      "Consider borrowing books from the library before purchasing",
      "Focus on understanding techniques more than specific recipes"
    ]
  },
  {
    id: 108,
    questName: "Kitchen Equipment Research",
    rank: "Home Cook",
    type: "Explore",
    primaryFocus: "Management",
    secondaryFocus: "Technique",
    primaryHours: 1,
    secondaryHours: 0.5,
    diceRequired: false,
    description: "Research and understand essential kitchen tools and equipment",
    stageId: 1,
    stageName: "Kitchen Fundamentals",
    milestone: true,
      unlocksStage: 2,
      unlockMessage: "Stage 2: Knife Skills & Heat Control is now available!",
    learningObjectives: [
      "Understand the function and purpose of essential kitchen tools",
      "Learn to evaluate quality and value in kitchen equipment",
      "Develop knowledge about proper tool use and care",
      "Create a prioritized list for building kitchen equipment collection",
      "Understand how equipment choices affect cooking techniques"
    ],
    equipmentNeeded: [
      "Access to internet or reference books",
      "Notebook or digital note-taking system",
      "Current kitchen inventory list",
      "Budget planning worksheet (optional)",
      "Access to kitchen supply stores (physical or online)"
    ],
    contentSections: [
      {
        title: "Equipment Evaluation",
        subsections: [
          {
            subtitle: "Essential Equipment Categories",
            content: "Research key kitchen equipment categories: knives, cookware, bakeware, small tools, measuring tools, and small appliances. Understand the differences between essential items and nice-to-have gadgets."
          },
          {
            subtitle: "Quality Assessment",
            content: "Learn to evaluate kitchen tools based on materials, construction, durability, and value. Understand the difference between home cook and professional-grade equipment."
          }
        ]
      }
    ],
    practicalExercises: [
      {
        title: "Kitchen Equipment Inventory and Research",
        steps: [
          "Create a comprehensive inventory of current kitchen tools",
          "Research at least two options in different price ranges for key tools",
          "Compare features, materials, and customer reviews",
          "Develop a prioritized equipment acquisition plan",
          "Create a maintenance strategy for existing and future tools"
        ]
      }
    ],
    completionChecklist: [
      "Completed kitchen tool inventory",
      "Researched equipment quality and value",
      "Created prioritized equipment acquisition list",
      "Developed tool maintenance strategy",
      "Identified gaps in current kitchen equipment"
    ],
    tipsForSuccess: [
      "Focus on versatile, multi-purpose tools when starting out",
      "Quality matters more than quantity",
      "Avoid professional-grade equipment when first starting",
      "Start with basics and add specialized equipment as skills grow",
      "Always research before making significant equipment investments"
    ]
  },

    // Stage 2 Data
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
    description: "Master foundational cutting techniques for basic vegetable preparation",
    stageId: 2,
    stageName: "Knife Skills & Heat Control",
    learningObjectives: [
      "Understand the anatomy of a chef's knife and proper handling",
      "Master fundamental knife grips and safe cutting techniques",
      "Learn essential vegetable cutting methods: rough chop, dice, and slice",
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
            subtitle: "Knife Anatomy",
            content: "Learn the key parts of a chef's knife: tip, edge, heel, spine, bolster, handle, and tang. Understand the differences between Western-style and Japanese-style knives and their specific purposes."
          },
          {
            subtitle: "Proper Grip Techniques",
            content: "Master two primary grips: 1) Blade grip (pinch grip): Pinch blade between thumb and forefinger at bolster, wrap remaining fingers around handle. 2) Handle grip: For more delicate tasks, traditionally grip the handle."
          }
        ]
      }
    ],
    practicalExercises: [
      {
        title: "Cutting Technique Mastery",
        steps: [
          "Practice slicing vegetables with uniform thickness",
          "Create precise dice with consistent cube sizes",
          "Perform rough chopping for herbs and leafy vegetables",
          "Focus on proper hand positioning and safety",
          "Assess and improve cutting consistency"
        ]
      }
    ],
    completionChecklist: [
      "Demonstrated safe knife handling",
      "Created consistent vegetable slices",
      "Produced uniform diced vegetables",
      "Performed efficient rough chopping",
      "Maintained a clean, organized workspace"
    ],
    tipsForSuccess: [
      "Start slowly and prioritize accuracy over speed",
      "Keep your knife extremely sharp",
      "Let the knife's weight do most of the work",
      "Practice regularly with different vegetables",
      "Always maintain the 'claw' hand position for safety"
    ]
  },
  {
    id: 5,
    questName: "Basic Knife Skills II",
    rank: "Home Cook",
    type: "Training",
    primaryFocus: "Technique",
    secondaryFocus: "Management",
    primaryHours: 1,
    secondaryHours: 0.5,
    diceRequired: false,
    description: "Build on basic skills with more advanced cutting techniques",
    stageId: 2,
    stageName: "Knife Skills & Heat Control",
    learningObjectives: [
      "Master professional-level knife cuts: julienne, brunoise, and chiffonade",
      "Understand culinary applications for specialized cuts",
      "Develop greater knife control and precision",
      "Learn to maintain consistency in cut sizes",
      "Practice efficient cutting workflows"
    ],
    equipmentNeeded: [
      "Sharp chef's knife",
      "Cutting board",
      "Vegetables for practice (carrots, celery, herbs)",
      "Ruler or measuring tape (optional)",
      "Kitchen towel",
      "Prep bowls"
    ],
    contentSections: [
      {
        title: "Advanced Cutting Techniques",
        subsections: [
          {
            subtitle: "Julienne (Matchstick Cut)",
            content: "Create precise 1/8 inch × 1/8 inch × 2 inch strips. Practice with firm vegetables like carrots, zucchini, and bell peppers. Used in stir-fries, salads, and garnishes."
          },
          {
            subtitle: "Brunoise (Fine Dice)",
            content: "Transform julienne cuts into tiny 1/8 inch cubes. Requires extreme precision and is used for refined sauces, clear soups, and elegant presentations."
          },
          {
            subtitle: "Chiffonade (Ribbon Cut)",
            content: "Stack and roll large, flat leaves tightly, then slice thinly to create delicate herb ribbons. Perfect for garnishing and adding fresh herb flavor."
          }
        ]
      }
    ],
    practicalExercises: [
      {
        title: "Precision Cutting Challenge",
        steps: [
          "Create julienne cuts of increasing precision",
          "Transform julienne into perfect brunoise cubes",
          "Practice chiffonade with different leaf types",
          "Measure and verify cut dimensions",
          "Create a dish showcasing multiple cutting techniques"
        ]
      }
    ],
    completionChecklist: [
      "Demonstrated julienne cutting technique",
      "Created uniform brunoise cubes",
      "Produced delicate chiffonade ribbons",
      "Maintained consistent cut sizes",
      "Applied cuts in a practical cooking scenario"
    ],
    tipsForSuccess: [
      "Take your time—advanced cuts require patience",
      "Keep your knife extremely sharp",
      "Use the tip of the knife for precise brunoise cutting",
      "Practice these cuts regularly to build muscle memory",
      "Focus on precision first, then gradually increase speed"
    ]
  },
  {
    id: 8,
    questName: "Heat Control Fundamentals",
    rank: "Home Cook",
    type: "Training",
    primaryFocus: "Technique",
    secondaryFocus: "Management",
    primaryHours: 1,
    secondaryHours: 0.5,
    diceRequired: false,
    description: "Master understanding and control of cooking temperatures",
    stageId: 2,
    stageName: "Knife Skills & Heat Control",
    learningObjectives: [
      "Understand different heat levels and their applications",
      "Master heat adjustment techniques on various cooking appliances",
      "Learn to recognize visual and sensory cues for proper heat",
      "Practice precise temperature control through egg cookery",
      "Develop troubleshooting skills for heat-related cooking problems"
    ],
    equipmentNeeded: [
      "Medium pot or pan",
      "Skillet or sauté pan",
      "Eggs (6-12 for practice)",
      "Butter or oil",
      "Spatula or spoon",
      "Instant-read thermometer (optional)",
      "Timer"
    ],
    contentSections: [
      {
        title: "Heat Level Understanding",
        subsections: [
          {
            subtitle: "Temperature Ranges",
            content: "Learn standard heat levels: Low (180-200°F), Medium-Low (200-300°F), Medium (300-375°F), Medium-High (375-450°F), High (450-650°F). Understand appropriate uses for each heat level."
          },
          {
            subtitle: "Cookware and Heat Behavior",
            content: "Study how different materials conduct heat: Stainless Steel (uneven but heat-retentive), Cast Iron (slow but even heating), Nonstick (quick heating), Copper (extremely responsive)."
          }
        ]
      }
    ],
    practicalExercises: [
      {
        title: "Egg Cookery Heat Control",
        steps: [
          "Practice cooking eggs using different techniques",
          "Identify proper heat levels for each egg style",
          "Recognize visual and sensory cues of correct heat",
          "Adjust heat to maintain proper cooking conditions",
          "Compare results of different heat management approaches"
        ]
      }
    ],
    completionChecklist: [
      "Demonstrated understanding of heat levels",
      "Cooked eggs with precise temperature control",
      "Recognized proper heat indicators",
      "Adjusted heat effectively during cooking",
      "Produced consistent, well-cooked eggs"
    ],
    tipsForSuccess: [
      "Heat control takes practice—be patient with yourself",
      "Focus on visual and sensory cues rather than dial settings",
      "Learn the specific behavior of your own stove",
      "Preheating properly is critical for most cooking methods",
      "Start with lower heat when uncertain—you can always increase"
    ]
  },
  {
    id: 10,
    questName: "Boiling & Simmering",
    rank: "Home Cook",
    type: "Training",
    primaryFocus: "Technique",
    secondaryFocus: "Management",
    primaryHours: 1,
    secondaryHours: 0.5,
    diceRequired: false,
    description: "Master cooking techniques for foods in liquid",
    stageId: 2,
    stageName: "Knife Skills & Heat Control",
    learningObjectives: [
      "Understand the difference between boiling and simmering temperatures",
      "Learn proper techniques for cooking various foods in liquid",
      "Master timing and doneness indicators for pasta, grains, and vegetables",
      "Develop skills for managing multiple items cooking in liquid",
      "Practice proper salting and seasoning of cooking liquid"
    ],
    equipmentNeeded: [
      "Large pot for pasta/vegetables",
      "Medium saucepan for grains",
      "Colander or strainer",
      "Timer",
      "Measuring cups and spoons",
      "Slotted spoon",
      "Long-handled spoon for stirring",
      "Tongs",
      "Instant-read thermometer (optional)"
    ],
    contentSections: [
      {
        title: "Water Temperature Fundamentals",
        subsections: [
          {
            subtitle: "Temperature Spectrum",
            content: "Learn water temperature ranges: Cold (32-80°F), Warm (80-110°F), Hot (110-150°F), Poaching (160-180°F), Simmering (180-205°F), Boiling (212°F at sea level). Understand practical applications for each range."
          },
          {
            subtitle: "Altitude Considerations",
            content: "Understand how altitude affects boiling point: Sea Level (212°F), 2,000 feet (208°F), 5,000 feet (203°F). Learn to adjust cooking times and liquid quantities accordingly."
          }
        ]
      }
    ],
    practicalExercises: [
      {
        title: "Liquid Cooking Techniques",
        steps: [
          "Practice boiling pasta to al dente perfection",
          "Cook different types of grains using absorption method",
          "Blanch various vegetables to maintain color and texture",
          "Practice maintaining consistent liquid temperatures",
          "Coordinate cooking of multiple ingredients in liquid"
        ]
      }
    ],
    completionChecklist: [
      "Demonstrated proper boiling and simmering techniques",
      "Cooked pasta to correct doneness",
      "Prepared perfectly cooked grains",
      "Maintained appropriate cooking liquid temperatures",
      "Seasoned cooking liquids effectively"
    ],
    tipsForSuccess: [
      "Salt pasta water generously—it should taste like sea water",
      "Use a timer rather than guessing cooking times",
      "Test for doneness frequently as cooking time approaches",
      "Save pasta water for sauces—it's liquid gold",
      "Don't crowd the pot when blanching vegetables"
    ]
  },
  {
    id: 118,
    questName: "Knife Skills Video Study",
    rank: "Home Cook",
    type: "Explore",
    primaryFocus: "Technique",
    secondaryFocus: "Management",
    primaryHours: 1,
    secondaryHours: 0.5,
    diceRequired: false,
    description: "Learn advanced knife skills through video instruction",
    stageId: 2,
    stageName: "Knife Skills & Heat Control",
    learningObjectives: [
      "Understand proper knife grip and cutting techniques",
      "Learn standard cuts and their culinary applications",
      "Develop awareness of safety practices and workflow",
      "Create a progressive skill-building plan for knife technique"
    ],
    equipmentNeeded: [
      "Device with internet access",
      "Notebook or digital note-taking system",
      "Knife (for reference and potential practice)",
      "Kitchen towel"
    ],
    contentSections: [
      {
        title: "Video Research Approach",
        subsections: [
          {
            subtitle: "Video Selection Criteria",
            content: "Look for high-quality knife skills videos from culinary schools, professional chefs, and reputable cooking websites. Prioritize videos with multiple camera angles, slow-motion demonstrations, and clear explanations."
          },
          {
            subtitle: "Analysis Techniques",
            content: "Focus on hand positioning, knife handling, cutting motion, and safety practices. Take detailed notes on techniques, common mistakes, and professional tips."
          }
        ]
      }
    ],
    practicalExercises: [
      {
        title: "Knife Technique Video Analysis",
        steps: [
          "Select 3-5 high-quality knife skills tutorial videos",
          "Watch videos multiple times, taking detailed notes",
          "Sketch or diagram proper hand and knife positioning",
          "Identify key techniques and safety considerations",
          "Create a personal reference guide for knife skills"
        ]
      }
    ],
    completionChecklist: [
      "Analyzed multiple knife skills tutorial videos",
      "Created detailed notes on cutting techniques",
      "Documented proper hand and knife positioning",
      "Identified key safety practices",
      "Developed a personal knife skills reference guide"
    ],
    tipsForSuccess: [
      "Focus on understanding body mechanics rather than just visual outcomes",
      "Study variations in technique between different expert demonstrators",
      "Pay special attention to transitions between cuts",
      "Note workflow patterns that maximize efficiency and safety",
      "Consider filming your own practice sessions to compare"
    ]
  },
  {
    id: 109,
    questName: "Food Science Basics",
    rank: "Home Cook",
    type: "Explore",
    primaryFocus: "Technique",
    secondaryFocus: "Management",
    primaryHours: 1.5,
    secondaryHours: 0.5,
    diceRequired: false,
    description: "Explore the scientific principles behind cooking techniques",
    stageId: 2,
    stageName: "Knife Skills & Heat Control",
      milestone: true,
      unlocksStage: 3,
      unlockMessage: "Stage 3: Flavor Development is now available!",
    learningObjectives: [
      "Understand fundamental scientific principles in cooking",
      "Learn how different cooking methods affect food at a molecular level",
      "Discover the reasons behind common cooking practices",
      "Apply scientific knowledge to improve cooking technique"
    ],
    equipmentNeeded: [
      "Reference materials (books, trusted websites)",
      "Notebook or digital note-taking system",
      "Access to internet for research",
      "Basic kitchen tools for optional demonstrations",
      "Common household ingredients"
    ],
    contentSections: [
      {
        title: "Food Science Exploration",
        subsections: [
          {
            subtitle: "Scientific Cooking Principles",
            content: "Investigate key scientific concepts in cooking: protein denaturation, Maillard reaction, emulsification, fermentation, and heat transfer methods. Understand how chemical and physical changes occur during cooking."
          },
          {
            subtitle: "Practical Applications",
            content: "Explore how scientific understanding can improve cooking techniques, from choosing the right cooking method to understanding why certain ingredients interact the way they do."
          }
        ]
      }
    ],
    practicalExercises: [
    {
      title: "Cooking Science Research Project",
      steps: [
        "Select 3-4 fundamental food science principles",
        "Research scientific explanations for each principle",
        "Document how these principles apply to cooking techniques",
        "Conduct a simple kitchen experiment to demonstrate a principle",
        "Create a presentation or summary of your findings"
      ]
    }
  ],
  contentSections: [
    {
      title: "Food Science Exploration",
      subsections: [
        {
          subtitle: "Scientific Cooking Principles",
          content: "Investigate key scientific concepts in cooking: protein denaturation, Maillard reaction, emulsification, fermentation, and heat transfer methods. Understand how chemical and physical changes occur during cooking."
        },
        {
          subtitle: "Practical Applications",
          content: "Explore how scientific understanding can improve cooking techniques, from choosing the right cooking method to understanding why certain ingredients interact the way they do."
        }
      ]
    }
  ],
  completionChecklist: [
    "Researched multiple food science principles",
    "Documented scientific explanations for cooking techniques",
    "Conducted a practical experiment",
    "Created a comprehensive summary of findings",
    "Applied scientific insights to cooking methods"
  ],
  tipsForSuccess: [
    "Focus on understanding rather than memorizing terminology",
    "Look for sources that explain concepts simply",
    "Draw connections between different scientific principles",
    "Start with familiar cooking problems you've encountered",
    "Create your reference guide with your future self in mind"
  ]
}];
