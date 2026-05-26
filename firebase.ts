import React from 'react';
import { MealAnalysis } from '../types';
import { motion } from 'motion/react';
import { Activity, Droplets, Flame, Brain, AlertTriangle, ChevronRight, Apple } from 'lucide-react';

interface Props {
  analysis: MealAnalysis;
  onContinue: () => void;
}

export function AnalysisView({ analysis, onContinue }: Props) {
  if (!analysis.isFood) {
    return (
      <div className="text-center space-y-6 max-w-lg mx-auto py-12">
        <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mx-auto text-red-500">
          <AlertTriangle className="w-12 h-12" />
        </div>
        <h2 className="text-2xl font-display font-semibold text-white">No Food Detected</h2>
        <p className="text-gray-400">We couldn't identify any nutritional content in this image. Please ensure the food is clearly visible.</p>
        <button onClick={onContinue} className="px-8 py-3 rounded-xl bg-white text-black font-semibold">Try Again</button>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto space-y-8 pb-12"
    >
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-light tracking-tight text-white">Meal <span className="font-bold">Analysis</span></h2>
          <p className="text-brand-primary mt-1 text-sm">{analysis.items.length} item{analysis.items.length !== 1 && 's'} detected</p>
        </div>
        <div className="text-right">
          <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Quality Score</div>
          <div className="text-3xl font-bold text-brand-secondary">{analysis.healthInsights.mealQualityScore}<span className="text-lg text-white/30 font-normal">/100</span></div>
        </div>
      </div>

      {/* Main Macros */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Calories', value: analysis.totals.calories, unit: 'kcal', icon: Flame, color: 'text-orange-500' },
          { label: 'Protein', value: analysis.totals.protein, unit: 'g', icon: Activity, color: 'text-brand-primary' },
          { label: 'Carbs', value: analysis.totals.carbs, unit: 'g', icon: Apple, color: 'text-brand-tertiary' },
          { label: 'Fats', value: analysis.totals.fats, unit: 'g', icon: Droplets, color: 'text-yellow-500' },
        ].map(macro => (
          <div key={macro.label} className="bg-dark-surface border border-white/5 rounded-2xl p-5 flex flex-col justify-between aspect-[4/3]">
            <macro.icon className={`w-5 h-5 ${macro.color}`} />
            <div>
              <div className="text-2xl font-bold text-white mt-4">{macro.value}<span className="text-xs font-normal text-white/30 ml-1">{macro.unit}</span></div>
              <div className="text-white/40 text-[10px] uppercase font-bold mt-1 tracking-widest">{macro.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Items Breakdown */}
      <div className="bg-[#121212] rounded-3xl border border-white/5 p-6 space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-widest text-white/60 mb-6">Detected Items</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          {analysis.items.map((item, idx) => (
            <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-white font-medium capitalize">{item.name}</h4>
                  <p className="text-sm text-gray-400">{item.portion}</p>
                </div>
                <div className="text-brand-primary font-mono text-sm">{item.calories} kcal</div>
              </div>
              
              <div className="flex justify-between text-xs text-gray-500 font-mono pt-3 border-t border-dark-border/50">
                <span>P: {item.protein}g</span>
                <span>C: {item.carbs}g</span>
                <span>F: {item.fats}g</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Metabolic Insights */}
      <div className="bg-[#121212] border border-white/5 rounded-3xl p-6 md:p-8">
        <h3 className="text-sm font-bold uppercase tracking-widest text-white/60 mb-6 flex items-center">
          <Brain className="w-5 h-5 mr-2 text-brand-secondary" /> Metabolic Insights
        </h3>

        <ul className="space-y-4 mb-8">
          {analysis.healthInsights.metabolicHealthIndicators.map((indicator, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <span className="text-brand-secondary font-bold text-xs mt-1">◍</span>
              <span className="text-white/80 leading-relaxed text-sm">{indicator}</span>
            </li>
          ))}
        </ul>

        {analysis.healthInsights.recommendations.length > 0 && (
          <div className="mt-8 p-4 rounded-2xl bg-brand-primary/5 border border-brand-primary/20">
             <div className="text-[10px] text-brand-primary font-bold uppercase mb-3 flex items-center">
               <span className="mr-2">✦</span> Actionable Advice
             </div>
             <ul className="space-y-3 pl-4 border-l-2 border-brand-primary/20">
                {analysis.healthInsights.recommendations.map((rec, idx) => (
                  <li key={idx} className="text-white/80 italic text-xs leading-relaxed">{rec}</li>
                ))}
             </ul>
          </div>
        )}
      </div>

      <button onClick={onContinue} className="w-full py-4 rounded-full bg-brand-primary text-black shadow-lg shadow-brand-primary/10 font-bold tracking-wide hover:scale-[1.02] active:scale-95 transition-transform flex items-center justify-center gap-2">
        SAVE TO DASHBOARD <ChevronRight className="w-5 h-5" />
      </button>

    </motion.div>
  );
}
