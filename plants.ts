import { PlantType, PlantHealthStatus, PlantStage } from "./types";

export interface PlantConfig {
  type: PlantType;
  englishName: string;
  banglaName: string;
  description: string;
  unlockStreak: number;
  categorySuggestion: string;
}

export const PLANTS: PlantConfig[] = [
  // Starter Plants
  { type: "Mango / Aam", englishName: "Mango", banglaName: "Aam", description: "Classic, strong, long-term growth", unlockStreak: 0, categorySuggestion: "Reading, Study, Money or business" },
  { type: "Banana / Kola", englishName: "Banana", banglaName: "Kola", description: "Fast-growing, simple, everyday energy", unlockStreak: 0, categorySuggestion: "Sleep, Easy beginner, Family and home" },
  { type: "Guava / Peyara", englishName: "Guava", banglaName: "Peyara", description: "Friendly, fresh, balanced", unlockStreak: 0, categorySuggestion: "Health, Easy beginner" },
  { type: "Papaya / Pepe", englishName: "Papaya", banglaName: "Pepe", description: "Healthy, daily wellness", unlockStreak: 0, categorySuggestion: "Health, Family and home" },
  { type: "Lemon / Lebu", englishName: "Lemon", banglaName: "Lebu", description: "Fresh, clean, simple", unlockStreak: 0, categorySuggestion: "Hydration, Health" },
  { type: "Date Palm / Khejur", englishName: "Date Palm", banglaName: "Khejur", description: "Patient and steady. Best for long-term discipline habits", unlockStreak: 0, categorySuggestion: "Fitness, Meditation, Long-term difficult" },
  { type: "Wax Apple / Jamrul", englishName: "Wax Apple", banglaName: "Jamrul", description: "Fresh, soft, light, friendly", unlockStreak: 0, categorySuggestion: "Hydration" },

  // Unlock after 3 days
  { type: "Strawberry", englishName: "Strawberry", banglaName: "Strawberry", description: "Cute, small, beginner-friendly", unlockStreak: 3, categorySuggestion: "Creative, Easy beginner" },
  { type: "Jujube / Boroi", englishName: "Jujube", banglaName: "Boroi", description: "Small but consistent", unlockStreak: 3, categorySuggestion: "Easy beginner" },
  { type: "Pineapple / Anaros", englishName: "Pineapple", banglaName: "Anaros", description: "Fun, bright, energetic", unlockStreak: 3, categorySuggestion: "Creative" },
  { type: "Bengal Currant / Karamcha", englishName: "Bengal Currant", banglaName: "Karamcha", description: "Sharp, energetic, protective, focused", unlockStreak: 3, categorySuggestion: "Fitness" },
  { type: "Phalsa / Falsa", englishName: "Phalsa", banglaName: "Falsa", description: "Cool, refreshing, summer-themed, gentle", unlockStreak: 3, categorySuggestion: "Hydration" },
  { type: "Mulberry / Toot Fol", englishName: "Mulberry", banglaName: "Toot Fol", description: "Small progress, steady reward, sweet consistency", unlockStreak: 3, categorySuggestion: "Easy beginner" },

  // Unlock after 7 days
  { type: "Jackfruit / Kathal", englishName: "Jackfruit", banglaName: "Kathal", description: "Big, powerful, hardworking", unlockStreak: 7, categorySuggestion: "Fitness, Family and home, Long-term difficult" },
  { type: "Coconut / Narikel", englishName: "Coconut", banglaName: "Narikel", description: "Calm, tropical, steady progress", unlockStreak: 7, categorySuggestion: "Fitness, Hydration, Family and home, Money or business" },
  { type: "Orange / Komola", englishName: "Orange", banglaName: "Komola", description: "Cheerful, bright, positive", unlockStreak: 7, categorySuggestion: "Health" },
  { type: "Star Fruit / Kamranga", englishName: "Star Fruit", banglaName: "Kamranga", description: "Unique, creative, bright", unlockStreak: 7, categorySuggestion: "Creative" },
  { type: "Tamarind / Tetul", englishName: "Tamarind", banglaName: "Tetul", description: "Traditional, strong, nostalgic", unlockStreak: 7, categorySuggestion: "Study" },
  { type: "Burmese Grape / Lotkon", englishName: "Burmese Grape", banglaName: "Lotkon", description: "Sweet, local, cheerful, rewarding", unlockStreak: 7, categorySuggestion: "Family and home" },
  { type: "Malta / Malta", englishName: "Malta", banglaName: "Malta", description: "Cheerful, bright, positive, energetic", unlockStreak: 7, categorySuggestion: "Health" },
  { type: "Watermelon / Tormuj", englishName: "Watermelon", banglaName: "Tormuj", description: "Fun, refreshing, summer-themed", unlockStreak: 7, categorySuggestion: "Hydration" },

  // Unlock after 14 days
  { type: "Litchi / Lichu", englishName: "Litchi", banglaName: "Lichu", description: "Sweet, seasonal, rewarding", unlockStreak: 14, categorySuggestion: "Health" },
  { type: "Black Plum / Jam", englishName: "Black Plum", banglaName: "Jam", description: "Deep, focused, strong", unlockStreak: 14, categorySuggestion: "Study" },
  { type: "Hog Plum / Amra", englishName: "Hog Plum", banglaName: "Amra", description: "Fresh, playful, local", unlockStreak: 14, categorySuggestion: "Health" },
  { type: "Custard Apple / Ata", englishName: "Custard Apple", banglaName: "Ata", description: "Soft, calm, personal", unlockStreak: 14, categorySuggestion: "Meditation" },
  { type: "Sapodilla / Sofeda", englishName: "Sapodilla", banglaName: "Sofeda", description: "Calm, sweet, slow-growing, rewarding", unlockStreak: 14, categorySuggestion: "Meditation" },
  { type: "Pomelo / Batabi Lebu", englishName: "Pomelo", banglaName: "Batabi Lebu", description: "Big, fresh, bright, healthy", unlockStreak: 14, categorySuggestion: "Health" },
  { type: "Grape / Angur", englishName: "Grape", banglaName: "Angur", description: "Social, elegant, rewarding", unlockStreak: 14, categorySuggestion: "Study, Creative" },
  { type: "Melon / Bangi", englishName: "Melon", banglaName: "Bangi", description: "Light, fresh, relaxing", unlockStreak: 14, categorySuggestion: "Hydration" },
  { type: "Indian Olive / Jolpai", englishName: "Indian Olive", banglaName: "Jolpai", description: "Fresh, simple, local, balanced", unlockStreak: 14, categorySuggestion: "Health" },

  // Unlock after 30 days
  { type: "Asian Palmyra Palm / Taal", englishName: "Asian Palmyra Palm", banglaName: "Taal", description: "Patient, tall, disciplined", unlockStreak: 30, categorySuggestion: "Long-term difficult" },
  { type: "Pomegranate / Dalim", englishName: "Pomegranate", banglaName: "Dalim", description: "Premium, rich, rewarding", unlockStreak: 30, categorySuggestion: "Money or business" },
  { type: "Wood Apple / Bel", englishName: "Wood Apple", banglaName: "Bel", description: "Traditional, strong, resilient", unlockStreak: 30, categorySuggestion: "Meditation" },
  { type: "Indian Gooseberry / Amloki", englishName: "Indian Gooseberry", banglaName: "Amloki", description: "Healthy, healing, self-care", unlockStreak: 30, categorySuggestion: "Health, Study" },
  { type: "Elephant Apple / Chalta", englishName: "Elephant Apple", banglaName: "Chalta", description: "Strong, bold, traditional, resilient", unlockStreak: 30, categorySuggestion: "Fitness" },
  { type: "Dragon Fruit / Dragon Fol", englishName: "Dragon Fruit", banglaName: "Dragon Fol", description: "Modern, colorful, exciting, special", unlockStreak: 30, categorySuggestion: "Creative" },
  { type: "Passion Fruit / Passion Fol", englishName: "Passion Fruit", banglaName: "Passion Fol", description: "Creative, energetic, colorful, ambitious", unlockStreak: 30, categorySuggestion: "Creative" },
  { type: "Indian Persimmon / Gab", englishName: "Indian Persimmon", banglaName: "Gab", description: "Traditional, deep, calm, resilient", unlockStreak: 30, categorySuggestion: "Meditation" },
  
  // Rare / Premium (mapped to 30 as well, could be unlocked via other achievements, setting to 30 to align with high streak requirements)
  { type: "Cashew Fruit / Kaju Fol", englishName: "Cashew Fruit", banglaName: "Kaju Fol", description: "Rare, premium, unique, achievement-based", unlockStreak: 30, categorySuggestion: "Money or business" },
  { type: "Breadfruit / Ruti Fol", englishName: "Breadfruit", banglaName: "Ruti Fol", description: "Big, nourishing, family-focused, reliable", unlockStreak: 30, categorySuggestion: "Family and home, Long-term difficult" },
  { type: "Rambutan / Rambutan", englishName: "Rambutan", banglaName: "Rambutan", description: "Fun, playful, rare, exciting", unlockStreak: 30, categorySuggestion: "Creative" },
  { type: "Longan / Ashfol", englishName: "Longan", banglaName: "Ashfol", description: "Small, sweet, focused, consistent", unlockStreak: 30, categorySuggestion: "Study" },
  { type: "Avocado / Avocado", englishName: "Avocado", banglaName: "Avocado", description: "Modern, healthy, premium, self-care focused", unlockStreak: 30, categorySuggestion: "Health, Money or business" },
  { type: "Bilimbi / Bilimbi", englishName: "Bilimbi", banglaName: "Bilimbi", description: "Sour, playful, unique, refreshing", unlockStreak: 30, categorySuggestion: "Creative" },
  { type: "Rose Apple / Golap Jam", englishName: "Rose Apple", banglaName: "Golap Jam", description: "Elegant, gentle, sweet, premium", unlockStreak: 30, categorySuggestion: "Meditation" },
  { type: "Monkey Jack / Deua", englishName: "Monkey Jack", banglaName: "Deua", description: "Rustic, local, natural, hardworking", unlockStreak: 30, categorySuggestion: "Fitness" },
  { type: "Fig / Dumur", englishName: "Fig", banglaName: "Dumur", description: "Traditional, quiet, thoughtful, wise", unlockStreak: 30, categorySuggestion: "Study, Meditation" },
];

