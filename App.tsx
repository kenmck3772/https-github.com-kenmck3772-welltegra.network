
import React, { useState, useCallback } from 'react';
import { REVIEW_ASPECTS_CONFIG, SUPPORTED_LANGUAGES } from './constants';
import { generateCodeReview } from './services/geminiService';
import { ReviewAspect, ReviewRequest, ReviewResult, Language } from './types';

// --- Helper Components ---

const LoadingSpinner: React.FC = () => (
  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

const AspectCard: React.FC<{
  aspect: ReviewAspect;
  selectedAspect: ReviewAspect | null;
  onSelect: (aspect: ReviewAspect) => void;
}> = ({ aspect, selectedAspect, onSelect }) => {
  const config = REVIEW_ASPECTS_CONFIG[aspect];
  const isSelected = selectedAspect === aspect;

  return (
    <div
      onClick={() => onSelect(aspect)}
      className={`p-6 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
        isSelected
          ? 'bg-slate-700 border-teal-400 shadow-lg shadow-teal-500/10'
          : 'bg-slate-800 border-slate-700 hover:border-slate-600 hover:bg-slate-700/50'
      }`}
    >
      <div className="flex items-center space-x-4">
        <div className={`p-2 rounded-full ${isSelected ? 'bg-teal-500/20' : 'bg-slate-700'}`}>
           <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${isSelected ? 'text-teal-400' : 'text-slate-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={config.icon} />
          </svg>
        </div>
        <div>
          <h3 className={`text-lg font-bold ${isSelected ? 'text-white' : 'text-slate-200'}`}>{config.name}</h3>
          <p className="text-sm text-slate-400">{config.description}</p>
        </div>
      </div>
    </div>
  );
};


// --- Main Application Component ---

const App: React.FC = () => {
  const [code, setCode] = useState<string>('');
  const [language, setLanguage] = useState<string>(SUPPORTED_LANGUAGES[0].id);
  const [selectedAspect, setSelectedAspect] = useState<ReviewAspect | null>(null);
  const [reviewResult, setReviewResult] = useState<ReviewResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleReviewRequest = useCallback(async () => {
    if (!code.trim() || !selectedAspect) {
      setError("Please provide code and select a review aspect.");
      return;
    }
    
    // Check for API Key
    if (!process.env.API_KEY) {
        setError("API_KEY environment variable not set. Please configure it to use the tool.");
        setIsLoading(false);
        return;
    }

    setIsLoading(true);
    setError(null);
    setReviewResult(null);

    const request: ReviewRequest = {
      code,
      language,
      aspect: selectedAspect,
    };

    try {
      // In a real application, you would call the service:
      const result = await generateCodeReview(request);
      setReviewResult(result);
    } catch (e: any) {
      setError(e.message || "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  }, [code, language, selectedAspect]);

  const canSubmit = !isLoading && !!code.trim() && !!selectedAspect;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <header className="text-center mb-10">
          <h1 className="text-5xl font-extrabold gradient-text">
            AI Code Reviewer
          </h1>
          <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">
            Leverage the power of Gemini to analyze your code, identify issues, and get actionable feedback instantly.
          </p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Input Section */}
          <div className="flex flex-col space-y-6">
            <div>
              <label htmlFor="language-select" className="block text-sm font-medium text-slate-300 mb-2">
                1. Select Language
              </label>
              <select
                id="language-select"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-md p-3 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              >
                {SUPPORTED_LANGUAGES.map((lang: Language) => (
                  <option key={lang.id} value={lang.id}>{lang.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="code-input" className="block text-sm font-medium text-slate-300 mb-2">
                2. Paste Your Code
              </label>
              <textarea
                id="code-input"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter your code snippet here..."
                className="w-full h-80 font-mono text-sm bg-slate-950 border border-slate-700 rounded-md p-4 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 resize-y"
              />
            </div>

            <div>
              <h2 className="text-sm font-medium text-slate-300 mb-2">3. Choose Review Aspect</h2>
              <div className="space-y-4">
                {(Object.keys(REVIEW_ASPECTS_CONFIG) as ReviewAspect[]).map((aspect) => (
                  <AspectCard
                    key={aspect}
                    aspect={aspect}
                    selectedAspect={selectedAspect}
                    onSelect={setSelectedAspect}
                  />
                ))}
              </div>
            </div>

            <button
              onClick={handleReviewRequest}
              disabled={!canSubmit}
              className="w-full flex items-center justify-center bg-teal-600 text-white font-bold py-3 px-4 rounded-md transition-colors duration-200 enabled:hover:bg-teal-500 disabled:bg-slate-600 disabled:cursor-not-allowed"
            >
              {isLoading && <LoadingSpinner />}
              {isLoading ? 'Analyzing...' : 'Review My Code'}
            </button>
          </div>
          
          {/* Output Section */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 min-h-[500px] flex flex-col">
            <h2 className="text-2xl font-bold mb-4 border-b border-slate-700 pb-3">Review Feedback</h2>
            
            {isLoading && (
              <div className="flex-grow flex flex-col items-center justify-center text-center">
                  <LoadingSpinner />
                  <p className="mt-4 text-slate-400">Gemini is analyzing your code...</p>
                  <p className="text-sm text-slate-500">This may take a moment.</p>
              </div>
            )}

            {error && (
              <div className="flex-grow flex flex-col items-center justify-center text-center bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="mt-4 text-lg font-semibold text-red-300">An Error Occurred</h3>
                <p className="mt-2 text-sm text-red-400">{error}</p>
              </div>
            )}

            {!isLoading && !error && !reviewResult && (
              <div className="flex-grow flex items-center justify-center text-center">
                <p className="text-slate-500">Your code review results will appear here.</p>
              </div>
            )}
            
            {reviewResult && (
              <div className="flex-grow overflow-y-auto pr-2">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-teal-400 mb-2">Summary</h3>
                  <p className="text-slate-300 bg-slate-900/50 p-4 rounded-md">{reviewResult.summary}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-teal-400 mb-3">Suggestions</h3>
                  <div className="space-y-4">
                    {reviewResult.suggestions.length > 0 ? reviewResult.suggestions.map((item, index) => (
                      <div key={index} className="bg-slate-900/50 p-4 rounded-lg border-l-4 border-slate-600">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-semibold text-slate-100">{item.suggestion}</p>
                          {item.line > 0 && (
                             <span className="font-mono text-xs bg-slate-700 text-teal-300 px-2 py-1 rounded">Line: {item.line}</span>
                          )}
                        </div>
                        <p className="text-sm text-slate-400">{item.explanation}</p>
                      </div>
                    )) : <p className="text-slate-400">No specific suggestions found. The code looks good for the selected aspect!</p>}
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
