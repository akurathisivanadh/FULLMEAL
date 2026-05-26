import React, { useState } from 'react';
import { UserProfile, calculateBMI } from '../types';
import { motion } from 'motion/react';
import { User, Activity, Target } from 'lucide-react';
import { cn } from '../utils';

interface Props {
  initialProfile: UserProfile | null;
  onSave: (profile: UserProfile) => void;
}

export function ProfileForm({ initialProfile, onSave }: Props) {
  const [formData, setFormData] = useState<Partial<UserProfile>>(initialProfile || {
    age: 30,
    gender: 'Male',
    height: 170, // cm
    weight: 70, // kg
    activityLevel: 'Moderate',
    healthGoals: [],
    lifestyleHabits: [],
    healthConditions: []
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.age || !formData.height || !formData.weight) return;
    
    // Calculate BMR (Mifflin-St Jeor Equation)
    let bmr = 0;
    if (formData.gender === 'Male') {
      bmr = (10 * formData.weight) + (6.25 * formData.height) - (5 * formData.age) + 5;
    } else {
      bmr = (10 * formData.weight) + (6.25 * formData.height) - (5 * formData.age) - 161;
    }

    const activityMultipliers: Record<string, number> = {
      Sedentary: 1.2,
      Light: 1.375,
      Moderate: 1.55,
      "Very Active": 1.725,
      Athlete: 1.9
    };
    
    const multiplier = formData.activityLevel ? activityMultipliers[formData.activityLevel] : 1.2;
    let tdee = bmr * multiplier;

    // Adjust for goals
    if (formData.healthGoals && formData.healthGoals.includes("Weight Loss")) tdee -= 500;
    if (formData.healthGoals && formData.healthGoals.includes("Muscle Gain")) tdee += 300;

    // Macro Split (30% Protein, 40% Carbs, 30% Fats)
    const targetCals = Math.round(tdee);
    const targetProtein = Math.round((targetCals * 0.3) / 4);
    const targetCarbs = Math.round((targetCals * 0.4) / 4);
    const targetFats = Math.round((targetCals * 0.3) / 9);
    const targetFiber = Math.round((targetCals / 1000) * 14);

    onSave({
      ...(formData as UserProfile),
      bmi: calculateBMI(formData.weight, formData.height),
      targetMacros: {
        calories: targetCals,
        protein: targetProtein,
        carbs: targetCarbs,
        fats: targetFats,
        fiber: targetFiber
      }
    });
  };

  const handleGoalToggle = (goal: string) => {
    setFormData(prev => {
      const goals = prev.healthGoals || [];
      return {
        ...prev,
        healthGoals: goals.includes(goal) ? goals.filter(g => g !== goal) : [...goals, goal]
      };
    });
  };

  const handleConditionToggle = (condition: string) => {
    setFormData(prev => {
      const conds = prev.healthConditions || [];
      return {
        ...prev,
        healthConditions: conds.includes(condition) ? conds.filter(c => c !== condition) : [...conds, condition]
      };
    });
  };

  const goals = ["Weight Loss", "Muscle Gain", "Maintenance", "Metabolic Health", "Gut Health", "More Energy"];
  const activities = ["Sedentary", "Light", "Moderate", "Very Active", "Athlete"];
  const conditions = ["None", "Diabetes", "Hypertension", "PCOS", "Lactose Intolerance", "Gluten Sensitivity", "Vegan", "Keto"];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto p-6 space-y-8"
    >
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-light tracking-tight text-white mb-2">Biological <span className="font-bold">Profile</span></h2>
        <p className="text-white/40 text-sm">Configure your baseline to receive personalized metabolic insights.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Basic Metrics */}
        <div className="bg-[#121212] border border-white/5 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <User className="text-[#D4FF00] w-5 h-5" />
            <h3 className="text-sm font-bold uppercase tracking-widest text-white/60">Core Metrics</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-white/40 tracking-widest">Age</label>
              <input type="number" required value={formData.age} onChange={e => setFormData({...formData, age: Number(e.target.value)})}
                className="w-full bg-[#050505] border border-white/5 rounded-xl px-4 py-3 text-white focus:border-[#D4FF00] focus:ring-1 focus:ring-[#D4FF00] outline-none transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-white/40 tracking-widest">Gender</label>
              <select value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})}
                className="w-full bg-[#050505] border border-white/5 rounded-xl px-4 py-3 text-white focus:border-[#D4FF00] focus:ring-1 focus:ring-[#D4FF00] outline-none transition-all appearance-none">
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-white/40 tracking-widest">Height (cm)</label>
              <input type="number" required value={formData.height} onChange={e => setFormData({...formData, height: Number(e.target.value)})}
                className="w-full bg-[#050505] border border-white/5 rounded-xl px-4 py-3 text-white focus:border-[#D4FF00] focus:ring-1 focus:ring-[#D4FF00] outline-none transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-white/40 tracking-widest">Weight (kg)</label>
              <input type="number" required value={formData.weight} onChange={e => setFormData({...formData, weight: Number(e.target.value)})}
                className="w-full bg-[#050505] border border-white/5 rounded-xl px-4 py-3 text-white focus:border-[#D4FF00] focus:ring-1 focus:ring-[#D4FF00] outline-none transition-all" />
            </div>
          </div>
        </div>

        {/* Activity Level */}
        <div className="bg-[#121212] border border-white/5 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <Activity className="text-[#fb923c] w-5 h-5" />
            <h3 className="text-sm font-bold uppercase tracking-widest text-white/60">Daily Activity</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {activities.map(act => (
              <button key={act} type="button"
                onClick={() => setFormData({...formData, activityLevel: act})}
                className={cn(
                  "px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-200",
                  formData.activityLevel === act 
                    ? "border-[#fb923c] bg-[#fb923c]/10 text-white" 
                    : "border-white/5 bg-[#050505] text-white/40 hover:border-white/20 hover:text-white/80"
                )}
              >
                {act}
              </button>
            ))}
          </div>
        </div>

        {/* Goals */}
        <div className="bg-[#121212] border border-white/5 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <Target className="text-brand-secondary w-5 h-5" />
            <h3 className="text-sm font-bold uppercase tracking-widest text-white/60">Primary Objectives</h3>
          </div>
          <div className="flex flex-wrap gap-3">
            {goals.map(goal => {
              const isSelected = formData.healthGoals?.includes(goal);
              return (
                <button key={goal} type="button"
                  onClick={() => handleGoalToggle(goal)}
                  className={cn(
                    "px-4 py-2 rounded-full border text-sm font-medium transition-all duration-200",
                    isSelected
                      ? "border-brand-secondary bg-brand-secondary/10 text-brand-secondary" 
                      : "border-white/10 bg-white/5 text-white/40 hover:border-white/30"
                  )}
                >
                  {isSelected && "✓ "}{goal}
                </button>
              )
            })}
          </div>
        </div>

        {/* Health Conditions */}
        <div className="bg-[#121212] border border-white/5 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <Target className="text-red-400 w-5 h-5" />
            <h3 className="text-sm font-bold uppercase tracking-widest text-white/60">Dietary & Health Conditions</h3>
          </div>
          <div className="flex flex-wrap gap-3">
            {conditions.map(condition => {
              const isSelected = formData.healthConditions?.includes(condition);
              return (
                <button key={condition} type="button"
                  onClick={() => handleConditionToggle(condition)}
                  className={cn(
                    "px-4 py-2 rounded-full border text-sm font-medium transition-all duration-200",
                    isSelected
                      ? "border-red-400 bg-red-400/10 text-red-500" 
                      : "border-white/10 bg-white/5 text-white/40 hover:border-white/30"
                  )}
                >
                  {isSelected && "✓ "}{condition}
                </button>
              )
            })}
          </div>
        </div>

        <button type="submit" 
          className="w-full py-4 rounded-full bg-brand-primary text-black font-bold tracking-wide flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-transform shadow-lg shadow-brand-primary/10">
          INITIALIZE PROFILE
        </button>

      </form>
    </motion.div>
  );
}
