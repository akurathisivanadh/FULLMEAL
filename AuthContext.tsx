import React, { useMemo } from 'react';
import { MealAnalysis, UserProfile } from '../types';
import { motion } from 'motion/react';
import { Plus, Target, Flame, Activity } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, Tooltip } from 'recharts';
import { format, parseISO } from 'date-fns';
import { CoachPanel } from './CoachPanel';
import { AiChat } from './AiChat';

interface Props {
  profile: UserProfile;
  history: MealAnalysis[];
  onNewScan: () => void;
}

export function Dashboard({ profile, history, onNewScan }: Props) {
  
  const targetCals = profile.targetMacros?.calories || 2000;
  const targetProtein = profile.targetMacros?.protein || 100;
  const targetCarbs = profile.targetMacros?.carbs || 250;
  const targetFats = profile.targetMacros?.fats || 70;
  
  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return "Underweight";
    if (bmi < 25) return "Normal Weight";
    if (bmi < 30) return "Overweight";
    return "Obese";
  };
  const bmiCategory = getBMICategory(profile.bmi);

  // Calculate today's totals
  const todayDateString = new Date().toISOString().split('T')[0];
  const todaysMealsRaw = history.filter(m => m.timestamp && m.timestamp.startsWith(todayDateString));
  
  const todayTotals = useMemo(() => {
    return todaysMealsRaw.reduce((acc, curr) => ({
      calories: acc.calories + curr.totals.calories,
      protein: acc.protein + curr.totals.protein,
      carbs: acc.carbs + curr.totals.carbs,
      fats: acc.fats + curr.totals.fats,
    }), { calories: 0, protein: 0, carbs: 0, fats: 0 });
  }, [todaysMealsRaw]);

  // Aggregate recent days for chart
  const chartData = useMemo(() => {
    const last7Days = Array.from({length: 7}).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toISOString().split('T')[0];
    });

    return last7Days.map(dateStr => {
      const dayMeals = history.filter(m => m.timestamp.startsWith(dateStr));
      const activeCals = dayMeals.reduce((sum, m) => sum + m.totals.calories, 0);
      return {
        date: format(new Date(dateStr), 'MMM d'),
        calories: activeCals
      };
    });
  }, [history]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-5xl mx-auto space-y-8 pb-12"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-white mb-2">My <span className="font-bold">Metabolism</span></h1>
          <p className="text-white/40 text-sm">Tracking towards your <span className="text-brand-secondary">{profile.healthGoals[0] || 'Health'}</span> goals.</p>
        </div>
        
        <button 
          onClick={onNewScan}
          className="px-6 py-3 rounded-full bg-brand-primary text-black font-bold text-sm tracking-wide flex items-center gap-2 shadow-lg hover:scale-105 transition-transform shadow-brand-primary/10"
        >
          <span className="text-xl leading-none mr-1">+</span> UPLOAD MEAL
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Left Col - Daily summary */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-dark-surface border border-dark-border rounded-3xl p-6">
            <div className="flex items-center gap-2 text-white/40 text-xs font-bold uppercase tracking-widest mb-6">
              <Flame className="w-4 h-4" /> Today's Energy
            </div>
            
            <div className="mb-8">
              <div className="flex items-baseline justify-between mb-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-white tracking-tight">{todayTotals.calories}</span>
                  <span className="text-white/40 text-xs font-bold uppercase">/ {targetCals} kcal</span>
                </div>
              </div>
              <div className="w-full bg-white/5 h-1.5 rounded-full mt-4 overflow-hidden">
                <div className="bg-[#D4FF00] h-full rounded-full transition-all duration-1000" style={{ width: `${Math.min((todayTotals.calories / targetCals) * 100, 100)}%` }} />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center text-[10px] uppercase font-bold text-white/60 mb-1.5">
                  <span>Protein</span>
                  <span className="text-white">{todayTotals.protein}g / {targetProtein}g</span>
                </div>
                <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                  <div className="bg-[#D4FF00] h-full rounded-full transition-all" style={{ width: `${Math.min((todayTotals.protein / targetProtein) * 100, 100)}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center text-[10px] uppercase font-bold text-white/60 mb-1.5">
                  <span>Carbs</span>
                  <span className="text-white">{todayTotals.carbs}g / {targetCarbs}g</span>
                </div>
                <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                  <div className="bg-[#22d3ee] h-full rounded-full transition-all" style={{ width: `${Math.min((todayTotals.carbs / targetCarbs) * 100, 100)}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center text-[10px] uppercase font-bold text-white/60 mb-1.5">
                  <span>Fats</span>
                  <span className="text-white">{todayTotals.fats}g / {targetFats}g</span>
                </div>
                <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                  <div className="bg-[#fb923c] h-full rounded-full transition-all" style={{ width: `${Math.min((todayTotals.fats / targetFats) * 100, 100)}%` }} />
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-[#121212] border border-dark-border rounded-3xl p-6 flex flex-col justify-center">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-white/40 text-[10px] uppercase font-bold flex items-center gap-2"><Target className="w-3 h-3 text-brand-secondary"/> CURRENT BMI</h3>
              <span className="text-2xl font-bold text-[#D4FF00]">{profile.bmi}</span>
            </div>
            <p className="text-xs text-white/40 mb-2">Based on {profile.height}cm, {profile.weight}kg</p>
            <div className="mt-2 pt-4 border-t border-white/5">
               <p className="text-xs text-white/80">Your BMI points to the <span className="font-bold text-[#D4FF00]">{bmiCategory}</span> category.</p>
            </div>
          </div>
        </div>

        {/* Right Col - Chart & History */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Trend Chart */}
            <div className="bg-[#121212] border border-white/5 rounded-3xl p-6 h-[500px] flex flex-col">
              <h3 className="text-white/40 text-xs font-bold uppercase tracking-widest mb-6 flex items-center gap-2"><Activity className="w-4 h-4" /> Energy Trend</h3>
              <div className="flex-1 w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorCals" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#D4FF00" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#D4FF00" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" stroke="rgba(255,255,255,0.1)" tick={{fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 'bold'}} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#121212', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
                      itemStyle={{ color: '#D4FF00', fontWeight: 'bold' }}
                    />
                    <Area type="monotone" dataKey="calories" stroke="#D4FF00" strokeWidth={3} fillOpacity={1} fill="url(#colorCals)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* AI Nutritionist Chatbot */}
            <AiChat profile={profile} todayTotals={todayTotals} todayMeals={todaysMealsRaw} />
          </div>

          {/* AI Coach */}
          <CoachPanel profile={profile} todayTotals={todayTotals} todayMeals={todaysMealsRaw} />

          {/* History */}
          <div className="bg-dark-surface border border-dark-border rounded-3xl p-6">
             <h3 className="text-white/40 text-xs font-bold uppercase tracking-widest mb-6">Recent Meals</h3>
             {history.length === 0 ? (
               <div className="text-center py-8 text-gray-500">No meals logged yet. Start scanning!</div>
             ) : (
               <div className="space-y-4">
                 {history.slice(0, 5).map((meal, idx) => (
                   <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-dark-bg border border-dark-border/50">
                     <div className="flex items-center gap-4">
                       {meal.imageUrl && (
                         <img src={meal.imageUrl} alt="Meal" className="w-12 h-12 rounded-xl object-cover" />
                       )}
                       <div>
                         <div className="text-white font-medium line-clamp-1">{meal.items.map(i => i.name).join(', ') || 'Unknown Meal'}</div>
                         <div className="text-sm text-gray-500">{format(parseISO(meal.timestamp || new Date().toISOString()), 'h:mm a')}</div>
                       </div>
                     </div>
                     <div className="text-brand-primary font-mono">{meal.totals.calories} kcal</div>
                   </div>
                 ))}
               </div>
             )}
          </div>

        </div>

      </div>
    </motion.div>
  );
}
