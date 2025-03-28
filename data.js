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
        description: "Learn safe food handling, cleaning, and cross-contamination prevention"
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
        description: "Master basic vegetable cuts: rough chop, dice, and slice"
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
        description: "Practice proper preparation and organization of ingredients"
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
        description: "Learn to read, understand, and follow basic recipes"
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
        description: "Practice advanced cuts: julienne, brunoise, and chiffonade"
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
        description: "Master cooking grains, vegetables, and pasta in liquid"
    },
    {
        id: 13,
        questName: "Sautéing Basics",
        rank: "Home Cook",
        type: "Training",
        primaryFocus: "Technique",
        secondaryFocus: "Flavor",
        primaryHours: 1,
        secondaryHours: 0.5,
        diceRequired: false,
        description: "Learn proper sautéing technique using vegetables"
    },
    {
        id: 45,
        questName: "Simple Breakfast",
        rank: "Home Cook",
        type: "Main",
        primaryFocus: "Technique",
        secondaryFocus: "Management",
        primaryHours: 1.5,
        secondaryHours: 1,
        diceRequired: true,
        description: "Prepare eggs, toast, and a simple side"
    },
    {
        id: 46,
        questName: "Basic Sandwich Lunch",
        rank: "Home Cook",
        type: "Main",
        primaryFocus: "Technique",
        secondaryFocus: "Management",
        primaryHours: 1.5,
        secondaryHours: 1,
        diceRequired: true,
        description: "Construct a balanced sandwich with sides"
    },
    {
        id: 47,
        questName: "Easy Pasta Dinner",
        rank: "Home Cook",
        type: "Main",
        primaryFocus: "Technique",
        secondaryFocus: "Management",
        primaryHours: 2,
        secondaryHours: 1,
        diceRequired: true,
        description: "Cook a simple pasta dish with sauce and protein"
    },
    {
        id: 76,
        questName: "Simple Salad",
        rank: "Home Cook",
        type: "Side",
        primaryFocus: "Technique",
        secondaryFocus: "Flavor",
        primaryHours: 1,
        secondaryHours: 0.5,
        diceRequired: true,
        description: "Prepare a fresh salad with homemade dressing"
    },
    {
        id: 77,
        questName: "Basic Vegetable Side",
        rank: "Home Cook",
        type: "Side",
        primaryFocus: "Technique",
        secondaryFocus: "Flavor",
        primaryHours: 1,
        secondaryHours: 0.5,
        diceRequired: true,
        description: "Cook a simple vegetable side dish"
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
        description: "Study a cookbook and select three recipes to try"
    },
    {
        id: 104,
        questName: "Cooking YouTube Research",
        rank: "Home Cook",
        type: "Explore",
        primaryFocus: "Technique",
        secondaryFocus: "Management",
        primaryHours: 1,
        secondaryHours: 0.5,
        diceRequired: false,
        description: "Watch cooking tutorials and take notes on techniques"
    }
];