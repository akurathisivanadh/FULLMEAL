import { Type } from "@google/genai";

export interface UserProfile {
  age: number;
  gender: string;
  height: number; // in cm
  weight: number; // in kg
  activityLevel: string;
  healthGoals: string[];
  lifestyleHabits: string[];
  healthConditions: string[]; // e.g., Diabetes, PCOS, Celiac
  bmi: number;
  targetMacros?: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    fiber: number;
  };
}

export interface FoodItemInfo {
  name: string;
  portion: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  fiber: number;
  vitamins: string[];
  minerals: string[];
  hydrationValue: string;
  gutHealthScore: number;
}

export interface HealthInsights {
  proteinDeficiency: boolean;
  excessRefinedCarbs: boolean;
  fiberInsufficiency: boolean;
  poorHydration: boolean;
  nutritionalImbalance: boolean;
  mealQualityScore: number;
  metabolicHealthIndicators: string[];
  recommendations: string[];
}

export interface MealAnalysis {
  id?: string;
  isFood: boolean;
  rejectionReason?: string;
  items: FoodItemInfo[];
  totals: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    fiber: number;
  };
  healthInsights: HealthInsights;
  timestamp: string;
  imageUrl?: string;
}

// Function to calculate BMI
export function calculateBMI(weight: number, heightCm: number): number {
  if (!weight || !heightCm) return 0;
  const heightM = heightCm / 100;
  return parseFloat((weight / (heightM * heightM)).toFixed(1));
}
