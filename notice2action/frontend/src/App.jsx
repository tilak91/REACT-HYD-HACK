import React, { useState, useEffect } from 'react';
import UploadPanel from './components/UploadPanel';
import LoadingState from './components/LoadingState';
import AnalysisDashboard from './components/AnalysisDashboard';
import { analyzeImage } from './api';

// Local demo data — no backend needed
const DEMO_DATA = {
  notice_title: "College Project Presentation Notice",
  summary: "This notice contains the submission deadline, presentation date, venue and required materials for final-year project students.",
  important_dates: [
    { event: "Registration", date: "October 10, 2026", time: "Before 5:00 PM" },
    { event: "Project Submission", date: "October 12, 2026", time: "11:59 PM" },
    { event: "Final Presentation", date: "October 15, 2026", time: "10:00 AM" }
  ],
  location: "Seminar Hall, Block B",
  eligibility: ["B.Tech final-year students", "Registered project groups only"],
  required_items: ["Project report (printed & soft copy)", "Presentation slides (PDF)", "College ID card"],
  important_points: [
    "Registration must be completed before submission",
    "Projects must follow official college guidelines",
    "All group members must be present during presentation"
  ],
  warnings: [
    "Late submissions will NOT be accepted under any circumstances",
    "Only registered groups can present"
  ],
  action_plan: [
    { step: 1, action: "Register your project group via the college portal", deadline: "October 10, 2026" },
    { step: 2, action: "Complete and format your project report", deadline: "October 12, 2026" },
    { step: 3, action: "Prepare your final presentation slides", deadline: "October 12, 2026" },
    { step: 4, action: "Submit the report (hard + soft copy) by the deadline", deadline: "October 12, 2026" },
    { step: 5, action: "Attend and present on the presentation day with your ID", deadline: "October 15, 2026" }
  ],
  confidence: "High"
};

function App() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);
  const [isDemo, setIsDemo] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const handleFileUpload = async (uploadedFile) => {
    setFile(uploadedFile);
    setIsAnalyzing(true);
    setError(null);
    setIsDemo(false);
    setShowResult(false);

    try {
      const result = await analyzeImage(uploadedFile);

      if (result.success) {
        setAnalysisResult(result.analysis);
        setTimeout(() => setShowResult(true), 100);
      } else {
        setError(result.error || 'Analysis failed. Please try again.');
      }
    } catch (err) {
      setError('Backend is not running. Please start the backend server or try the Demo mode.');
      console.error('Analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Demo uses local data — NO network call needed
  const handleDemoClick = () => {
    setIsAnalyzing(true);
    setError(null);
    setIsDemo(true);
    setShowResult(false);
    setFile(null);
    setPreview(null);

    // Simulate a brief loading animation for UX
    setTimeout(() => {
      setAnalysisResult(DEMO_DATA);
      setIsAnalyzing(false);
      setTimeout(() => setShowResult(true), 100);
    }, 2200);
  };

  const handleReset = () => {
    setShowResult(false);
    setTimeout(() => {
      setFile(null);
      setPreview(null);
      setAnalysisResult(null);
      setError(null);
      setIsDemo(false);
    }, 300);
  };

  // Create preview when file changes
  useEffect(() => {
    if (file && !preview) {
      if (file.type === 'application/pdf') {
        setPreview('pdf');
      } else {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreview(e.target.result);
        };
        reader.readAsDataURL(file);
      }
    }
  }, [file, preview]);

  return (
    <div className="min-h-screen app-bg">
      {/* Animated background blobs */}
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />

      <div className="relative z-10">
        {/* Header */}
        <header className="glass-header sticky top-0 z-50">
          <div className="container mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="logo-icon">
                <span className="text-xl">⚡</span>
              </div>
              <div>
                <h1 className="text-xl font-bold gradient-text tracking-tight">NOTICE2ACTION</h1>
                <p className="text-xs text-slate-400 leading-none">AI-Powered Document Intelligence</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {analysisResult && (
                <button
                  onClick={handleReset}
                  className="btn-ghost text-sm flex items-center gap-2"
                >
                  <span>←</span> New Analysis
                </button>
              )}
              {isDemo && (
                <span className="demo-badge">🎮 Demo Mode</span>
              )}
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Error Banner */}
          {error && (
            <div className="error-banner animate-slide-down mb-6">
              <div className="flex items-start gap-3">
                <div className="error-icon">⚠</div>
                <div className="flex-1">
                  <p className="font-semibold text-red-200">Analysis Error</p>
                  <p className="text-red-300 text-sm mt-0.5">{error}</p>
                </div>
                <button
                  onClick={() => setError(null)}
                  className="text-red-400 hover:text-red-200 transition-colors text-xl leading-none"
                >
                  ×
                </button>
              </div>
            </div>
          )}

          {/* Content */}
          <div className={`transition-all duration-500 ${showResult ? 'opacity-100 translate-y-0' : ''}`}>
            {isAnalyzing ? (
              <div className="animate-fade-in">
                <LoadingState isDemo={isDemo} />
              </div>
            ) : analysisResult ? (
              <div className={`transition-all duration-500 ${showResult ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <AnalysisDashboard
                  analysis={analysisResult}
                  isDemo={isDemo}
                  onReset={handleReset}
                />
              </div>
            ) : (
              <div className="animate-fade-in">
                <UploadPanel
                  onFileUpload={handleFileUpload}
                  onDemoClick={handleDemoClick}
                  isAnalyzing={isAnalyzing}
                />
              </div>
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="footer-section mt-16 pb-10">
          <div className="container mx-auto px-6 text-center">
            <p className="text-slate-500 text-sm">
              <span className="gradient-text font-semibold">Notice2Action</span>
              {' '}— Don't just read the notice. Know what to do.
            </p>
            <p className="text-slate-600 text-xs mt-2">
              Powered by{' '}
              <span className="text-blue-400 font-medium">Gemma 4</span> for document understanding
              {' '}+{' '}
              <span className="text-purple-400 font-medium">Groq</span> for intelligent responses
            </p>
            <p className="text-slate-700 text-xs mt-1">
              Built for MLH Hack Day · Two-stage AI: Visual understanding + Actionable guidance
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;