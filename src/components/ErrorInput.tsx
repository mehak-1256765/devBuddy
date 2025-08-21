import React, { useState } from 'react';
import { Send, X, AlertTriangle, Loader } from 'lucide-react';

interface ErrorInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (error: string) => void;
  isAnalyzing: boolean;
  onClear: () => void;
}

const ErrorInput: React.FC<ErrorInputProps> = ({
  value,
  onChange,
  onSubmit,
  isAnalyzing,
  onClear
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim() && !isAnalyzing) {
      onSubmit(value.trim());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleSubmit(e);
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="relative">
        <div className={`relative bg-white/10 backdrop-blur-md rounded-2xl p-6 transition-all duration-300 ${
          isFocused ? 'ring-2 ring-yellow-400/50 scale-[1.02]' : ''
        }`}>
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="w-6 h-6 text-yellow-400" />
            <h2 className="text-xl font-semibold text-white">Paste Your Error Here</h2>
          </div>
          
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyPress}
            placeholder="Paste your error message, stack trace, or code issue here...

Examples:
• TypeError: Cannot read property 'map' of undefined
• SyntaxError: Unexpected token '}' 
• ReferenceError: myVariable is not defined
• 404 Not Found
• And more!"
            className="w-full h-48 bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-white/40 resize-none focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-transparent transition-all duration-200"
            disabled={isAnalyzing}
          />

          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-white/60">
              {value.length > 0 && (
                <span>{value.length} characters • Press Ctrl+Enter to submit</span>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              {value.length > 0 && (
                <button
                  type="button"
                  onClick={onClear}
                  disabled={isAnalyzing}
                  className="flex items-center gap-2 px-4 py-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200 disabled:opacity-50"
                >
                  <X className="w-4 h-4" />
                  Clear
                </button>
              )}
              
              <button
                type="submit"
                disabled={!value.trim() || isAnalyzing}
                className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-medium rounded-lg hover:from-yellow-500 hover:to-orange-600 transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isAnalyzing ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Fix This!
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ErrorInput;