export const getPlantFilename = (plantType: PlantType, stage: PlantStage, status: PlantHealthStatus): string => {
  const englishName = plantType.split(" / ")[0].toLowerCase().replace(/ /g, "_");
  
  if (status === "Wilting") return `${englishName}_wilting.png`;
  if (status === "Critical") return `${englishName}_critical.png`;
  if (status === "Dead") return `${englishName}_dead.png`;

  let stageName = "seed";
  if (stage === "Sprout") stageName = "sprout";
  
  if (stage === "Small Plant" || stage === "Young Plant" || stage === "Mature Plant" || stage === "Fruiting Plant") {
     let plantNoun = "tree";
     if (englishName === "dragon_fruit" || englishName === "strawberry" || englishName === "banana" || englishName === "papaya" || englishName === "pineapple") plantNoun = "plant";
     if (englishName === "grape" || englishName === "passion_fruit") plantNoun = "vine";
     if (englishName === "bengal_currant" || englishName === "phalsa") plantNoun = "shrub";

     if (stage === "Small Plant") {
        if (plantNoun === "vine" || plantNoun === "shrub") {
             stageName = `small_${plantNoun}`;
        } else {
             stageName = "small_plant";
        }
     }
     if (stage === "Young Plant") stageName = `young_${plantNoun}`;
     if (stage === "Mature Plant") stageName = `mature_${plantNoun}`;
     if (stage === "Fruiting Plant") stageName = `fruiting_${plantNoun}`;
  }

  return `${englishName}_${stageName}.png`;
};

