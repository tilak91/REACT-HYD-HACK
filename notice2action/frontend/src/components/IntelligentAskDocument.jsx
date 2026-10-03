import React, { useState } from 'react';
import { Send, Brain, HelpCircle, CheckCircle, ArrowRight, Clock, AlertTriangle, Sparkles } from 'lucide-react';
import { askIntelligentQuestion } from '../api';

// Offline fallback responses for when backend is unavailable
const generateOfflineAnswer = (question, context) => {
  const q = question.toLowerCase();
  const dates = context?.important_dates || [];
  const items = context?.required_items || [];
  const plan = context?.action_plan || [];
  const location = context?.location || '';

  if (q.includes('last date') || q.includes('deadline') || q.includes('when')) {
    const lastDate = dates[dates.length - 1];
    return {
      answer: lastDate
        ? `The last date is ${lastDate.date} for "${lastDate.event}".`
        : 'No specific deadline found in the notice.',
      what_to_do: plan.slice(0, 2).map(s => s.action),
      next_action: plan[0]?.action || 'Review the action plan above.',
      source_based: true
    };
  }
  if (q.includes('bring') || q.includes('need') || q.includes('submit') || q.includes('item')) {
    return {
      answer: items.length > 0
        ? `You need to bring: ${items.join(', ')}.`
        : 'No specific items mentioned in the notice.',
      what_to_do: items.map(i => `Prepare: ${i}`),
      next_action: 'Gather all required items well in advance.',
      source_based: true
    };
  }
  if (q.includes('where') || q.includes('location') || q.includes('venue')) {
    return {
      answer: location || 'No specific location mentioned in the notice.',
      what_to_do: location ? [`Go to: ${location}`, 'Arrive early'] : [],
      next_action: location ? `Make your way to ${location} on time.` : 'Check the original notice for location details.',
      source_based: true
    };
  }
  if (q.includes('first') || q.includes('start')) {
    const first = plan[0];
    return {
      answer: first ? `The first step is: ${first.action}` : 'Review the action plan for first steps.',
      what_to_do: plan.slice(0, 3).map(s => s.action),
      next_action: first?.action || 'Start with step 1 of your action plan.',
      source_based: true
    };
  }
  return {
    answer: 'Based on the notice, please refer to the structured analysis above for details.',
    what_to_do: plan.slice(0, 2).map(s => s.action),
    next_action: 'Review the action plan in the dashboard above.',
    source_based: false
  };
};

