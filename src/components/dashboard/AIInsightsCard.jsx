import React, { useState, useEffect } from 'react';
import { Sparkles, BrainCircuit, TrendingUp, Lightbulb, ChevronRight } from 'lucide-react';

const AIInsightsCard = ({ 
  title = "AI Analysis", 
  insights = [
    "Detected 15% efficiency gap in current workflow.",
    "Predictive modeling suggests upward trend in user engagement.",
    "Recommendation: Automate repetitive data entry tasks."
  ] 
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const getHeaderIcon = () => {
    const t = title.toLowerCase();
    if (t.includes('trend') || t.includes('growth')) return <TrendingUp className="w-5 h-5 text-blue-500" />;
    if (t.includes('idea') || t.includes('insight')) return <Lightbulb className="w-5 h-5 text-amber-500" />;
    if (t.includes('brain') || t.includes('logic')) return <BrainCircuit className="w-5 h-5 text-purple-500" />;
    return <Sparkles className="w-5 h-5 text-indigo-500" />;
  };

  return (
    <div className="relative group max-w-md w-full p-6">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200 animate-gradient-xy"></div>

      <div className="relative glass-card rounded-2xl p-6 overflow-hidden">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl shadow-inner border border-slate-200 dark:border-slate-700">
            {getHeaderIcon()}
          </div>
          <div>
            <h3 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              {title}
            </h3>
            <div className="h-1 w-12 bg-indigo-500 rounded-full mt-1 transform origin-left transition-transform group-hover:scale-x-150"></div>
          </div>
        </div>

        <ul className="space-y-4">
          {insights.map((item, idx) => (
            <li 
              key={idx}
              className={`flex gap-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed transition-all duration-700 transform ${
                isVisible ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'
              }`}
              style={{ transitionDelay: `${idx * 150}ms` }}
            >
              <div className="flex-shrink-0 mt-1">
                <div className="w-5 h-5 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center border border-indigo-100 dark:border-indigo-800">
                  <ChevronRight className="w-3 h-3 text-indigo-500" />
                </div>
              </div>
              <span className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors cursor-default">
                {item}
              </span>
            </li>
          ))}
        </ul>

        <button className="mt-8 w-full py-3 px-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-indigo-600 dark:hover:bg-indigo-50 transition-all active:scale-95 shadow-lg">
          <span>Explore Deeper Analysis</span>
          <Sparkles className="w-4 h-4" />
        </button>
      </div>

      <style>{`
        @keyframes gradient-xy {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-xy {
          background-size: 200% 200%;
          animation: gradient-xy 5s ease infinite;
        }
      `}</style>
    </div>
  );
};

export default AIInsightsCard;
