import React from 'react';
import { Brain, Zap } from 'lucide-react';

const LoadingState = ({ isDemo }) => {
  const steps = [
    { icon: '🔍', title: isDemo ? 'Loading demo data...' : 'Reading your notice...', desc: 'Gemma 4 is visually analyzing the document' },
    { icon: '📅', title: 'Finding important dates...', desc: 'Extracting deadlines and timelines' },
    { icon: '📍', title: 'Identifying locations...', desc: 'Finding venue and location information' },
    { icon: '👥', title: 'Checking eligibility...', desc: 'Analyzing who can participate' },
    { icon: '✅', title: 'Building your action plan...', desc: 'Creating step-by-step instructions' },
    { icon: '✨', title: 'Finalizing analysis...', desc: 'Preparing your results dashboard' },
  ];

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="card text-center" style={{ background: 'rgba(255,255,255,0.03)' }}>
        {/* Orb */}
        <div className="loading-orb mb-8">
          <div className="loading-orb-ring" />
          <div className="loading-orb-inner">
            <Brain className="w-8 h-8 text-white animate-pulse" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-slate-200 mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
          {isDemo ? 'Loading Demo Analysis' : 'Gemma 4 is analyzing your notice'}
        </h2>
        <p className="text-slate-500 mb-8">
          {isDemo
            ? 'Preparing sample notice data for demonstration...'
            : 'Using multimodal AI to understand the visual document...'}
        </p>

        {/* Progress */}
        <div className="mb-10">
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <div className="h-full rounded-full animate-progress"
              style={{ background: 'linear-gradient(90deg, #3b82f6, #8b5cf6, #10b981)', width: '60%' }} />
          </div>
          <p className="text-slate-600 text-sm mt-3">This may take a moment…</p>
        </div>

        {/* Steps grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {steps.map((step, i) => (
            <div
              key={i}
              className="p-4 rounded-xl text-left animate-pulse"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                animationDelay: `${i * 0.2}s`,
                animationDuration: `${1.5 + i * 0.1}s`
              }}
            >
              <div className="text-xl mb-2">{step.icon}</div>
              <p className="text-slate-300 text-sm font-medium">{step.title}</p>
              <p className="text-slate-600 text-xs mt-1">{step.desc}</p>
            </div>
          ))}
        </div>

        {/* Attribution */}
        <div className="mt-8 p-4 rounded-xl flex items-center justify-center gap-2"
          style={{ background: 'rgba(59,130,246,0.07)', border: '1px solid rgba(59,130,246,0.15)' }}>
          <Zap className="w-4 h-4 text-blue-400" />
          <p className="text-blue-400/80 text-sm">
            <strong className="text-blue-300">Two-Stage AI:</strong>{' '}
            Gemma 4 for visual understanding, Groq for actionable intelligence
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoadingState;