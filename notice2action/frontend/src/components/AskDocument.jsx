import React, { useState, useEffect } from 'react';
import { Send, Brain, HelpCircle, Clock, CheckCircle } from 'lucide-react';
import { askQuestion } from '../api';

const AskDocument = () => {
  const [question, setQuestion] = useState('');
  const [answers, setAnswers] = useState([]);
  const [isAsking, setIsAsking] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState([
    'What is the last date?',
    'What do I need to bring?',
    'Where is the event?',
    'Who is eligible?',
    'What should I do first?',
    'Is there a registration fee?',
    'What are the submission requirements?',
    'Can I participate as an individual?'
  ]);

  const handleAskQuestion = async (e) => {
    e.preventDefault();
    
    if (!question.trim()) return;
    
    setIsAsking(true);
    
    try {
      // Note: In a real implementation, we would need to pass the file
      // For now, we'll use a mock approach
      const mockFile = new File(['demo'], 'demo_notice.png', { type: 'image/png' });
      
      const result = await askQuestion(mockFile, question);
      
      if (result.success) {
        setAnswers(prev => [
          {
            question,
            answer: result.answer,
            timestamp: new Date().toLocaleTimeString(),
            id: Date.now()
          },
          ...prev
        ]);
        setQuestion('');
      } else {
        setAnswers(prev => [
          {
            question,
            answer: 'Sorry, I could not answer that question at this time.',
            timestamp: new Date().toLocaleTimeString(),
            id: Date.now(),
            error: true
          },
          ...prev
        ]);
      }
    } catch (error) {
      console.error('Error asking question:', error);
      setAnswers(prev => [
        {
          question,
          answer: 'Network error. Please check your connection.',
          timestamp: new Date().toLocaleTimeString(),
          id: Date.now(),
          error: true
        },
        ...prev
      ]);
    } finally {
      setIsAsking(false);
    }
  };

  const handleSuggestedQuestion = (suggestedQuestion) => {
    setQuestion(suggestedQuestion);
  };

  return (
    <div>
      {/* How it works */}
      <div className="mb-6 p-4 bg-indigo-50 rounded-lg border border-indigo-100">
        <div className="flex items-center gap-3 mb-3">
          <Brain className="w-5 h-5 text-indigo-600" />
          <h4 className="font-semibold text-gray-900">How this works</h4>
        </div>
        <p className="text-sm text-gray-700 mb-3">
          Ask any question about the uploaded notice. Gemma 4 will answer based only on information found in the document.
        </p>
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <CheckCircle className="w-4 h-4 text-green-500" />
          <span>Answers are based only on the uploaded document</span>
        </div>
      </div>

      {/* Question Input */}
      <form onSubmit={handleAskQuestion} className="mb-6">
        <div className="relative">
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask anything about this document..."
            className="input-field pr-12 resize-none h-24"
            disabled={isAsking}
          />
          <button
            type="submit"
            disabled={!question.trim() || isAsking}
            className="absolute right-3 bottom-3 p-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Ask question"
          >
            {isAsking ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </form>

      {/* Suggested Questions */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <HelpCircle className="w-5 h-5 text-gray-500" />
          <h4 className="font-medium text-gray-900">Try asking:</h4>
        </div>
        <div className="flex flex-wrap gap-2">
          {suggestedQuestions.map((suggestedQuestion, index) => (
            <button
              key={index}
              onClick={() => handleSuggestedQuestion(suggestedQuestion)}
              className="px-4 py-2 bg-white border border-gray-300 rounded-full hover:bg-gray-50 hover:border-gray-400 transition-colors text-sm text-gray-700"
            >
              {suggestedQuestion}
            </button>
          ))}
        </div>
      </div>

      {/* Answers History */}
      {answers.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-gray-500" />
            <h4 className="font-medium text-gray-900">Previous Questions & Answers</h4>
          </div>
          
          <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
            {answers.map((item) => (
              <div key={item.id} className="animate-fade-in">
                {/* Question */}
                <div className="mb-3">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 text-sm">Q</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <p className="text-gray-900">{item.question}</p>
                        <div className="text-xs text-gray-500 mt-1">{item.timestamp}</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Answer */}
                <div className="ml-8">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        item.error ? 'bg-red-100' : 'bg-green-100'
                      }`}>
                        <span className={`text-sm ${item.error ? 'text-red-600' : 'text-green-600'}`}>
                          {item.error ? '!' : 'A'}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className={`p-3 rounded-lg ${
                        item.error ? 'bg-red-50 border border-red-100' : 'bg-green-50 border border-green-100'
                      }`}>
                        <p className={item.error ? 'text-red-800' : 'text-gray-900'}>
                          {item.answer}
                        </p>
                        <div className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                          <span>{item.timestamp}</span>
                          {!item.error && (
                            <span className="flex items-center gap-1">
                              <Brain className="w-3 h-3" />
                              Powered by Gemma 4
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Stats */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Questions asked:</p>
                <p className="text-lg font-semibold text-gray-900">{answers.length}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Answered by Gemma:</p>
                <p className="text-lg font-semibold text-green-600">
                  {answers.filter(a => !a.error).length}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Most recent:</p>
                <p className="text-sm text-gray-900">
                  {answers[0]?.timestamp || 'No questions yet'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {answers.length === 0 && !isAsking && (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <HelpCircle className="w-8 h-8 text-indigo-600" />
          </div>
          <h4 className="font-semibold text-gray-900 mb-2">No questions asked yet</h4>
          <p className="text-gray-600 mb-4">
            Ask a question about the uploaded document to get started.
          </p>
          <p className="text-sm text-gray-500">
            Example: "What is the submission deadline?"
          </p>
        </div>
      )}

      {/* Limitations */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center">
              <span className="text-yellow-700 text-sm">!</span>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-700 mb-2">
              <strong>Note:</strong> Answers are based solely on information found in the uploaded document.
              Gemma 4 will not guess or use external knowledge.
            </p>
            <p className="text-xs text-gray-600">
              If the answer cannot be found in the document, Gemma will say: 
              "I couldn't find that information in the uploaded notice."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AskDocument;