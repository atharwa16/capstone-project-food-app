import type { AnalysisResult } from '@/types';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

type FoodDatabase = {
  [key: string]: Omit<AnalysisResult, 'id' | 'userId' | 'imageUrl' | 'analysedAt'>;
};

const FOOD_DATABASE: FoodDatabase = {
  pizza: {
    foodName: 'Margherita Pizza',
    confidence: 0.94,
    detectedItems: [
      { name: 'Pizza', confidence: 0.94 },
      { name: 'Mozzarella Cheese', confidence: 0.88 },
      { name: 'Tomato Sauce', confidence: 0.85 },
      { name: 'Fresh Basil', confidence: 0.79 },
    ],
    ingredients: ['Wheat Flour', 'Tomato Sauce', 'Mozzarella', 'Olive Oil', 'Fresh Basil', 'Salt', 'Yeast'],
    nutrition: { calories: 266, protein: 11, carbs: 33, fat: 10, fiber: 2, sugar: 3 },
    authenticityResult: 'AUTHENTIC',
    authenticityScore: 0.91,
    aiInsights: 'This appears to be a classic Neapolitan-style Margherita Pizza. The thin, slightly charred crust with well-distributed toppings suggests proper high-temperature baking. The color balance of the tomato sauce and melted mozzarella indicates fresh, quality ingredients.',
    cuisineType: 'Italian',
  },
  biryani: {
    foodName: 'Chicken Biryani',
    confidence: 0.92,
    detectedItems: [
      { name: 'Biryani', confidence: 0.92 },
      { name: 'Basmati Rice', confidence: 0.89 },
      { name: 'Chicken', confidence: 0.86 },
      { name: 'Caramelized Onions', confidence: 0.78 },
      { name: 'Saffron', confidence: 0.71 },
    ],
    ingredients: ['Basmati Rice', 'Chicken', 'Yogurt', 'Saffron', 'Onions', 'Tomatoes', 'Spices', 'Ghee', 'Mint'],
    nutrition: { calories: 352, protein: 23, carbs: 42, fat: 9, fiber: 1, sugar: 2 },
    authenticityResult: 'AUTHENTIC',
    authenticityScore: 0.89,
    aiInsights: 'The golden saffron rice with visible caramelized onions and well-cooked chicken suggests a properly prepared Hyderabadi-style biryani. The layering of rice and meat is consistent with traditional dum cooking methods.',
    cuisineType: 'Indian',
  },
  burger: {
    foodName: 'Classic Beef Burger',
    confidence: 0.96,
    detectedItems: [
      { name: 'Burger', confidence: 0.96 },
      { name: 'Beef Patty', confidence: 0.91 },
      { name: 'Brioche Bun', confidence: 0.88 },
      { name: 'Lettuce', confidence: 0.83 },
      { name: 'Tomato', confidence: 0.80 },
      { name: 'Cheese', confidence: 0.77 },
    ],
    ingredients: ['Beef', 'Brioche Bun', 'Lettuce', 'Tomato', 'Cheddar Cheese', 'Pickles', 'Onion', 'Sauce'],
    nutrition: { calories: 483, protein: 28, carbs: 38, fat: 24, fiber: 2, sugar: 7 },
    authenticityResult: 'AUTHENTIC',
    authenticityScore: 0.92,
    aiInsights: 'A well-constructed classic American-style burger. The patty appears properly seared with good browning on the exterior. The layering of fresh vegetables and melted cheese on a toasted brioche bun indicates quality preparation.',
    cuisineType: 'American',
  },
  dosa: {
    foodName: 'Masala Dosa',
    confidence: 0.95,
    detectedItems: [
      { name: 'Dosa', confidence: 0.95 },
      { name: 'Potato Filling', confidence: 0.88 },
      { name: 'Coconut Chutney', confidence: 0.82 },
      { name: 'Sambar', confidence: 0.79 },
    ],
    ingredients: ['Rice Batter', 'Urad Dal', 'Potato', 'Onion', 'Mustard Seeds', 'Curry Leaves', 'Turmeric', 'Coconut'],
    nutrition: { calories: 206, protein: 5, carbs: 32, fat: 8, fiber: 3, sugar: 2 },
    authenticityResult: 'AUTHENTIC',
    authenticityScore: 0.94,
    aiInsights: 'This South Indian Masala Dosa shows excellent fermentation in the crispy, golden-brown crepe. The filling appears to be a classic potato masala with visible mustard seeds and curry leaves — hallmarks of authentic preparation.',
    cuisineType: 'South Indian',
  },
  pasta: {
    foodName: 'Spaghetti Carbonara',
    confidence: 0.89,
    detectedItems: [
      { name: 'Pasta', confidence: 0.89 },
      { name: 'Egg Sauce', confidence: 0.82 },
      { name: 'Pancetta', confidence: 0.76 },
      { name: 'Parmesan', confidence: 0.71 },
    ],
    ingredients: ['Spaghetti', 'Eggs', 'Pancetta', 'Parmesan Cheese', 'Black Pepper', 'Salt'],
    nutrition: { calories: 492, protein: 22, carbs: 56, fat: 19, fiber: 2, sugar: 1 },
    authenticityResult: 'AUTHENTIC',
    authenticityScore: 0.87,
    aiInsights: 'A classically prepared Spaghetti Carbonara with the characteristic creamy egg coating (not cream-based). The visible bits of pancetta and freshly grated Parmesan are consistent with authentic Roman-style preparation.',
    cuisineType: 'Italian',
  },
  cake: {
    foodName: 'Chocolate Cake',
    confidence: 0.97,
    detectedItems: [
      { name: 'Chocolate Cake', confidence: 0.97 },
      { name: 'Chocolate Frosting', confidence: 0.93 },
      { name: 'Sponge Layers', confidence: 0.88 },
    ],
    ingredients: ['Flour', 'Cocoa Powder', 'Eggs', 'Sugar', 'Butter', 'Baking Powder', 'Milk', 'Dark Chocolate'],
    nutrition: { calories: 367, protein: 5, carbs: 53, fat: 17, fiber: 2, sugar: 38 },
    authenticityResult: 'AUTHENTIC',
    authenticityScore: 0.95,
    aiInsights: 'A richly layered chocolate cake with glossy ganache frosting. The even layers and uniform crumb structure suggest proper baking. The deep chocolate color indicates high-quality cocoa or dark chocolate.',
    cuisineType: 'Dessert',
  },
  default: {
    foodName: 'Mixed Food Platter',
    confidence: 0.78,
    detectedItems: [
      { name: 'Prepared Food', confidence: 0.78 },
      { name: 'Vegetables', confidence: 0.65 },
      { name: 'Protein Source', confidence: 0.59 },
    ],
    ingredients: ['Various Ingredients Detected'],
    nutrition: { calories: 320, protein: 12, carbs: 40, fat: 11, fiber: 4, sugar: 5 },
    authenticityResult: 'UNCERTAIN',
    authenticityScore: 0.72,
    aiInsights: 'The image shows a prepared food dish with mixed components. The visual analysis detects both vegetable and protein elements. For more specific analysis, a clearer image focused on a single dish would yield better results.',
    cuisineType: 'Mixed',
  },
};