const IntelligentAskDocument = ({ gemmaContext }) => {
  const [question, setQuestion] = useState('');
  const [responses, setResponses] = useState([]);
  const [isAsking, setIsAsking] = useState(false);
  const [offlineMode, setOfflineMode] = useState(false);

  const suggestedQuestions = [
    'What is the last date?',
    'What should I do first?',
    'What do I need to submit?',
    'Where is the venue?',
    'What do I need to bring?',
    'What happens if I miss the deadline?',
  ];

  const handleAskQuestion = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    setIsAsking(true);
    const askedQuestion = question;
    setQuestion('');

    try {
      let responseData;

      if (offlineMode) {
        // Use local logic
        await new Promise(r => setTimeout(r, 600)); // brief delay for UX
        responseData = generateOfflineAnswer(askedQuestion, gemmaContext);
      } else {
        const result = await askIntelligentQuestion(askedQuestion, gemmaContext);
        if (result.success) {
          responseData = result.response;
        } else {
          responseData = generateOfflineAnswer(askedQuestion, gemmaContext);
          setOfflineMode(true);
        }
      }

      setResponses(prev => [
        {
          question: askedQuestion,
          response: responseData,
          timestamp: new Date().toLocaleTimeString(),
          id: Date.now(),
          offline: offlineMode || false
        },
        ...prev
      ]);
    } catch (error) {
      // Network error → switch to offline mode silently
      setOfflineMode(true);
      const fallback = generateOfflineAnswer(askedQuestion, gemmaContext);
      setResponses(prev => [
        {
          question: askedQuestion,
          response: fallback,
          timestamp: new Date().toLocaleTimeString(),
          id: Date.now(),
          offline: true
        },
        ...prev
      ]);
    } finally {
      setIsAsking(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (question.trim() && !isAsking) {
        handleAskQuestion(e);
      }
    }
  };

  return (
    <div>
      {/* Status hint */}
      {offlineMode && (
        <div className="mb-4 px-4 py-3 rounded-xl flex items-center gap-2 animate-slide-down text-sm"
          style={{ background: 'rgba(234,179,8,0.08)', border: '1px solid rgba(234,179,8,0.2)' }}>
          <span className="text-yellow-400">⚡</span>
          <span className="text-yellow-400/80">Using local analysis (backend unavailable). Answers are based on the notice data.</span>
        </div>
      )}

      {/* Question Input */}
      <form onSubmit={handleAskQuestion} className="mb-6">
        <div className="relative">
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask something like: What should I do first? (Enter to send)"
            className="input-field pr-14 resize-none"
            style={{ height: '88px', paddingTop: '14px' }}
            disabled={isAsking}
          />
          <button
            type="submit"
            disabled={!question.trim() || isAsking}
            className="absolute right-3 bottom-3 w-9 h-9 flex items-center justify-center rounded-xl transition-all disabled:opacity-40"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)', boxShadow: '0 3px 12px rgba(59,130,246,0.4)' }}
            aria-label="Ask question"
          >
            {isAsking
              ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              : <Send className="w-4 h-4 text-white" />
            }
          </button>
        </div>

        {isAsking && (
          <div className="mt-3 px-4 py-3 rounded-xl flex items-center gap-3 animate-slide-down"
            style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)' }}>
            <div className="w-5 h-5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin flex-shrink-0" />
            <div>
              <p className="text-indigo-300 font-medium text-sm">Finding the relevant information…</p>
              <p className="text-indigo-400/60 text-xs">Preparing a useful answer based on the notice</p>
            </div>
          </div>
        )}
      </form>

      {/* Suggested Questions */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-slate-500" />
          <span className="text-slate-500 text-sm font-medium">Try asking:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {suggestedQuestions.map((sq, i) => (
            <button
              key={i}
              onClick={() => setQuestion(sq)}
              disabled={isAsking}
              className="suggestion-chip"
            >
              {sq}
            </button>
          ))}
        </div>
      </div>

      {/* Responses */}
      {responses.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-4 h-4 text-slate-600" />
            <span className="text-slate-500 text-sm font-medium">Conversation</span>
          </div>

          {responses.map((item) => (
            <div key={item.id} className="animate-fade-in">
              {/* Question */}
              <div className="flex justify-end mb-3">
                <div className="max-w-xs">
                  <div className="question-bubble">
                    <p className="text-slate-200 text-sm">{item.question}</p>
                    <p className="text-blue-400/50 text-xs mt-1">{item.timestamp}</p>
                  </div>
                </div>
              </div>

              {/* Answer */}
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.3), rgba(99,102,241,0.3))' }}>
                  <Brain className="w-4 h-4 text-green-300" />
                </div>
                <div className="flex-1">
                  <div className="answer-bubble">
                    {/* Main Answer */}
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-2 h-2 bg-green-400 rounded-full" />
                        <span className="text-green-400 text-xs font-semibold uppercase tracking-wide">Answer</span>
                        {item.offline && (
                          <span className="tag-yellow" style={{ fontSize: '0.65rem', padding: '2px 8px' }}>Local</span>
                        )}
                        {item.response.source_based && !item.offline && (
                          <span className="tag-green" style={{ fontSize: '0.65rem', padding: '2px 8px' }}>From Notice</span>
                        )}
                      </div>
                      <p className="text-slate-200 text-sm leading-relaxed">{item.response.answer}</p>
                    </div>

                    {/* What this means */}
                    {item.response.meaning && (
                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="w-2 h-2 bg-blue-400 rounded-full" />
                          <span className="text-blue-400 text-xs font-semibold uppercase tracking-wide">What this means</span>
                        </div>
                        <p className="text-slate-400 text-sm">{item.response.meaning}</p>
                      </div>
                    )}

                    {/* What to do */}
                    {item.response.what_to_do && item.response.what_to_do.length > 0 && (
                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="w-3.5 h-3.5 text-green-400" />
                          <span className="text-green-400 text-xs font-semibold uppercase tracking-wide">What to do</span>
                        </div>
                        <ul className="space-y-1.5">
                          {item.response.what_to_do.map((step, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                              <span className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                                style={{ background: 'rgba(16,185,129,0.15)', color: '#6ee7b7', border: '1px solid rgba(16,185,129,0.2)' }}>
                                {idx + 1}
                              </span>
                              {step}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* How to do */}
                    {item.response.how_to_do && item.response.how_to_do.length > 0 && (
                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Brain className="w-3.5 h-3.5 text-purple-400" />
                          <span className="text-purple-400 text-xs font-semibold uppercase tracking-wide">How to do it</span>
                        </div>
                        <ul className="space-y-1.5">
                          {item.response.how_to_do.map((how, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-slate-400">
                              <ArrowRight className="w-3.5 h-3.5 text-purple-400 mt-0.5 flex-shrink-0" />
                              {how}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Important info */}
                    {item.response.important_information && item.response.important_information.length > 0 && (
                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertTriangle className="w-3.5 h-3.5 text-yellow-400" />
                          <span className="text-yellow-400 text-xs font-semibold uppercase tracking-wide">Important</span>
                        </div>
                        <ul className="space-y-1.5">
                          {item.response.important_information.map((info, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-slate-400">
                              <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 mt-1.5 flex-shrink-0" />
                              {info}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Next action */}
                    {item.response.next_action && (
                      <div className="p-3 rounded-xl flex items-start gap-2"
                        style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.15)' }}>
                        <ArrowRight className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-blue-300 text-xs font-semibold uppercase tracking-wide mb-0.5">Your Next Action</p>
                          <p className="text-blue-200 text-sm">{item.response.next_action}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {responses.length === 0 && !isAsking && (
        <div className="text-center py-12 rounded-2xl"
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.2)' }}>
            <HelpCircle className="w-7 h-7 text-indigo-400" />
          </div>
          <h4 className="font-semibold text-slate-300 mb-1">Ready to help you understand</h4>
          <p className="text-slate-500 text-sm max-w-xs mx-auto">
            Ask any question about the notice and get intelligent, actionable answers.
          </p>
        </div>
      )}
    </div>
  );
};

export default IntelligentAskDocument;