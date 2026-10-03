import React, { useState } from 'react';
import ImportantDates from './ImportantDates';
import ActionPlan from './ActionPlan';
import RequiredItems from './RequiredItems';
import IntelligentAskDocument from './IntelligentAskDocument';
import {
  Calendar, CheckSquare, Package, MessageSquare,
  MapPin, Users, AlertTriangle, ArrowLeft, Sparkles,
  Info, ChevronDown, ChevronUp
} from 'lucide-react';

const AnalysisDashboard = ({ analysis, isDemo, onReset }) => {
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  const {
    notice_title,
    summary,
    important_dates,
    location,
    eligibility,
    required_items,
    important_points,
    warnings,
    action_plan,
    confidence
  } = analysis;

  const confidenceClass = {
    High: 'confidence-high',
    Medium: 'confidence-medium',
    Low: 'confidence-low'
  }[confidence] || 'tag-blue';

  const sections = [
    { label: 'Important Dates', icon: Calendar, color: 'blue', count: important_dates?.length },
    { label: 'Action Steps', icon: CheckSquare, color: 'green', count: action_plan?.length },
    { label: 'Required Items', icon: Package, color: 'purple', count: required_items?.length },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Demo Banner */}
      {isDemo && (
        <div className="mb-6 px-5 py-4 rounded-2xl flex items-start gap-3 animate-slide-down"
          style={{ background: 'rgba(234,179,8,0.08)', border: '1px solid rgba(234,179,8,0.2)' }}>
          <span className="text-xl flex-shrink-0">🎮</span>
          <div>
            <p className="font-semibold text-yellow-300 text-sm">Demo Mode Active</p>
            <p className="text-yellow-400/70 text-sm mt-0.5">
              Showing sample analysis with pre-loaded data. Upload your own notice to analyze it with AI.
            </p>
          </div>
        </div>
      )}

      {/* ── Header Card ── */}
      <div className="card mb-6 animate-fade-in" style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.08), rgba(139,92,246,0.06))' }}>
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <span className="text-blue-400 text-sm font-medium">Analysis Complete</span>
              </div>
              <span className={confidenceClass}>{confidence} Confidence</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-100 mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
              {notice_title}
            </h2>
            <p className="text-slate-400 leading-relaxed">{summary}</p>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <button onClick={onReset} className="btn-ghost flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              New Analysis
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-5 grid grid-cols-3 gap-3">
          {sections.map((s, i) => (
            <div key={i} className="rounded-xl px-4 py-3 text-center transition-all"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <p className="text-2xl font-bold text-slate-200">{s.count || 0}</p>
              <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Main Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Left: main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Important Dates */}
          <div className="card animate-fade-in stagger-1 card-glow-blue">
            <div className="flex items-center gap-3 mb-5">
              <div className="section-icon section-icon-blue">
                <Calendar className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-200">Important Dates</h3>
                <p className="text-slate-500 text-sm">Deadlines & timelines to track</p>
              </div>
            </div>
            <ImportantDates dates={important_dates} />
          </div>

          {/* Action Plan */}
          <div className="card animate-fade-in stagger-2 card-glow-green">
            <div className="flex items-center gap-3 mb-5">
              <div className="section-icon section-icon-green">
                <CheckSquare className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-200">Your Action Plan</h3>
                <p className="text-slate-500 text-sm">Step-by-step instructions</p>
              </div>
            </div>
            <ActionPlan plan={action_plan} />
          </div>

          {/* Required Items */}
          <div className="card animate-fade-in stagger-3 card-glow-purple">
            <div className="flex items-center gap-3 mb-5">
              <div className="section-icon section-icon-purple">
                <Package className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-200">What You Need</h3>
                <p className="text-slate-500 text-sm">Documents & materials required</p>
              </div>
            </div>
            <RequiredItems items={required_items} />
          </div>
        </div>

        {/* Right: side info */}
        <div className="space-y-5">
          {/* Location */}
          {location && (
            <div className="card animate-fade-in stagger-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="section-icon section-icon-red">
                  <MapPin className="w-5 h-5 text-red-400" />
                </div>
                <h3 className="text-base font-semibold text-slate-200">Location</h3>
              </div>
              <div className="p-4 rounded-xl" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.12)' }}>
                <p className="text-slate-200 font-medium">{location}</p>
              </div>
            </div>
          )}

          {/* Eligibility */}
          {eligibility && eligibility.length > 0 && (
            <div className="card animate-fade-in stagger-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="section-icon section-icon-orange">
                  <Users className="w-5 h-5 text-orange-400" />
                </div>
                <h3 className="text-base font-semibold text-slate-200">Who Can Apply</h3>
              </div>
              <div className="space-y-2">
                {eligibility.map((item, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-xl transition-all"
                    style={{ background: 'rgba(249,115,22,0.06)', border: '1px solid rgba(249,115,22,0.12)' }}>
                    <span className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                      style={{ background: 'rgba(249,115,22,0.2)', color: '#fb923c' }}>✓</span>
                    <p className="text-slate-300 text-sm">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Important Points */}
          {important_points && important_points.length > 0 && (
            <div className="card animate-fade-in stagger-3">
              <div className="flex items-center gap-3 mb-4">
                <div className="section-icon section-icon-teal">
                  <Info className="w-5 h-5 text-teal-400" />
                </div>
                <h3 className="text-base font-semibold text-slate-200">Key Points</h3>
              </div>
              <div className="space-y-2">
                {important_points.map((point, index) => (
                  <div key={index} className="p-3 rounded-xl text-sm text-slate-300 leading-relaxed"
                    style={{ background: 'rgba(20,184,166,0.06)', border: '1px solid rgba(20,184,166,0.12)' }}>
                    {point}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Warnings */}
          {warnings && warnings.length > 0 && (
            <div className="card animate-fade-in stagger-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="section-icon section-icon-red">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                </div>
                <h3 className="text-base font-semibold text-slate-200">Warnings</h3>
              </div>
              <div className="space-y-2">
                {warnings.map((warning, index) => (
                  <div key={index} className="warning-item">
                    <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-red-300 text-sm">{warning}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Ask Document Section ── */}
      <div className="card mb-6 animate-fade-in stagger-4" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.07), rgba(139,92,246,0.05))' }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="section-icon section-icon-indigo">
            <MessageSquare className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-200">Ask This Notice</h3>
            <p className="text-slate-500 text-sm">Get intelligent, actionable answers powered by Gemma 4 + Groq</p>
          </div>
        </div>
        <IntelligentAskDocument gemmaContext={analysis} />
      </div>

      {/* ── How it Works (collapsible) ── */}
      <div className="card animate-fade-in stagger-5" style={{ background: 'rgba(255,255,255,0.02)' }}>
        <button
          className="w-full flex items-center justify-between text-left"
          onClick={() => setShowHowItWorks(!showHowItWorks)}
        >
          <h3 className="text-base font-semibold text-slate-300">How Notice2Action Works</h3>
          {showHowItWorks
            ? <ChevronUp className="w-5 h-5 text-slate-500" />
            : <ChevronDown className="w-5 h-5 text-slate-500" />
          }
        </button>

        {showHowItWorks && (
          <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { icon: '📄', label: 'Upload Notice', desc: 'Any visual document' },
              { icon: '🤖', label: 'Gemma 4 Analysis', desc: 'Multimodal AI reads it' },
              { icon: '🧠', label: 'Extract Facts', desc: 'Dates, requirements, actions' },
              { icon: '❓', label: 'Ask Questions', desc: 'About the content' },
              { icon: '💡', label: 'Smart Answers', desc: 'Groq provides guidance' },
            ].map((step, i) => (
              <div key={i} className="text-center">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mx-auto mb-2"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <span className="text-xl">{step.icon}</span>
                </div>
                <p className="text-slate-300 text-xs font-semibold">{step.label}</p>
                <p className="text-slate-600 text-xs mt-0.5">{step.desc}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalysisDashboard;