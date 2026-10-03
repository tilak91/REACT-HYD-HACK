import React, { useCallback, useState } from 'react';
import { Upload, FileImage, X, FileText, Sparkles, Zap, Eye } from 'lucide-react';

const UploadPanel = ({ onFileUpload, onDemoClick, isAnalyzing }) => {
  const [dragOver, setDragOver] = useState(false);
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) handleFileSelect(files[0]);
  }, []);

  const handleFileSelect = (selectedFile) => {
    if (!selectedFile) return;

    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'application/pdf'];
    if (!validTypes.includes(selectedFile.type)) {
      alert('Please upload a PNG, JPG, WEBP image or PDF file.');
      return;
    }
    if (selectedFile.size > 10 * 1024 * 1024) {
      alert('File is too large. Maximum size is 10MB.');
      return;
    }

    setFile(selectedFile);

    if (selectedFile.type === 'application/pdf') {
      setPreview('pdf');
    } else {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleFileInput = (e) => handleFileSelect(e.target.files[0]);

  const handleRemoveFile = () => {
    setFile(null);
    setPreview(null);
  };

  const handleAnalyze = () => {
    if (file) onFileUpload(file);
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const features = [
    { icon: '📄', label: 'Upload Notice', desc: 'Any document, circular, poster or announcement' },
    { icon: '🤖', label: 'AI Analysis', desc: 'Gemma 4 visually understands the document' },
    { icon: '📋', label: 'Action Plan', desc: 'Clear step-by-step plan generated instantly' },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-12 animate-fade-in">
        <div className="inline-flex items-center gap-2 mb-5 px-4 py-2 rounded-full"
          style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.25)' }}>
          <Sparkles className="w-4 h-4 text-blue-400" />
          <span className="text-blue-300 text-sm font-medium">Powered by Gemma 4 × Groq</span>
        </div>

        <h1 className="text-5xl font-bold mb-4 leading-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
          <span className="gradient-text">Turn Notices</span>
          <br />
          <span className="text-slate-200">Into Action Plans</span>
        </h1>

        <p className="text-slate-400 text-lg max-w-xl mx-auto leading-relaxed">
          Upload any notice, circular, or document and let our two-stage AI extract deadlines,
          requirements, and build you a clear action plan.
        </p>
      </div>

      {!file ? (
        /* ── Upload Zone ── */
        <div className="animate-fade-in stagger-1">
          <div
            className={`upload-zone ${dragOver ? 'drag-over' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="mb-6 flex justify-center">
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(139,92,246,0.2))', border: '1px solid rgba(99,102,241,0.3)' }}>
                  <FileImage className="w-10 h-10 text-blue-400" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                  style={{ boxShadow: '0 0 10px rgba(16,185,129,0.5)' }}>
                  <span className="text-white text-xs font-bold">+</span>
                </div>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-slate-200 mb-2">
              {dragOver ? '✨ Drop it right here!' : 'Drop your notice here'}
            </h3>
            <p className="text-slate-500 mb-8">or click below to browse files</p>

            <label className="btn-primary cursor-pointer">
              <Upload className="w-5 h-5" />
              Browse File
              <input
                type="file"
                className="hidden"
                accept=".png,.jpg,.jpeg,.webp,.pdf"
                onChange={handleFileInput}
              />
            </label>

            <div className="mt-8 flex items-center justify-center gap-3 flex-wrap">
              {['PNG', 'JPG', 'JPEG', 'WEBP', 'PDF'].map((fmt) => (
                <span key={fmt} className="tag-blue">{fmt}</span>
              ))}
              <span className="text-slate-600 text-sm">• Max 10MB</span>
            </div>
          </div>
        </div>
      ) : (
        /* ── Preview Area ── */
        <div className="card animate-fade-scale card-glow-blue">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-3">
              <div className="section-icon section-icon-blue">
                {file.type === 'application/pdf'
                  ? <FileText className="w-5 h-5 text-blue-400" />
                  : <Eye className="w-5 h-5 text-blue-400" />
                }
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-200">
                  {file.type === 'application/pdf' ? 'PDF Document' : 'Notice Preview'}
                </h3>
                <p className="text-slate-500 text-sm">{file.name} · {formatSize(file.size)}</p>
              </div>
            </div>
            <button
              onClick={handleRemoveFile}
              className="w-9 h-9 rounded-full flex items-center justify-center transition-all"
              style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.2)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}
            >
              <X className="w-4 h-4 text-red-400" />
            </button>
          </div>

          {/* Preview Content */}
          <div className="mb-6">
            {preview === 'pdf' ? (
              <div className="pdf-preview">
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.3), rgba(99,102,241,0.3))' }}>
                  <FileText className="w-10 h-10 text-purple-300" />
                </div>
                <p className="text-slate-300 font-semibold text-lg">{file.name}</p>
                <p className="text-slate-500 text-sm">{formatSize(file.size)} · PDF Document</p>
                <span className="tag-purple mt-1">Ready to analyze</span>
              </div>
            ) : (
              <div className="rounded-xl overflow-hidden flex justify-center"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <img
                  src={preview}
                  alt="Notice preview"
                  className="max-h-96 object-contain"
                  style={{ borderRadius: '12px', padding: '8px' }}
                />
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="btn-primary flex-1 justify-center"
            >
              {isAnalyzing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Analyzing…
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  Analyze with Gemma 4
                </>
              )}
            </button>
            <button onClick={handleRemoveFile} className="btn-secondary">
              Choose Different File
            </button>
          </div>
        </div>
      )}

      {/* Demo Button */}
      <div className="mt-8 text-center animate-fade-in stagger-2">
        <p className="text-slate-500 text-sm mb-4">Don't have a notice? Try the demo:</p>
        <button
          onClick={onDemoClick}
          disabled={isAnalyzing}
          className="btn-secondary"
        >
          <span>🎮</span>
          Try Demo Notice
        </button>
      </div>

      {/* How it works */}
      <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-5 animate-fade-in stagger-3">
        {features.map((f, i) => (
          <div key={i} className="card text-center card-glow-blue" style={{ animationDelay: `${0.1 * (i + 1)}s` }}>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(139,92,246,0.15))', border: '1px solid rgba(99,102,241,0.2)' }}>
              <span className="text-2xl">{f.icon}</span>
            </div>
            <h4 className="font-semibold text-slate-200 mb-1">{f.label}</h4>
            <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UploadPanel;