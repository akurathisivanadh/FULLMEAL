import React, { useState, useEffect } from 'react';
import { UserProfile, MealAnalysis } from '../types';
import { motion } from 'motion/react';
import { Sparkles, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';

interface Props {
  profile: UserProfile;
  todayTotals: any;
  todayMeals: MealAnalysis[];
}

export function CoachPanel({ profile, todayTotals, todayMeals }: Props) {
  const [insight, setInsight] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchInsights = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/coach', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            profile, 
            todayTotals, 
            meals: todayMeals.map(m => m.items.map(i => i.name)) 
          })
        });
        const data = await res.json();
        setInsight(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    // Only fetch if they have logged something or if we haven't loaded yet
    fetchInsights();
  }, [todayTotals.calories]);

  if (loading) {
    return (
      <div className="bg-[#121212] border border-white/5 rounded-3xl p-6 flex items-center justify-center h-48">
        <div className="flex flex-col items-center text-brand-primary animate-pulse">
          <Sparkles className="w-8 h-8 mb-4" />
          <div className="text-sm font-bold uppercase tracking-widest text-[#D4FF00]">AI Coach is Analyzing...</div>
        </div>
      </div>
    );
  }

  if (!insight || insight.error || !insight.missingNutrients) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-brand-primary/5 border border-brand-primary/20 rounded-3xl p-6 md:p-8"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-bold uppercase tracking-widest text-[#D4FF00] flex items-center">
          <Sparkles className="w-5 h-5 mr-2" /> Coach AI Guidance
        </h3>
        {insight.status === 'ON_TRACK' ? (
          <span className="px-3 py-1 bg-green-500/10 text-green-400 text-[10px] font-bold rounded-full border border-green-500/20 flex items-center">
            <CheckCircle className="w-3 h-3 mr-1"/> ON TRACK
          </span>
        ) : (
          <span className="px-3 py-1 bg-orange-500/10 text-orange-400 text-[10px] font-bold rounded-full border border-orange-500/20 flex items-center">
            <AlertCircle className="w-3 h-3 mr-1"/> NEEDS ATTENTION
          </span>
        )}
      </div>

      <p className="text-white/80 leading-relaxed text-sm italic mb-6">
        "{insight.actionPlan}"
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        {insight.missingNutrients.length > 0 && (
          <div>
            <div className="text-[10px] text-white/40 uppercase font-bold mb-3">Lacking Nutrients</div>
            <div className="flex flex-wrap gap-2">
              {insight.missingNutrients.map((n: string, i: number) => (
                <span key={i} className="px-3 py-1.5 bg-red-500/10 text-red-400 text-xs rounded-lg border border-red-500/10">
                  {n}
                </span>
              ))}
            </div>
          </div>
        )}

        {insight.suggestedMeals.length > 0 && (
          <div>
            <div className="text-[10px] text-white/40 uppercase font-bold mb-3">Suggested Additions</div>
            <ul className="space-y-2">
              {insight.suggestedMeals.map((meal: string, i: number) => (
                <li key={i} className="text-sm text-white/80 flex items-start">
                  <ArrowRight className="w-4 h-4 mr-2 text-brand-primary shrink-0 mt-0.5" />
                  {meal}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </motion.div>
  );
}