const FOOD_STAGES = [
  'Detecting food items',
  'Identifying ingredients',
  'Processing visual features',
  'Estimating nutrition',
  'Generating insights',
  'Finalizing analysis',
];

function detectFoodType(filename: string): keyof typeof FOOD_DATABASE {
  const lower = filename.toLowerCase();
  if (lower.includes('pizza')) return 'pizza';
  if (lower.includes('biryani') || lower.includes('rice')) return 'biryani';
  if (lower.includes('burger')) return 'burger';
  if (lower.includes('dosa')) return 'dosa';
  if (lower.includes('pasta') || lower.includes('spaghetti')) return 'pasta';
  if (lower.includes('cake') || lower.includes('dessert') || lower.includes('sweet')) return 'cake';
  // Random selection from available foods for demo
  const foods = ['pizza', 'biryani', 'burger', 'dosa', 'pasta', 'cake'] as const;
  return foods[Math.floor(Math.random() * foods.length)];
}

export const analysisService = {
  stages: FOOD_STAGES,

  async analyzeFoodImage(
    imageUrl: string,
    filename: string,
    userId?: string,
    onStage?: (stage: string, index: number) => void,
  ): Promise<AnalysisResult> {
    const totalDuration = 3500;
    const stageDelay = totalDuration / FOOD_STAGES.length;

    for (let i = 0; i < FOOD_STAGES.length; i++) {
      onStage?.(FOOD_STAGES[i], i);
      await delay(stageDelay);
    }

    const foodType = detectFoodType(filename);
    const foodData = FOOD_DATABASE[foodType] ?? FOOD_DATABASE.default;

    const result: AnalysisResult = {
      id: `ANA${Date.now()}`,
      userId,
      imageUrl,
      ...foodData,
      confidence: foodData.confidence * (0.9 + Math.random() * 0.1),
      analysedAt: new Date().toISOString(),
    };

    return result;
  },
};
