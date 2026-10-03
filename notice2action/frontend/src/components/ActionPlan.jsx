import React, { useState } from 'react';
import { CheckCircle } from 'lucide-react';

const ActionPlan = ({ plan }) => {
  const [completed, setCompleted] = useState({});

  if (!plan || plan.length === 0) {
    return (
      <div className="text-center py-8">
        <CheckCircle className="w-10 h-10 text-slate-600 mx-auto mb-2" />
        <p className="text-slate-500 text-sm">No action plan generated</p>
      </div>
    );
  }

  const toggleComplete = (index) => {
    setCompleted(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const completedCount = Object.values(completed).filter(Boolean).length;

  return (
    <div>
      {/* Progress bar */}
      <div className="mb-5">
        <div className="flex justify-between items-center mb-2">
          <span className="text-slate-400 text-sm">Progress</span>
          <span className="text-green-400 text-sm font-semibold">{completedCount}/{plan.length} done</span>
        </div>
        <div className="h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${(completedCount / plan.length) * 100}%`,
              background: 'linear-gradient(90deg, #10b981, #059669)',
              boxShadow: completedCount > 0 ? '0 0 10px rgba(16,185,129,0.4)' : 'none'
            }}
          />
        </div>
      </div>

      <div className="space-y-3">
        {plan.map((step, index) => (
          <div
            key={index}
            className={`action-step cursor-pointer select-none ${completed[index] ? 'opacity-60' : ''}`}
            onClick={() => toggleComplete(index)}
            style={{
              background: completed[index]
                ? 'rgba(16,185,129,0.12)'
                : 'rgba(16,185,129,0.04)',
              borderColor: completed[index]
                ? 'rgba(16,185,129,0.35)'
                : 'rgba(16,185,129,0.1)'
            }}
          >
            <div className={`step-number transition-all ${completed[index] ? 'opacity-50' : ''}`}>
              {completed[index] ? '✓' : step.step}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium ${completed[index] ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                {step.action}
              </p>
              {step.deadline && (
                <p className="text-xs text-green-400 mt-1">
                  📅 By {step.deadline}
                </p>
              )}
            </div>
            <div className={`w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center border transition-all ${
              completed[index]
                ? 'bg-green-500 border-green-500'
                : 'border-slate-600 bg-transparent'
            }`}>
              {completed[index] && <span className="text-white text-xs">✓</span>}
            </div>
          </div>
        ))}
      </div>

      {completedCount === plan.length && plan.length > 0 && (
        <div className="mt-4 p-4 rounded-xl text-center animate-fade-in"
          style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)' }}>
          <p className="text-green-400 font-semibold">🎉 All steps completed!</p>
          <p className="text-green-500/70 text-sm mt-1">You're all set. Good luck!</p>
        </div>
      )}
    </div>
  );
};

export default ActionPlan;