// Fallback emojis in case images aren't uploaded yet
export const getFallbackEmoji = (plantType: PlantType, stage: PlantStage, status: PlantHealthStatus): string => {
  if (status === "Dead") return "🥀";
  if (stage === "Seed") return "🌱";
  if (stage === "Sprout") return "🌿";
  if (stage === "Small Plant") return "🪴";
  if (stage === "Young Plant") return "🌳";
  
  const map: Record<string, string> = {
    "Mango / Aam": "🥭",
    "Jackfruit / Kathal": "🍈",
    "Banana / Kola": "🍌",
    "Coconut / Narikel": "🥥",
    "Guava / Peyara": "🍐",
    "Litchi / Lichu": "🍒",
    "Papaya / Pepe": "🍈",
    "Pineapple / Anaros": "🍍",
    "Strawberry": "🍓",
    "Asian Palmyra Palm / Taal": "🌴",
    "Black Plum / Jam": "🫐",
    "Jujube / Boroi": "🍏",
    "Hog Plum / Amra": "🍐",
    "Wood Apple / Bel": "🥥",
    "Star Fruit / Kamranga": "⭐",
    "Indian Gooseberry / Amloki": "🍈",
    "Lemon / Lebu": "🍋",
    "Orange / Komola": "🍊",
    "Pomegranate / Dalim": "🍎",
    "Custard Apple / Ata": "🍐",
    "Watermelon / Tormuj": "🍉",
    "Melon / Bangi": "🍈",
    "Date Palm / Khejur": "🌴",
    "Tamarind / Tetul": "🫘",
    "Indian Olive / Jolpai": "🫒",
    "Burmese Grape / Lotkon": "🟡",
    "Elephant Apple / Chalta": "🍏",
    "Monkey Jack / Deua": "🍈",
    "Wax Apple / Jamrul": "🍐",
    "Rose Apple / Golap Jam": "🌸",
    "Sapodilla / Sofeda": "🥔",
    "Pomelo / Batabi Lebu": "🍈",
    "Malta / Malta": "🍊",
    "Dragon Fruit / Dragon Fol": "🐉",
    "Rambutan / Rambutan": "🔴",
    "Longan / Ashfol": "🫐",
    "Grape / Angur": "🍇",
    "Fig / Dumur": "🌰",
    "Mulberry / Toot Fol": "🍇",
    "Bengal Currant / Karamcha": "🍒",
    "Phalsa / Falsa": "🫐",
    "Passion Fruit / Passion Fol": "🌺",
    "Avocado / Avocado": "🥑",
    "Bilimbi / Bilimbi": "🥒",
    "Cashew Fruit / Kaju Fol": "🥜",
    "Breadfruit / Ruti Fol": "🍈",
    "Indian Persimmon / Gab": "🍎",
  };
  return map[plantType as string] || "🌳";
};
