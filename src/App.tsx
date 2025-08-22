import React, { useState, useEffect, useRef } from 'react';
import { Send, X, AlertTriangle, Loader, CheckCircle, Copy, ExternalLink, Lightbulb, Code, BookOpen, RotateCcw, FileText, Save, Download, Filter, Search, Star, Mail, Globe, Zap, Palette, Terminal, BarChart2, Package, Hash, Eye } from 'lucide-react';

// Sound effect hook with real audio
const useSound = () => {
  const audioContextRef = useRef<AudioContext | null>(null);
  
  const initAudioContext = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  };
  
  const playSound = (type: 'click' | 'success' | 'typing' | 'generate' | 'error') => {
    try {
      const audioContext = initAudioContext();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Set different frequencies and patterns for each sound type
      switch (type) {
        case 'click':
          oscillator.type = 'sine';
          oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
          gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1);
          oscillator.start();
          oscillator.stop(audioContext.currentTime + 0.1);
          break;
          
        case 'success':
          oscillator.type = 'sine';
          oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
          oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
          oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); // G5
          gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.3);
          oscillator.start();
          oscillator.stop(audioContext.currentTime + 0.3);
          break;
          
        case 'typing':
          oscillator.type = 'sine';
          oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
          gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.05);
          oscillator.start();
          oscillator.stop(audioContext.currentTime + 0.05);
          break;
          
        case 'generate':
          oscillator.type = 'sine';
          oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // A4
          oscillator.frequency.setValueAtTime(554.37, audioContext.currentTime + 0.1); // C#5
          oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.2); // E5
          oscillator.frequency.setValueAtTime(880, audioContext.currentTime + 0.3); // A5
          gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.4);
          oscillator.start();
          oscillator.stop(audioContext.currentTime + 0.4);
          break;
          
        case 'error':
          oscillator.type = 'sawtooth';
          oscillator.frequency.setValueAtTime(220, audioContext.currentTime); // A3
          oscillator.frequency.setValueAtTime(110, audioContext.currentTime + 0.2); // A2
          gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.5);
          oscillator.start();
          oscillator.stop(audioContext.currentTime + 0.5);
          break;
      }
    } catch (err) {
      console.error('Error playing sound:', err);
    }
  };
  
  return { playSound };
};

// Solution interface
interface Solution {
  title: string;
  description: string;
  category: string;
  steps: string[];
  codeExample?: string;
  tips: string[];
  resources: { title: string; url: string }[];
  aiAnalyzed?: boolean;
}

// AI-powered error analysis function (real API version)
const analyzeErrorWithAI = async (errorMessage: string): Promise<Solution> => {
  const query = encodeURIComponent(errorMessage);

  try {
    const res = await fetch(
      `https://api.stackexchange.com/2.3/search/advanced?order=desc&sort=relevance&q=${query}&site=stackoverflow&accepted=True`
    );

    const data = await res.json();

    if (data.items && data.items.length > 0) {
      const top = data.items[0];
      return {
        title: top.title,
        description: `AI + StackOverflow found a related solution.`,
        category: "external",
        steps: [],
        codeExample: "",
        tips: ["Check the accepted answer in the linked thread"],
        resources: [
          { title: "View Solution on StackOverflow", url: top.link }
        ],
        aiAnalyzed: true
      };
    }

    // If no results found
    return {
      title: "No solution found",
      description: "Couldn't fetch a relevant answer from StackOverflow.",
      category: "default",
      steps: ["Try searching with different keywords"],
      tips: ["Check the exact wording of your error"],
      resources: [],
      aiAnalyzed: true
    };
  } catch (err) {
    console.error("Error fetching StackOverflow:", err);
    return {
      title: "API Error",
      description: "Could not connect to StackOverflow API.",
      category: "network",
      steps: ["Check your internet connection", "Try again later"],
      tips: [],
      resources: [],
      aiAnalyzed: true
    };
  }
};

// Error Input Component
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
  const { playSound } = useSound();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim() && !isAnalyzing) {
      playSound('click');
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
        <div className={`relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-2xl p-6 transition-all duration-300 border border-white/10 shadow-lg ${
          isFocused ? 'ring-2 ring-yellow-400/50 scale-[1.02] shadow-yellow-500/20' : ''
        }`}>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-white">Paste Your Error Here</h2>
            <div className="ml-auto flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full text-xs font-medium">
              <Zap className="w-3 h-3" />
              AI-Powered
            </div>
          </div>
          
          <textarea
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
              playSound('typing');
            }}
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
            className="w-full h-48 bg-gradient-to-br from-white/5 to-white/10 border border-white/10 rounded-xl p-4 text-black placeholder-black/40 resize-none focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-transparent transition-all duration-200"
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
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-medium rounded-lg hover:from-yellow-500 hover:to-orange-600 transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg shadow-orange-500/30"
              >
                {isAnalyzing ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Analyzing with AI...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Fix with AI! 🤖
                  </>
                )}
              </button>
            </div>
          </div>
          
          {isAnalyzing && (
            <div className="mt-4 p-3 bg-gradient-to-r from-blue-500/20 to-indigo-600/20 rounded-lg border border-blue-500/30 flex items-center gap-3">
              <Loader className="w-5 h-5 animate-spin text-blue-400" />
              <span className="text-blue-300">AI is analyzing your error... This may take a few seconds.</span>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

// Solution Page Component
interface SolutionPageProps {
  solution: Solution;
  onNewError: () => void;
}

const SolutionPage: React.FC<SolutionPageProps> = ({ solution, onNewError }) => {
  const [copiedStep, setCopiedStep] = useState<number | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const { playSound } = useSound();
  
  const copyToClipboard = async (text: string, type: 'step' | 'code', index?: number) => {
    try {
      await navigator.clipboard.writeText(text);
      playSound('success');
      if (type === 'step' && index !== undefined) {
        setCopiedStep(index);
        setTimeout(() => setCopiedStep(null), 2000);
      } else if (type === 'code') {
        setCopiedCode(true);
        setTimeout(() => setCopiedCode(false), 2000);
      }
    } catch (err) {
      console.error('Failed to copy text: ', err);
      playSound('error');
    }
  };
  
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      syntax: 'from-red-500 to-pink-600',
      runtime: 'from-orange-500 to-red-600', 
      logic: 'from-blue-500 to-indigo-600',
      network: 'from-green-500 to-teal-600',
      dependency: 'from-purple-500 to-blue-600',
      configuration: 'from-yellow-500 to-orange-600',
      'ai-analyzed': 'from-blue-500 to-indigo-600',
      default: 'from-gray-500 to-gray-700'
    };
    return colors[category.toLowerCase()] || colors.default;
  };
  
  return (
    <div className="w-full">
      <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-2xl p-6 transition-all duration-300 border border-white/10 shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
            <CheckCircle className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-white">Solution Found! 🎉</h2>
          {solution.aiAnalyzed && (
            <div className="ml-auto flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full text-xs font-medium">
              <Zap className="w-3 h-3" />
              AI-Analyzed
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
          <h3 className="text-xl font-semibold text-white">{solution.title}</h3>
          <span className={`px-3 py-1 rounded-full text-sm font-medium text-white bg-gradient-to-r ${getCategoryColor(solution.category)} shadow-md`}>
            {solution.category}
          </span>
        </div>
        
        <p className="text-white/80 leading-relaxed mb-6">{solution.description}</p>
        
        {/* Solution steps */}
        <div className="space-y-4 mb-6">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-lg">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <h4 className="text-lg font-semibold text-white">Step-by-Step Solution</h4>
          </div>
          
          <div className="space-y-3">
            {solution.steps.map((step, index) => (
              <div key={index} className="flex items-start gap-4 p-4 bg-gradient-to-br from-white/5 to-white/10 rounded-xl hover:from-white/10 hover:to-white/15 transition-all duration-200 group border border-white/10">
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-md">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="text-white/90">{step}</p>
                </div>
                <button
                  onClick={() => copyToClipboard(step, 'step', index)}
                  className="opacity-0 group-hover:opacity-100 p-2 hover:bg-white/10 rounded-lg transition-all duration-200"
                  title="Copy step"
                >
                  {copiedStep === index ? (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-white/60" />
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
        
        {/* Code example */}
        {solution.codeExample && (
          <div className="space-y-3 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                  <Code className="w-5 h-5 text-white" />
                </div>
                <h4 className="text-lg font-semibold text-white">Code Example</h4>
              </div>
              <button
                onClick={() => copyToClipboard(solution.codeExample!, 'code')}
                className="flex items-center gap-2 px-3 py-1 hover:bg-white/10 rounded-lg transition-all duration-200 text-white/70 hover:text-white"
              >
                {copiedCode ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    Copied! ✅
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy Code
                  </>
                )}
              </button>
            </div>
            <pre className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 border border-white/10 rounded-xl p-4 overflow-x-auto shadow-lg">
              <code className="text-green-300 text-sm font-mono">{solution.codeExample}</code>
            </pre>
          </div>
        )}
        
        {/* Tips */}
        {solution.tips.length > 0 && (
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-lg">
                <Lightbulb className="w-5 h-5 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-white">Pro Tips 💡</h4>
            </div>
            <div className="grid gap-2">
              {solution.tips.map((tip, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-gradient-to-br from-yellow-400/10 to-amber-400/10 border border-yellow-400/20 rounded-lg">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-white/90 text-sm">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Resources */}
        {solution.resources.length > 0 && (
          <div className="space-y-3 mb-6">
            <h4 className="text-lg font-semibold text-white">Learn More 📚</h4>
            <div className="grid gap-2">
              {solution.resources.map((resource, index) => (
                <a
                  key={index}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-gradient-to-br from-white/5 to-white/10 hover:from-white/10 hover:to-white/15 rounded-lg transition-all duration-200 text-white/80 hover:text-white group border border-white/10"
                >
                  <ExternalLink className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span>{resource.title}</span>
                </a>
              ))}
            </div>
          </div>
        )}
        
        {/* Action buttons */}
        <div className="flex items-center justify-center pt-4">
          <button
            onClick={onNewError}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-medium rounded-xl hover:from-yellow-500 hover:to-orange-600 transform hover:scale-105 transition-all duration-200 shadow-lg shadow-orange-500/30"
          >
            <RotateCcw className="w-5 h-5" />
            Debug Another Error 🔄
          </button>
        </div>
      </div>
    </div>
  );
};

// README Generator Page
const ReadmeGeneratorPage: React.FC = () => {
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [installation, setInstallation] = useState('');
  const [usage, setUsage] = useState('');
  const [contributing, setContributing] = useState('');
  const [license, setLicense] = useState('MIT');
  const [badges, setBadges] = useState(true);
  const [tableOfContents, setTableOfContents] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedReadme, setGeneratedReadme] = useState('');
  const { playSound } = useSound();
  
  const generateReadme = () => {
    setIsGenerating(true);
    playSound('generate');
    
    setTimeout(() => {
      let readme = `# ${projectName || 'Project Name'}\n\n`;
      
      if (badges) {
        readme += `[![License: ${license}](https://img.shields.io/badge/License-${license}-yellow.svg)](https://opensource.org/licenses/${license})\n`;
        readme += `[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)](https://www.javascript.com/)\n`;
        readme += `[![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)](https://reactjs.org/)\n\n`;
      }
      
      readme += `${projectDescription || 'A brief description of what this project does and who it\'s for.'}\n\n`;
      
      if (tableOfContents) {
        readme += `## Table of Contents\n\n`;
        readme += `- [Installation](#installation)\n`;
        readme += `- [Usage](#usage)\n`;
        if (contributing) readme += `- [Contributing](#contributing)\n`;
        readme += `- [License](#license)\n\n`;
      }
      
      readme += `## Installation\n\n`;
      readme += `\`\`\`bash\n`;
      readme += `npm install\n`;
      readme += `\`\`\`\n\n`;
      
      if (installation) {
        readme += `${installation}\n\n`;
      }
      
      readme += `## Usage\n\n`;
      readme += `\`\`\`javascript\n`;
      readme += `const component = require('component');\n\n`;
      readme += `const myComponent = new component();\n`;
      readme += `myComponent.doSomething();\n`;
      readme += `\`\`\`\n\n`;
      
      if (usage) {
        readme += `${usage}\n\n`;
      }
      
      if (contributing) {
        readme += `## Contributing\n\n`;
        readme += `Contributions are always welcome! 🤝\n\n`;
        readme += `See \`contributing.md\` for ways to get started.\n\n`;
        readme += `Please adhere to this project's \`code of conduct\`.\n\n`;
      }
      
      readme += `## License\n\n`;
      readme += `[${license}](https://choosealicense.com/licenses/${license.toLowerCase()})\n`;
      
      setGeneratedReadme(readme);
      setIsGenerating(false);
      playSound('success');
    }, 1500);
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedReadme).then(() => {
      setCopied(true);
      playSound('success');
      setTimeout(() => setCopied(false), 2000);
    });
  };
  
  const downloadReadme = () => {
    const blob = new Blob([generatedReadme], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectName.replace(/\s+/g, '-').toLowerCase() || 'readme'}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    playSound('success');
  };
  
  return (
    <div className="space-y-8">
      <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-2xl p-6 transition-all duration-300 border border-white/10 shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-white">AI README Generator 📝</h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="space-y-4">
            <div>
              <label className="block text-white/80 mb-2">Project Name</label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => {
                  setProjectName(e.target.value);
                  playSound('typing');
                }}
                placeholder="My Awesome Project"
                className="w-full bg-gradient-to-br from-white/5 to-white/10 border border-white/10 rounded-lg px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            
            <div>
              <label className="block text-white/80 mb-2">Description</label>
              <textarea
                value={projectDescription}
                onChange={(e) => {
                  setProjectDescription(e.target.value);
                  playSound('typing');
                }}
                placeholder="A brief description of your project"
                rows={3}
                className="w-full bg-gradient-to-br from-white/5 to-white/10 border border-white/10 rounded-lg px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
              />
            </div>
            
            <div>
              <label className="block text-white/80 mb-2">Installation Instructions</label>
              <textarea
                value={installation}
                onChange={(e) => {
                  setInstallation(e.target.value);
                  playSound('typing');
                }}
                placeholder="Steps to install your project"
                rows={3}
                className="w-full bg-gradient-to-br from-white/5 to-white/10 border border-white/10 rounded-lg px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
              />
            </div>
            
            <div>
              <label className="block text-white/80 mb-2">Usage Examples</label>
              <textarea
                value={usage}
                onChange={(e) => {
                  setUsage(e.target.value);
                  playSound('typing');
                }}
                placeholder="How to use your project"
                rows={3}
                className="w-full bg-gradient-to-br from-white/5 to-white/10 border border-white/10 rounded-lg px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
              />
            </div>
            
            <div>
              <label className="block text-white/80 mb-2">Contributing Guidelines</label>
              <textarea
                value={contributing}
                onChange={(e) => {
                  setContributing(e.target.value);
                  playSound('typing');
                }}
                placeholder="How others can contribute"
                rows={2}
                className="w-full bg-gradient-to-br from-white/5 to-white/10 border border-white/10 rounded-lg px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
              />
            </div>
            
            <div>
              <label className="block text-white/80 mb-2">License</label>
              <select
                value={license}
                onChange={(e) => {
                  setLicense(e.target.value);
                  playSound('click');
                }}
                className="w-full bg-gradient-to-br from-white/5 to-white/10 border border-white/10 rounded-lg px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="MIT">MIT</option>
                <option value="Apache-2.0">Apache 2.0</option>
                <option value="GPL-3.0">GPL 3.0</option>
                <option value="BSD-3-Clause">BSD 3-Clause</option>
                <option value="MPL-2.0">Mozilla Public License 2.0</option>
              </select>
            </div>
            
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-white/80">
                <input
                  type="checkbox"
                  checked={badges}
                  onChange={(e) => {
                    setBadges(e.target.checked);
                    playSound('click');
                  }}
                  className="rounded text-green-500 focus:ring-green-500"
                />
                Include Badges 🏷️
              </label>
              
              <label className="flex items-center gap-2 text-white/80">
                <input
                  type="checkbox"
                  checked={tableOfContents}
                  onChange={(e) => {
                    setTableOfContents(e.target.checked);
                    playSound('click');
                  }}
                  className="rounded text-green-500 focus:ring-green-500"
                />
                Table of Contents 📑
              </label>
            </div>
            
            <button
              onClick={generateReadme}
              disabled={isGenerating}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium rounded-xl hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-green-500/30"
            >
              {isGenerating ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Generating... ✨
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Generate README 🚀
                </>
              )}
            </button>
          </div>
          
          {/* Preview Section */}
          <div className="flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg">
                  <Code className="text-blue-400" />
                </div>
                README Preview
              </h3>
              
              <div className="flex gap-2">
                <button
                  onClick={copyToClipboard}
                  disabled={!generatedReadme}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 transition-all duration-200 shadow-lg shadow-blue-500/30"
                >
                  {copied ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Copied! ✅
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy
                    </>
                  )}
                </button>
                
                <button
                  onClick={downloadReadme}
                  disabled={!generatedReadme}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium rounded-lg hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 transition-all duration-200 shadow-lg shadow-green-500/30"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-white/10 rounded-xl p-4 flex-1 overflow-auto shadow-lg">
              {isGenerating ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <Loader className="w-12 h-12 animate-spin mb-4" />
                  <p>AI is generating your README... ✨</p>
                </div>
              ) : generatedReadme ? (
                <pre className="text-gray-200 text-sm whitespace-pre-wrap font-mono">
                  {generatedReadme}
                </pre>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <FileText className="w-12 h-12 mb-4" />
                  <p>Fill in the form and click "Generate README" 📝</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Effects Vault Page
interface EffectSnippet {
  id: string;
  title: string;
  description: string;
  code: string;
  tags: string[];
  isFavorite: boolean;
  language: string;
}

const EffectsVaultPage: React.FC = () => {
  const [snippets, setSnippets] = useState<EffectSnippet[]>([
    {
      id: '1',
      title: 'Data Fetching Hook',
      description: 'Fetch data from an API with loading and error states',
      code: `import { useState, useEffect } from 'react';
function useData(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(url);
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [url]);
  return { data, loading, error };
}`,
      tags: ['data-fetching', 'api', 'hook'],
      isFavorite: true,
      language: 'JavaScript'
    },
    {
      id: '2',
      title: 'Event Listener Hook',
      description: 'Add and clean up event listeners properly',
      code: `import { useState, useEffect, useRef } from 'react';
function useEventListener(eventName, handler, element = window) {
  const savedHandler = useRef(handler);
  
  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);
  
  useEffect(() => {
    const isSupported = element && element.addEventListener;
    if (!isSupported) return;
    
    const eventListener = (event) => savedHandler.current(event);
    
    element.addEventListener(eventName, eventListener);
    
    return () => {
      element.removeEventListener(eventName, eventListener);
    };
  }, [eventName, element]);
}`,
      tags: ['event-listener', 'dom', 'hook'],
      isFavorite: true,
      language: 'JavaScript'
    }
  ]);
  
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [newEffectName, setNewEffectName] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('JavaScript');
  const { playSound } = useSound();
  
  const languages = ['JavaScript', 'TypeScript', 'React', 'Vue', 'Angular', 'Svelte'];
  const allTags = Array.from(new Set(snippets.flatMap(snippet => snippet.tags)));
  
  const toggleFavorite = (id: string) => {
    setSnippets(snippets.map(snippet => 
      snippet.id === id 
        ? { ...snippet, isFavorite: !snippet.isFavorite } 
        : snippet
    ));
    playSound('click');
  };
  
  const copyToClipboard = (id: string, code: string) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopiedId(id);
      playSound('success');
      setTimeout(() => setCopiedId(null), 2000);
    });
  };
  
  const generateRealEffect = () => {
    if (!newEffectName.trim()) return;
    
    setIsGenerating(true);
    playSound('generate');
    
    setTimeout(() => {
      let newSnippet: EffectSnippet;
      
      // Generate real effects based on user input
      const effectName = newEffectName.toLowerCase();
      
      if (effectName.includes('whatsapp')) {
        newSnippet = {
          id: Date.now().toString(),
          title: 'WhatsApp Widget',
          description: 'A floating WhatsApp chat widget for websites',
          code: `import { useState, useEffect } from 'react';
const WhatsAppWidget = ({ phoneNumber, message, position = 'right' }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const handleClick = () => {
    const url = \`https://wa.me/\${phoneNumber.replace(/[^0-9]/g, '')}?text=\${encodeURIComponent(message)}\`;
    window.open(url, '_blank');
  };
  
  return (
    <div className={\`fixed \${position === 'right' ? 'right-6' : 'left-6'} bottom-6 z-50\`}>
      <div className="relative">
        {isOpen && (
          <div className="mb-4 bg-white p-4 rounded-lg shadow-lg w-64">
            <p className="text-gray-700 mb-2">Hi there! 👋 How can we help you?</p>
            <button 
              onClick={handleClick}
              className="bg-green-500 text-white px-4 py-2 rounded-md w-full"
            >
              Chat on WhatsApp
            </button>
          </div>
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-colors"
          aria-label="Chat on WhatsApp"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.265-.347.447-.575.111-.148.223-.297.335-.446.1-.139.05-.258.025-.367-.025-.111-.447-1.047-.644-1.432-.197-.387-.395-.348-.575-.348-.197 0-.395-.012-.594-.012-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>
        </button>
      </div>
    </div>
  );
};
export default WhatsAppWidget;`,
          tags: ['widget', 'whatsapp', 'chat', 'ui'],
          isFavorite: false,
          language: selectedLanguage
        };
      } else if (effectName.includes('blob')) {
        newSnippet = {
          id: Date.now().toString(),
          title: 'Blob Effect',
          description: 'An animated blob background effect using SVG filters',
          code: `import React, { useEffect, useRef } from 'react';
const BlobEffect = ({ color = '#6366f1', speed = 'slow' }) => {
  const blobRef = useRef(null);
  
  useEffect(() => {
    const blob = blobRef.current;
    if (!blob) return;
    
    // Animate the blob
    const animate = () => {
      const duration = speed === 'slow' ? 20000 : 10000;
      const keyframes = [
        { transform: 'translate(0px, 0px) scale(1)', borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' },
        { transform: 'translate(30px, -50px) scale(1.1)', borderRadius: '30% 60% 70% 40% / 50% 60% 30% 60%' },
        { transform: 'translate(-20px, 20px) scale(0.9)', borderRadius: '50% 30% 60% 70% / 30% 50% 70% 50%' },
        { transform: 'translate(30px, 30px) scale(1.05)', borderRadius: '40% 70% 50% 30% / 40% 50% 30% 60%' },
        { transform: 'translate(0px, 0px) scale(1)', borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' }
      ];
      
      const animation = blob.animate(keyframes, {
        duration: duration,
        iterations: Infinity,
        easing: 'ease-in-out'
      });
      
      return () => animation.cancel();
    };
    
    const animation = animate();
    return () => animation();
  }, [speed]);
  
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div 
        ref={blobRef}
        className="absolute w-[500px] h-[500px] -top-[250px] -left-[250px]"
        style={{
          background: color,
          filter: 'blur(120px)',
          opacity: 0.7
        }}
      />
    </div>
  );
};
export default BlobEffect;`,
          tags: ['animation', 'blob', 'background', 'svg'],
          isFavorite: false,
          language: selectedLanguage
        };
      } else if (effectName.includes('parallax')) {
        newSnippet = {
          id: Date.now().toString(),
          title: 'Parallax Scrolling',
          description: 'Create a parallax scrolling effect for your website',
          code: `import React, { useEffect, useRef } from 'react';
const ParallaxSection = ({ children, speed = 0.5 }) => {
  const ref = useRef(null);
  
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const offsetTop = element.offsetTop;
      const elementHeight = element.offsetHeight;
      const windowHeight = window.innerHeight;
      
      // Check if element is in viewport
      if (scrollY + windowHeight > offsetTop && scrollY < offsetTop + elementHeight) {
        const yPos = -(scrollY - offsetTop) * speed;
        element.style.transform = \`translateY(\${yPos}px)\`;
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);
  
  return (
    <div ref={ref} className="relative overflow-hidden">
      {children}
    </div>
  );
};
// Usage example
const ParallaxBackground = () => {
  return (
    <div className="min-h-screen">
      <section className="h-screen flex items-center justify-center">
        <h1 className="text-4xl font-bold">Hero Section</h1>
      </section>
      
      <ParallaxSection speed={0.5}>
        <div className="h-screen flex items-center justify-center bg-blue-500">
          <h2 className="text-4xl font-bold text-white">Parallax Section</h2>
        </div>
      </ParallaxSection>
      
      <section className="h-screen flex items-center justify-center">
        <h1 className="text-4xl font-bold">Normal Section</h1>
      </section>
    </div>
  );
};
export default ParallaxBackground;`,
          tags: ['scroll', 'parallax', 'animation', 'effect'],
          isFavorite: false,
          language: selectedLanguage
        };
      } else if (effectName.includes('dark mode')) {
        newSnippet = {
          id: Date.now().toString(),
          title: 'Dark Mode Toggle',
          description: 'A complete dark mode implementation with theme persistence',
          code: `import React, { createContext, useContext, useEffect, useState } from 'react';
const ThemeContext = createContext();
export const useTheme = () => {
  return useContext(ThemeContext);
};
export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);
  
  useEffect(() => {
    // Check for saved preference or respect OS preference
    const isDark = localStorage.getItem('darkMode') === 'true' || 
                  (!('darkMode' in localStorage) && 
                  window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    setDarkMode(isDark);
  }, []);
  
  useEffect(() => {
    // Update class on document element and save preference
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [darkMode]);
  
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };
  
  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};
// Dark mode toggle component
const DarkModeToggle = () => {
  const { darkMode, toggleDarkMode } = useTheme();
  
  return (
    <button
      onClick={toggleDarkMode}
      className="p-2 rounded-full bg-gray-200 dark:bg-gray-700"
      aria-label="Toggle dark mode"
    >
      {darkMode ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      )}
    </button>
  );
};
// Usage in app
const App = () => {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
        <header className="p-4 flex justify-end">
          <DarkModeToggle />
        </header>
        <main>
          <h1>Hello World</h1>
          <p>This app supports dark mode!</p>
        </main>
      </div>
    </ThemeProvider>
  );
};
export default App;`,
          tags: ['dark-mode', 'theme', 'toggle', 'ui'],
          isFavorite: false,
          language: selectedLanguage
        };
      } else {
        // Default template for other effects
        newSnippet = {
          id: Date.now().toString(),
          title: `${newEffectName} Effect`,
          description: `A custom React effect for ${newEffectName.toLowerCase()}`,
          code: `import { useState, useEffect } from 'react';
function use${newEffectName.replace(/\s+/g, '')}(initialValue) {
  const [state, setState] = useState(initialValue);
  useEffect(() => {
    // Your effect logic here
    // Example: 
    // const handleEffect = () => {
    //   // Effect implementation
    // };
    // 
    // handleEffect();
    // 
    // return () => {
    //   // Cleanup
    // };
  }, [state]);
  return [state, setState];
}
// Usage example
function MyComponent() {
  const [value, setValue] = use${newEffectName.replace(/\s+/g, '')}('');
  
  return (
    <div>
      <input 
        type="text" 
        value={value} 
        onChange={(e) => setValue(e.target.value)} 
      />
      <p>Current value: {value}</p>
    </div>
  );
}
export default MyComponent;`,
          tags: ['custom', 'effect', 'generated'],
          isFavorite: false,
          language: selectedLanguage
        };
      }
      
      setSnippets([newSnippet, ...snippets]);
      setIsGenerating(false);
      setNewEffectName('');
      playSound('success');
    }, 1500);
  };
  
  const filteredSnippets = snippets.filter(snippet => {
    const matchesTag = selectedTag === 'all' || snippet.tags.includes(selectedTag);
    const matchesSearch = snippet.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         snippet.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         snippet.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesTag && matchesSearch;
  });
  
  const favoriteSnippets = snippets.filter(snippet => snippet.isFavorite);
  
  return (
    <div className="space-y-8">
      <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-2xl p-6 transition-all duration-300 border border-white/10 shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
            <Code className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-white">AI Effects Vault ✨</h2>
        </div>
        
        {/* Generate New Effect */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              value={newEffectName}
              onChange={(e) => {
                setNewEffectName(e.target.value);
                playSound('typing');
              }}
              placeholder="Enter effect name (e.g., WhatsApp Widget, Blob Effect)"
              className="flex-1 bg-gradient-to-br from-white/5 to-white/10 border border-white/10 rounded-lg px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            
            <select
              value={selectedLanguage}
              onChange={(e) => {
                setSelectedLanguage(e.target.value);
                playSound('click');
              }}
              className="bg-gradient-to-br from-white/5 to-white/10 border border-white/10 rounded-lg px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {languages.map(lang => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
            
            <button
              onClick={generateRealEffect}
              disabled={isGenerating || !newEffectName.trim()}
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-black font-medium rounded-lg hover:from-purple-600 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-purple-500/30"
            >
              {isGenerating ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Creating... ✨
                </>
              ) : (
                <>
                  <Code className="w-4 h-4" />
                  Generate 🚀
                </>
              )}
            </button>
          </div>
        </div>
        
        {/* Search and Filter */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  playSound('typing');
                }}
                placeholder="Search effects..."
                className="w-full bg-gradient-to-br from-white/5 to-white/10 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Filter className="text-gray-400 w-5 h-5" />
              <select
                value={selectedTag}
                onChange={(e) => {
                  setSelectedTag(e.target.value);
                  playSound('click');
                }}
                className="bg-gradient-to-br from-white/5 to-white/10 border border-white/10 rounded-lg px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All Tags</option>
                {allTags.map(tag => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        {/* Favorites Section */}
        {favoriteSnippets.length > 0 && (
          <div className="space-y-4 mb-6">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Star className="text-yellow-400 fill-yellow-400" />
              Favorite Effects ⭐
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {favoriteSnippets.map(snippet => (
                <EffectCard 
                  key={snippet.id} 
                  snippet={snippet} 
                  onToggleFavorite={toggleFavorite}
                  onCopy={copyToClipboard}
                  copiedId={copiedId}
                />
              ))}
            </div>
          </div>
        )}
        
        {/* All Effects Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">All Effects 📚</h3>
          {filteredSnippets.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredSnippets.map(snippet => (
                <EffectCard 
                  key={snippet.id} 
                  snippet={snippet} 
                  onToggleFavorite={toggleFavorite}
                  onCopy={copyToClipboard}
                  copiedId={copiedId}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-gradient-to-br from-white/5 to-white/10 rounded-xl border border-white/10">
              <p className="text-gray-400">No effects found matching your search 🔍</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Effect Card Component
interface EffectCardProps {
  snippet: EffectSnippet;
  onToggleFavorite: (id: string) => void;
  onCopy: (id: string, code: string) => void;
  copiedId: string | null;
}

const EffectCard: React.FC<EffectCardProps> = ({ snippet, onToggleFavorite, onCopy, copiedId }) => {
  const { playSound } = useSound();
  
  return (
    <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-md rounded-2xl p-5 flex flex-col h-full border border-white/10 shadow-lg">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h4 className="text-lg font-semibold text-white">{snippet.title}</h4>
          <span className="text-xs text-purple-400">{snippet.language}</span>
        </div>
        <button 
          onClick={() => onToggleFavorite(snippet.id)}
          className="text-gray-400 hover:text-yellow-400 transition-colors"
          aria-label={snippet.isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Star className={`w-5 h-5 ${snippet.isFavorite ? 'text-yellow-400 fill-yellow-400' : ''}`} />
        </button>
      </div>
      
      <p className="text-white/80 mb-4 flex-grow">{snippet.description}</p>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {snippet.tags.map(tag => (
          <span key={tag} className="px-2 py-1 bg-gradient-to-br from-white/5 to-white/10 text-white/70 text-xs rounded-full border border-white/10">
            {tag}
          </span>
        ))}
      </div>
      
      <div className="relative">
        <pre className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-white/10 rounded-lg p-3 overflow-x-auto text-sm text-gray-200 font-mono max-h-40">
          {snippet.code}
        </pre>
        <button
          onClick={() => onCopy(snippet.id, snippet.code)}
          className="absolute top-2 right-2 p-1.5 bg-gradient-to-br from-white/10 to-white/20 hover:from-white/20 hover:to-white/30 rounded-md transition-colors"
          aria-label="Copy code"
        >
          {copiedId === snippet.id ? (
            <CheckCircle className="w-4 h-4 text-green-400" />
          ) : (
            <Copy className="w-4 h-4 text-gray-400" />
          )}
        </button>
      </div>
    </div>
  );
};

// Email Templates Page
const EmailTemplatesPage: React.FC = () => {
  const [jobProfile, setJobProfile] = useState('');
  const [generatedEmail, setGeneratedEmail] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('standout');
  const { playSound } = useSound();
  
  const templates = [
    { id: 'standout', name: 'Standout Application' },
    { id: 'followup', name: 'Follow Up' },
    { id: 'referral', name: 'Referral Request' },
    { id: 'networking', name: 'Networking' }
  ];
  
  const generateEmailTemplate = () => {
    if (!jobProfile.trim()) return;
    
    setIsGenerating(true);
    playSound('generate');
    
    setTimeout(() => {
      let emailTemplate = '';
      
      // Extract key information from job profile
      const jobTitleMatch = jobProfile.match(/job title[:\s]+([^\n]+)/i);
      const companyMatch = jobProfile.match(/company[:\s]+([^\n]+)/i);
      const skillsMatch = jobProfile.match(/skills[:\s]+([^\n]+)/i);
      
      const jobTitle = jobTitleMatch ? jobTitleMatch[1].trim() : 'the position';
      const company = companyMatch ? companyMatch[1].trim() : 'your company';
      const skills = skillsMatch ? skillsMatch[1].trim() : 'relevant skills';
      
      // Generate email based on selected template
      if (selectedTemplate === 'standout') {
        emailTemplate = `Subject: Application for ${jobTitle} - Passionate and Experienced Professional ✨
Dear Hiring Manager,
I hope this email finds you well. I am writing to express my enthusiastic interest in the ${jobTitle} position at ${company}. With my extensive experience in ${skills}, I am confident that I possess the skills and qualifications necessary to excel in this role.
Throughout my career, I have developed a strong foundation in ${skills}, which I believe aligns perfectly with the requirements of this position. My ability to [mention a key achievement or skill] has consistently resulted in [positive outcome or result]. I am particularly drawn to ${company} because of your commitment to [mention something specific about the company], and I am eager to contribute to your team's continued success.
What sets me apart from other candidates is my unique combination of technical expertise and creative problem-solving abilities. I thrive in challenging environments and am always looking for innovative solutions to complex problems. Additionally, my strong communication skills allow me to effectively collaborate with cross-functional teams and stakeholders at all levels.
I would welcome the opportunity to discuss how my skills and experiences can benefit ${company}. Thank you for considering my application. I look forward to the possibility of contributing to your team and am excited about the potential to grow both professionally and personally at ${company}.
Best regards,
[Your Name]
[Your Phone Number]
[Your Email Address]
[LinkedIn Profile URL]`;
      } else if (selectedTemplate === 'followup') {
        emailTemplate = `Subject: Following Up on My Application for ${jobTitle} 📝
Dear [Hiring Manager's Name],
I hope this email finds you well. I recently applied for the ${jobTitle} position at ${company} and wanted to follow up on my application. I remain very interested in this opportunity and believe my background in ${skills} makes me a strong candidate for the role.
Since submitting my application, I have [mention any additional relevant experience, certifications, or achievements]. This further strengthens my qualifications and enthusiasm for contributing to your team.
I understand that you are likely very busy, but I would greatly appreciate the opportunity to discuss my application further. Please let me know if there is any additional information I can provide or if there is a convenient time for a brief conversation.
Thank you for your time and consideration. I look forward to hearing from you soon.
Best regards,
[Your Name]
[Your Phone Number]
[Your Email Address]
[LinkedIn Profile URL]`;
      } else if (selectedTemplate === 'referral') {
        emailTemplate = `Subject: Referral Request for ${jobTitle} at ${company} 🤝
Dear [Contact's Name],
I hope this email finds you well. I hope you're doing great at ${company}!
I'm writing to you today because I recently came across a ${jobTitle} opening at ${company} that immediately caught my attention. Given your experience there and our professional relationship, I was hoping you might be able to provide some insight or potentially refer me for the position.
With my background in ${skills}, I believe I would be a strong fit for this role. I've been following ${company}'s work for some time and am particularly impressed by [mention something specific about the company]. I am confident that my skills in [specific skill] and [another specific skill] would allow me to contribute meaningfully to your team.
If you feel comfortable doing so, I would greatly appreciate it if you could refer me for this position or provide any guidance on the application process. I've attached my resume for your reference and would be happy to provide any additional information you might need.
Thank you for considering my request. I understand if you're not able to help, but I wanted to reach out regardless.
Best regards,
[Your Name]
[Your Phone Number]
[Your Email Address]
[LinkedIn Profile URL]`;
      } else if (selectedTemplate === 'networking') {
        emailTemplate = `Subject: Connecting Regarding Opportunities at ${company} 🌐
Dear [Recipient's Name],
I hope this email finds you well. My name is [Your Name], and I'm a [Your Profession] with expertise in ${skills}. I've been following your work at ${company} and have been consistently impressed by [mention something specific about their work or the company].
I'm reaching out to explore potential opportunities at ${company} where I might be able to contribute my skills and experience. With my background in [specific skill] and [another specific skill], I believe I could bring significant value to your team, particularly in the area of [specific area of expertise].
I would appreciate the opportunity to learn more about your experience at ${company} and any advice you might have for someone with my background looking to join your organization. Would you be open to a brief 15-20 minute virtual coffee chat in the coming weeks?
Thank you for considering my request. I understand you have a busy schedule, but I would greatly appreciate any time you could spare.
Best regards,
[Your Name]
[Your Phone Number]
[Your Email Address]
[LinkedIn Profile URL]`;
      }
      
      setGeneratedEmail(emailTemplate);
      setIsGenerating(false);
      playSound('success');
    }, 1500);
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedEmail).then(() => {
      setCopied(true);
      playSound('success');
      setTimeout(() => setCopied(false), 2000);
    });
  };
  
  return (
    <div className="space-y-8">
      <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-2xl p-6 transition-all duration-300 border border-white/10 shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg">
            <Mail className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-white">AI Email Template Generator ✉️</h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-4">
            <div>
              <label className="block text-white/80 mb-2">Select Template Type</label>
              <div className="grid grid-cols-2 gap-2">
                {templates.map(template => (
                  <button
                    key={template.id}
                    onClick={() => {
                      setSelectedTemplate(template.id);
                      playSound('click');
                    }}
                    className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                      selectedTemplate === template.id
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30'
                        : 'bg-gradient-to-br from-white/5 to-white/10 text-white/80 hover:bg-white/10 border border-white/10'
                    }`}
                  >
                    {template.name}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-white/80 mb-2">Paste Job Profile</label>
              <textarea
                value={jobProfile}
                onChange={(e) => {
                  setJobProfile(e.target.value);
                  playSound('typing');
                }}
                placeholder="Paste the job description or profile here...
Example:
Job Title: Frontend Developer
Company: Tech Innovations Inc.
Skills: React, JavaScript, TypeScript, CSS
Requirements: 3+ years experience, Bachelor's degree"
                rows={8}
                className="w-full bg-gradient-to-br from-white/5 to-white/10 border border-white/10 rounded-lg px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
            
            <button
              onClick={generateEmailTemplate}
              disabled={isGenerating || !jobProfile.trim()}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-blue-500/30"
            >
              {isGenerating ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Generating... ✨
                </>
              ) : (
                <>
                  <Mail className="w-5 h-5" />
                  Generate Email 📧
                </>
              )}
            </button>
          </div>
          
          {/* Preview Section */}
          <div className="flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg">
                  <FileText className="text-blue-400" />
                </div>
                Email Preview
              </h3>
              
              <button
                onClick={copyToClipboard}
                disabled={!generatedEmail}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 transition-all duration-200 shadow-lg shadow-blue-500/30"
              >
                {copied ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Copied! ✅
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy Email
                  </>
                )}
              </button>
            </div>
            
            <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-white/10 rounded-xl p-4 flex-1 overflow-auto shadow-lg">
              {isGenerating ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <Loader className="w-12 h-12 animate-spin mb-4" />
                  <p>AI is generating your email template... ✨</p>
                </div>
              ) : generatedEmail ? (
                <pre className="text-gray-200 text-sm whitespace-pre-wrap font-mono">
                  {generatedEmail}
                </pre>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <Mail className="w-12 h-12 mb-4" />
                  <p>Paste a job profile and click "Generate Email" 📧</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Code Playground Page
const CodePlaygroundPage: React.FC = () => {
  const [code, setCode] = useState(`// Write your JavaScript code here
function greet(name) {
  return \`Hello, \${name}!\`;
}
console.log(greet('DevBuddy'));`);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const { playSound } = useSound();
  
  const runCode = () => {
    setIsRunning(true);
    playSound('generate');
    
    // Capture console.log output
    const originalLog = console.log;
    const logs: string[] = [];
    
    console.log = (...args) => {
      logs.push(args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
      ).join(' '));
    };
    
    try {
      // Execute the code
      const result = eval(code);
      
      // Display result if any
      if (result !== undefined) {
        logs.push(String(result));
      }
      
      setOutput(logs.join('\n'));
      playSound('success');
    } catch (error) {
      setOutput(`Error: ${error instanceof Error ? error.message : String(error)}`);
      playSound('error');
    } finally {
      // Restore console.log
      console.log = originalLog;
      setIsRunning(false);
    }
  };
  
  const clearCode = () => {
    setCode('');
    setOutput('');
    playSound('click');
  };
  
  const copyCode = () => {
    navigator.clipboard.writeText(code).then(() => {
      playSound('success');
    });
  };
  
  return (
    <div className="space-y-8">
      <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-2xl p-6 transition-all duration-300 border border-white/10 shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
            <Terminal className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-white">Code Playground 💻</h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Code Editor */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-white">JavaScript Editor</h3>
              <div className="flex gap-2">
                <button
                  onClick={copyCode}
                  className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-lg shadow-blue-500/30"
                >
                  <Copy className="w-4 h-4" />
                  Copy
                </button>
                <button
                  onClick={clearCode}
                  className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-gray-500 to-gray-700 text-white text-sm rounded-lg hover:from-gray-600 hover:to-gray-800 transition-all duration-200 shadow-lg shadow-gray-500/30"
                >
                  <X className="w-4 h-4" />
                  Clear
                </button>
              </div>
            </div>
            
            <div className="relative">
              <textarea
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                  playSound('typing');
                }}
                className="w-full h-80 bg-gradient-to-br from-gray-900/80 to-gray-800/80 border border-white/10 rounded-xl p-4 text-gray-200 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
                spellCheck="false"
              />
              <div className="absolute top-2 right-2 text-xs text-gray-400 bg-gray-900/80 px-2 py-1 rounded">
                JavaScript
              </div>
            </div>
            
            <button
              onClick={runCode}
              disabled={isRunning}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium rounded-xl hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-green-500/30"
            >
              {isRunning ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Running...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  Run Code ▶️
                </>
              )}
            </button>
          </div>
          
          {/* Output */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Output</h3>
            <div className="h-80 bg-gradient-to-br from-gray-900/80 to-gray-800/80 border border-white/10 rounded-xl p-4 overflow-auto">
              {output ? (
                <pre className="text-gray-200 font-mono text-sm whitespace-pre-wrap">{output}</pre>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <p>Run your code to see the output here</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Dependency Checker Page
const DependencyCheckerPage: React.FC = () => {
  const [packageJson, setPackageJson] = useState(`{
  "name": "my-project",
  "version": "1.0.0",
  "dependencies": {
    "react": "^17.0.2",
    "lodash": "^4.17.21"
  }
}`);
  const [results, setResults] = useState<any[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const { playSound } = useSound();
  
  const checkDependencies = () => {
    setIsChecking(true);
    playSound('generate');
    
    setTimeout(() => {
      try {
        const pkg = JSON.parse(packageJson);
        const dependencies = { ...pkg.dependencies, ...pkg.devDependencies };
        const resultsArray: React.SetStateAction<any[]> = [];
        
        // Simulate checking dependencies against npm registry
        Object.entries(dependencies).forEach(([name, version]) => {
          const versionStr = typeof version === 'string' ? version : '';
          
          // Simulate different statuses
          const statuses = ['up-to-date', 'outdated', 'vulnerable'];
          const status = statuses[Math.floor(Math.random() * statuses.length)];
          
          let latestVersion = versionStr;
          if (status === 'outdated') {
            // Extract major version and increment
            const match = versionStr.match(/(\d+)/);
            if (match) {
              const major = parseInt(match[0]);
              latestVersion = `^${major + 1}.0.0`;
            }
          }
          
          resultsArray.push({
            name,
            current: versionStr,
            latest: latestVersion,
            status,
            vulnerable: status === 'vulnerable'
          });
        });
        
        setResults(resultsArray);
        playSound('success');
      } catch (error) {
        setResults([{ name: 'Error', current: '', latest: '', status: 'error', vulnerable: false }]);
        playSound('error');
      } finally {
        setIsChecking(false);
      }
    }, 2000);
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'up-to-date': return 'text-green-400';
      case 'outdated': return 'text-yellow-400';
      case 'vulnerable': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'up-to-date': return 'bg-gradient-to-r from-green-500 to-emerald-600';
      case 'outdated': return 'bg-gradient-to-r from-yellow-500 to-amber-600';
      case 'vulnerable': return 'bg-gradient-to-r from-red-500 to-rose-600';
      default: return 'bg-gradient-to-r from-gray-500 to-gray-700';
    }
  };
  
  return (
    <div className="space-y-8">
      <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-2xl p-6 transition-all duration-300 border border-white/10 shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg">
            <Package className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-white">Dependency Checker 📦</h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-white">package.json</h3>
              <button
                onClick={() => setPackageJson('')}
                className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-gray-500 to-gray-700 text-white text-sm rounded-lg hover:from-gray-600 hover:to-gray-800 transition-all duration-200 shadow-lg shadow-gray-500/30"
              >
                <X className="w-4 h-4" />
                Clear
              </button>
            </div>
            
            <textarea
              value={packageJson}
              onChange={(e) => {
                setPackageJson(e.target.value);
                playSound('typing');
              }}
              className="w-full h-80 bg-gradient-to-br from-gray-900/80 to-gray-800/80 border border-white/10 rounded-xl p-4 text-gray-200 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              spellCheck="false"
            />
            
            <button
              onClick={checkDependencies}
              disabled={isChecking}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-blue-500/30"
            >
              {isChecking ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Checking...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  Check Dependencies 🔍
                </>
              )}
            </button>
          </div>
          
          {/* Results */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Results</h3>
            <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 border border-white/10 rounded-xl p-4 overflow-auto max-h-96">
              {results.length > 0 ? (
                <div className="space-y-3">
                  {results.map((dep, index) => (
                    <div key={index} className="p-3 bg-gradient-to-br from-white/5 to-white/10 rounded-lg border border-white/10">
                      <div className="flex justify-between items-center mb-2">
                        <div className="font-medium text-white">{dep.name}</div>
                        <span className={`px-2 py-1 text-xs rounded-full text-white ${getStatusBadge(dep.status)}`}>
                          {dep.status}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Current: {dep.current}</span>
                        {dep.status !== 'up-to-date' && (
                          <span className="text-gray-400">Latest: {dep.latest}</span>
                        )}
                      </div>
                      {dep.vulnerable && (
                        <div className="mt-2 text-xs text-red-400 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          Security vulnerability detected
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <p>Check your dependencies to see results here</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Color Palette Generator Page
const ColorPaletteGeneratorPage: React.FC = () => {
  const [baseColor, setBaseColor] = useState('#3b82f6');
  const [palette, setPalette] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const { playSound } = useSound();
  
  const generatePalette = () => {
    setIsGenerating(true);
    playSound('generate');
    
    setTimeout(() => {
      // Convert hex to RGB
      const hexToRgb = (hex: string) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        } : { r: 0, g: 0, b: 0 };
      };
      
      // Convert RGB to HSL
      const rgbToHsl = (r: number, g: number, b: number) => {
        r /= 255;
        g /= 255;
        b /= 255;
        
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h = 0, s, l = (max + min) / 2;
        
        if (max === min) {
          h = s = 0; // achromatic
        } else {
          const d = max - min;
          s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
          
          switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
          }
          
          h /= 6;
        }
        
        return { h: h * 360, s: s * 100, l: l * 100 };
      };
      
      // Convert HSL to hex
      const hslToHex = (h: number, s: number, l: number) => {
        l /= 100;
        const a = s * Math.min(l, 1 - l) / 100;
        const f = (n: number) => {
          const k = (n + h / 30) % 12;
          const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
          return Math.round(255 * color).toString(16).padStart(2, '0');
        };
        return `#${f(0)}${f(8)}${f(4)}`;
      };
      
      const rgb = hexToRgb(baseColor);
      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
      
      // Generate complementary colors
      const newPalette = [
        baseColor,
        hslToHex((hsl.h + 30) % 360, hsl.s, hsl.l),
        hslToHex((hsl.h + 60) % 360, hsl.s, hsl.l),
        hslToHex((hsl.h + 120) % 360, hsl.s, hsl.l),
        hslToHex((hsl.h + 150) % 360, hsl.s, hsl.l),
        hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l),
        hslToHex((hsl.h + 210) % 360, hsl.s, hsl.l),
        hslToHex((hsl.h + 240) % 360, hsl.s, hsl.l),
      ];
      
      setPalette(newPalette);
      setIsGenerating(false);
      playSound('success');
    }, 1000);
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      playSound('success');
    });
  };
  
  useEffect(() => {
    generatePalette();
  }, []);
  
  return (
    <div className="space-y-8">
      <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-2xl p-6 transition-all duration-300 border border-white/10 shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
            <Palette className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-white">Color Palette Generator 🎨</h2>
        </div>
        
        <div className="space-y-6">
          {/* Color Picker */}
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <label className="text-white/80">Base Color:</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={baseColor}
                onChange={(e) => {
                  setBaseColor(e.target.value);
                  playSound('click');
                }}
                className="w-12 h-12 rounded-lg border-0 cursor-pointer"
              />
              <span className="text-white font-mono">{baseColor}</span>
            </div>
            
            <button
              onClick={generatePalette}
              disabled={isGenerating}
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-medium rounded-lg hover:from-purple-600 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-purple-500/30"
            >
              {isGenerating ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  Generate Palette
                </>
              )}
            </button>
          </div>
          
          {/* Palette Display */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {palette.map((color, index) => (
              <div key={index} className="space-y-2">
                <div
                  className="h-24 rounded-lg shadow-lg"
                  style={{ backgroundColor: color }}
                ></div>
                <div className="flex justify-between items-center">
                  <span className="text-white font-mono text-sm">{color}</span>
                  <button
                    onClick={() => copyToClipboard(color)}
                    className="p-1.5 rounded-lg bg-gradient-to-br from-white/10 to-white/20 hover:from-white/20 hover:to-white/30 transition-colors"
                  >
                    <Copy className="w-4 h-4 text-white/80" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Regex Tester Page
const RegexTesterPage: React.FC = () => {
  const [pattern, setPattern] = useState('^\\d+$');
  const [flags, setFlags] = useState('g');
  const [testString, setTestString] = useState('12345');
  const [matches, setMatches] = useState<RegExpMatchArray[]>([]);
  const [error, setError] = useState('');
  const [isTesting, setIsTesting] = useState(false);
  const { playSound } = useSound();
  
  const testRegex = () => {
    setIsTesting(true);
    setError('');
    playSound('generate');
    
    try {
      const regex = new RegExp(pattern, flags);
      const matchArray: RegExpMatchArray[] = [];
      
      let match;
      if (flags.includes('g')) {
        // Global search - find all matches
        while ((match = regex.exec(testString)) !== null) {
          matchArray.push(match);
        }
      } else {
        // Non-global - just test for a match
        match = testString.match(regex);
        if (match) {
          matchArray.push(match);
        }
      }
      
      setMatches(matchArray);
      playSound('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid regex pattern');
      setMatches([]);
      playSound('error');
    } finally {
      setIsTesting(false);
    }
  };
  
  useEffect(() => {
    testRegex();
  }, []);
  
  return (
    <div className="space-y-8">
      <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-2xl p-6 transition-all duration-300 border border-white/10 shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg">
            <Hash className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-white">Regex Tester 🔍</h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input */}
          <div className="space-y-4">
            <div>
              <label className="block text-white/80 mb-2">Regular Expression</label>
              <div className="flex gap-2">
                <span className="flex items-center px-3 py-2 bg-gradient-to-br from-gray-800 to-gray-900 rounded-l-lg text-white/70">
                  /
                </span>
                <input
                  type="text"
                  value={pattern}
                  onChange={(e) => {
                    setPattern(e.target.value);
                    playSound('typing');
                  }}
                  className="flex-1 bg-gradient-to-br from-gray-800 to-gray-900 px-2 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="flex items-center px-3 py-2 bg-gradient-to-br from-gray-800 to-gray-900 rounded-r-lg text-white/70">
                  /
                </span>
              </div>
            </div>
            
            <div>
              <label className="block text-white/80 mb-2">Flags</label>
              <div className="flex gap-2">
                {['g', 'i', 'm', 's', 'u', 'y'].map(flag => (
                  <label key={flag} className="flex items-center gap-1 text-white/80">
                    <input
                      type="checkbox"
                      checked={flags.includes(flag)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFlags(flags + flag);
                        } else {
                          setFlags(flags.replace(flag, ''));
                        }
                        playSound('click');
                      }}
                      className="rounded text-blue-500 focus:ring-blue-500"
                    />
                    {flag}
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-white/80 mb-2">Test String</label>
              <textarea
                value={testString}
                onChange={(e) => {
                  setTestString(e.target.value);
                  playSound('typing');
                }}
                className="w-full h-32 bg-gradient-to-br from-gray-800 to-gray-900 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
            
            {error && (
              <div className="p-3 bg-gradient-to-br from-red-500/20 to-rose-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}
            
            <button
              onClick={testRegex}
              disabled={isTesting}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-blue-500/30"
            >
              {isTesting ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Testing...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  Test Regex
                </>
              )}
            </button>
          </div>
          
          {/* Results */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Matches</h3>
            <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 border border-white/10 rounded-xl p-4 overflow-auto max-h-96">
              {matches.length > 0 ? (
                <div className="space-y-3">
                  {matches.map((match, index) => (
                    <div key={index} className="p-3 bg-gradient-to-br from-white/5 to-white/10 rounded-lg border border-white/10">
                      <div className="font-medium text-white mb-1">Match {index + 1}</div>
                      <div className="text-sm text-gray-300 mb-1">
                        <span className="text-gray-400">Full match:</span> {match[0]}
                      </div>
                      <div className="text-sm text-gray-300">
                        <span className="text-gray-400">Index:</span> {match.index}
                      </div>
                      {match.length > 1 && (
                        <div className="mt-2">
                          <div className="text-sm text-gray-400 mb-1">Groups:</div>
                          <div className="grid grid-cols-2 gap-1">
                            {match.slice(1).map((group, i) => (
                              <div key={i} className="text-sm text-gray-300 bg-gradient-to-br from-gray-800 to-gray-900 px-2 py-1 rounded">
                                Group {i + 1}: {group}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <p>No matches found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Markdown Previewer Page
const MarkdownPreviewerPage: React.FC = () => {
  const [markdown, setMarkdown] = useState(`# Welcome to Markdown Previewer
## Features
- **Real-time preview**
- Support for common Markdown syntax
- Clean and responsive design
### Code Example
\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}!\`;
}
console.log(greet('DevBuddy'));
\`\`\`
### Lists
1. Item 1
2. Item 2
   - Subitem 2.1
   - Subitem 2.2
3. Item 3
> This is a blockquote example.
[Link to GitHub](https://github.com)`);
  const [isRendering, setIsRendering] = useState(false);
  const { playSound } = useSound;
  
  // Simple markdown to HTML converter (basic implementation)
  const markdownToHtml = (md: string) => {
    return md
      // Headers
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      // Bold
      .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
      // Code blocks
      .replace(/\`\`\`javascript\n([\s\S]*?)\n\`\`\`/gim, '<pre><code class="language-javascript">$1</code></pre>')
      // Inline code
      .replace(/`([^`]*)`/gim, '<code>$1</code>')
      // Blockquotes
      .replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>')
      // Lists
      .replace(/^\d+\. (.*$)/gim, '<li>$1</li>')
      .replace(/^- (.*$)/gim, '<li>$1</li>')
      // Line breaks
      .replace(/\n\n/gim, '</p><p>')
      // Wrap in paragraphs
      .replace(/^(?!<[h|b|l|p|u|b])/gim, '<p>')
      .replace(/(?!<\/[h|b|l|p|u|b>])$/gim, '</p>');
  };
  
  useEffect(() => {
    setIsRendering(true);
    const timer = setTimeout(() => {
      setIsRendering(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [markdown]);
  
  return (
    <div className="space-y-8">
      <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-2xl p-6 transition-all duration-300 border border-white/10 shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
            <Eye className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-white">Markdown Previewer 👀</h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Markdown Editor */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Markdown</h3>
            <textarea
              value={markdown}
              onChange={(e) => {
                setMarkdown(e.target.value);
                playSound('typing');
              }}
              className="w-full h-96 bg-gradient-to-br from-gray-900/80 to-gray-800/80 border border-white/10 rounded-xl p-4 text-gray-200 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
              spellCheck="false"
            />
          </div>
          
          {/* Preview */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Preview</h3>
            <div className="h-96 bg-gradient-to-br from-gray-900/80 to-gray-800/80 border border-white/10 rounded-xl p-4 overflow-auto">
              {isRendering ? (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <Loader className="w-6 h-6 animate-spin mr-2" />
                  Rendering...
                </div>
              ) : (
                <div 
                  className="prose prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: markdownToHtml(markdown) }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Performance Profiler Page
const PerformanceProfilerPage: React.FC = () => {
  const [url, setUrl] = useState('https://example.com');
  const [results, setResults] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { playSound } = useSound();
  
  const analyzePerformance = () => {
    setIsAnalyzing(true);
    setResults(null);
    playSound('generate');
    
    setTimeout(() => {
      // Simulate performance analysis
      const performanceData = {
        overallScore: Math.floor(Math.random() * 40) + 60, // 60-100
        loadTime: Math.floor(Math.random() * 3000) + 500, // 500-3500ms
        firstContentfulPaint: Math.floor(Math.random() * 2000) + 800, // 800-2800ms
        largestContentfulPaint: Math.floor(Math.random() * 4000) + 1500, // 1500-5500ms
        cumulativeLayoutShift: (Math.random() * 0.3).toFixed(3), // 0-0.3
        totalBlockingTime: Math.floor(Math.random() * 800) + 100, // 100-900ms
        suggestions: [
          "Optimize images to reduce load time",
          "Minimize render-blocking resources",
          "Reduce JavaScript execution time",
          "Improve server response time",
          "Use efficient CSS selectors"
        ]
      };
      
      setResults(performanceData);
      setIsAnalyzing(false);
      playSound('success');
    }, 3000);
  };
  
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };
  
  const getScoreBg = (score: number) => {
    if (score >= 90) return 'bg-gradient-to-r from-green-500 to-emerald-600';
    if (score >= 70) return 'bg-gradient-to-r from-yellow-500 to-amber-600';
    return 'bg-gradient-to-r from-red-500 to-rose-600';
  };
  
  return (
    <div className="space-y-8">
      <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-2xl p-6 transition-all duration-300 border border-white/10 shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-lg">
            <BarChart2 className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-white">Performance Profiler ⚡</h2>
        </div>
        
        <div className="space-y-6">
          {/* URL Input */}
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <label className="text-white/80">Website URL:</label>
            <input
              type="text"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                playSound('typing');
              }}
              placeholder="https://example.com"
              className="flex-1 bg-gradient-to-br from-white/5 to-white/10 border border-white/10 rounded-lg px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
            
            <button
              onClick={analyzePerformance}
              disabled={isAnalyzing}
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-yellow-500 to-amber-600 text-white font-medium rounded-lg hover:from-yellow-600 hover:to-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-yellow-500/30"
            >
              {isAnalyzing ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  Analyze Performance
                </>
              )}
            </button>
          </div>
          
          {/* Results */}
          {results && (
            <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 border border-white/10 rounded-xl p-6">
              <div className="flex flex-col items-center mb-6">
                <div className={`text-5xl font-bold ${getScoreColor(results.overallScore)} mb-2`}>
                  {results.overallScore}
                </div>
                <div className="text-white/80">Performance Score</div>
                <div className={`w-32 h-2 rounded-full mt-2 ${getScoreBg(results.overallScore)}`}></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-gradient-to-br from-white/5 to-white/10 rounded-lg border border-white/10">
                  <div className="text-white/80 text-sm mb-1">Load Time</div>
                  <div className="text-white text-xl font-semibold">{results.loadTime}ms</div>
                </div>
                
                <div className="p-4 bg-gradient-to-br from-white/5 to-white/10 rounded-lg border border-white/10">
                  <div className="text-white/80 text-sm mb-1">First Contentful Paint</div>
                  <div className="text-white text-xl font-semibold">{results.firstContentfulPaint}ms</div>
                </div>
                
                <div className="p-4 bg-gradient-to-br from-white/5 to-white/10 rounded-lg border border-white/10">
                  <div className="text-white/80 text-sm mb-1">Largest Contentful Paint</div>
                  <div className="text-white text-xl font-semibold">{results.largestContentfulPaint}ms</div>
                </div>
                
                <div className="p-4 bg-gradient-to-br from-white/5 to-white/10 rounded-lg border border-white/10">
                  <div className="text-white/80 text-sm mb-1">Cumulative Layout Shift</div>
                  <div className="text-white text-xl font-semibold">{results.cumulativeLayoutShift}</div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-bold text-white mb-3">Optimization Suggestions</h3>
                <ul className="space-y-2">
                  {results.suggestions.map((suggestion: string, index: number) => (
                    <li key={index} className="flex items-start gap-2 text-white/80">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Main App Component
const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'error' | 'readme' | 'effects' | 'email' | 'playground' | 'dependency' | 'color' | 'regex' | 'markdown' | 'performance'>('error');
  const [errorInput, setErrorInput] = useState('');
  const [solution, setSolution] = useState<Solution | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { playSound } = useSound();
  
  const handleAnalyze = async (error: string) => {
    setIsLoading(true);
    
    try {
      // Use AI-powered error analysis
      const aiSolution = await analyzeErrorWithAI(error);
      setSolution(aiSolution);
      playSound('success');
    } catch (error) {
      console.error('Error analyzing error:', error);
      // Fallback to basic analysis
      const fallbackSolution = analyzeErrorFallback(error);
      setSolution(fallbackSolution);
      playSound('error');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fallback function for when AI analysis fails
  const analyzeErrorFallback = (errorMessage: string): Solution => {
    if (errorMessage.includes("Cannot read property") && errorMessage.includes("undefined")) {
      return {
        title: "Undefined Property Access Error",
        description: "You're trying to access a property on an undefined object. This is a common JavaScript error when working with APIs or optional data.",
        category: "runtime",
        steps: [
          "Add null checks using optional chaining (?.)",
          "Provide default values using the nullish coalescing operator (??)",
          "Initialize your state with default values",
          "Validate data before accessing properties"
        ],
        codeExample: `// Before (causes error)
const userName = user.profile.name; // user is undefined
// After (fixed)
const userName = user?.profile?.name ?? 'Guest';
// React state example
const [user, setUser] = useState(null); // Bad
// Better approach
const [user, setUser] = useState({
  profile: {
    name: 'Guest'
  }
});`,
        tips: [
          "Always initialize state with sensible defaults",
          "Use TypeScript to catch these errors during development",
          "Consider using a form library like Formik or React Hook Form for form state"
        ],
        resources: [
          { title: "MDN: Optional Chaining", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining" },
          { title: "React: State Management", url: "https://reactjs.org/docs/hooks-state.html" }
        ]
      };
    }
    
    if (errorMessage.includes("Module not found") || errorMessage.includes("Can't resolve")) {
      return {
        title: "Missing Dependency Error",
        description: "The module or package you're trying to import isn't installed in your project.",
        category: "dependency",
        steps: [
          "Install the missing package using npm or yarn",
          "Check for typos in the import statement",
          "Verify the package name is correct",
          "Restart your development server after installing"
        ],
        codeExample: `# Install missing package
npm install package-name
# Or with yarn
yarn add package-name
# If using TypeScript, also install types
npm install @types/package-name
# Example import fix
// Before
import { Button } from 'button-library'; // Package not installed
// After installing
import { Button } from 'button-library';`,
        tips: [
          "Check the package documentation for exact installation instructions",
          "Use package-lock.json or yarn.lock to ensure consistent versions",
          "Delete node_modules and reinstall if issues persist"
        ],
        resources: [
          { title: "npm Documentation", url: "https://docs.npmjs.com/cli/install" },
          { title: "Yarn Documentation", url: "https://yarnpkg.com/en/docs/cli/add" }
        ]
      };
    }
    
    // Default fallback solution
    return {
      title: "Unknown Error",
      description: "We couldn't identify this specific error. Here are some general debugging steps:",
      category: "default",
      steps: [
        "Check the browser console for more details",
        "Review recent code changes",
        "Search for the error message online",
        "Check if all dependencies are properly installed",
        "Try isolating the problematic code"
      ],
      tips: [
        "Break down complex code into smaller parts",
        "Use console.log to track variable values",
        "Check the official documentation for libraries you're using"
      ],
      resources: [
        { title: "MDN Web Docs", url: "https://developer.mozilla.org/" },
        { title: "Stack Overflow", url: "https://stackoverflow.com/" }
      ]
    };
  };
  
  const handleNewError = () => {
    setSolution(null);
    setErrorInput('');
    playSound('click');
  };
  
  const handleTabChange = (tab: 'error' | 'readme' | 'effects' | 'email' | 'playground' | 'dependency' | 'color' | 'regex' | 'markdown' | 'performance') => {
    setActiveTab(tab);
    playSound('click');
  };
  
  const commonErrors = [
    "TypeError: Cannot read property 'map' of undefined",
    "Module not found: Can't resolve 'react'",
    "Unexpected token '<'",
    "Network Error",
    "Maximum update depth exceeded"
  ];
  
  const tabs = [
    { id: 'error', label: 'Debug Error', icon: AlertTriangle, color: 'from-yellow-400 to-orange-500' },
    { id: 'readme', label: 'Generate README', icon: FileText, color: 'from-green-500 to-teal-600' },
    { id: 'effects', label: 'Effects Vault', icon: Code, color: 'from-purple-500 to-pink-600' },
    { id: 'email', label: 'Email Templates', icon: Mail, color: 'from-blue-500 to-indigo-600' },
    { id: 'playground', label: 'Code Playground', icon: Terminal, color: 'from-green-500 to-emerald-600' },
    { id: 'dependency', label: 'Dependency Checker', icon: Package, color: 'from-blue-500 to-indigo-600' },
    { id: 'color', label: 'Color Palette', icon: Palette, color: 'from-purple-500 to-pink-600' },
    { id: 'regex', label: 'Regex Tester', icon: Hash, color: 'from-blue-500 to-indigo-600' },
    { id: 'markdown', label: 'Markdown Preview', icon: Eye, color: 'from-green-500 to-emerald-600' },
    { id: 'performance', label: 'Performance Profiler', icon: BarChart2, color: 'from-yellow-500 to-amber-600' }
  ];
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
            DevBuddy
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg">
            The ultimate developer toolkit with debugging, documentation, code snippets, and productivity tools
          </p>
        </header>
        
        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl p-1 flex flex-wrap justify-center max-w-4xl mx-auto shadow-lg border border-white/10">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id as any)}
                className={`px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-2 m-1 ${
                  activeTab === tab.id 
                    ? `bg-gradient-to-r ${tab.color} text-white shadow-lg` 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
        
        {/* Tab Content */}
        <div className="mb-12">
          {activeTab === 'error' && !solution && (
            <div className="space-y-8">
              <ErrorInput
                value={errorInput}
                onChange={setErrorInput}
                onSubmit={handleAnalyze}
                isAnalyzing={isLoading}
                onClear={() => setErrorInput('')}
              />
              
              {/* Common errors section */}
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-lg">
                <h3 className="text-lg font-semibold mb-4">Common Errors 🔍</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {commonErrors.map((error, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setErrorInput(error);
                        setTimeout(() => handleAnalyze(error), 100);
                      }}
                      className="text-left p-3 bg-gradient-to-br from-white/5 to-white/10 hover:from-white/10 hover:to-white/15 rounded-lg transition-colors text-sm truncate border border-white/10"
                      title={error}
                    >
                      {error}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'error' && solution && (
            <SolutionPage solution={solution} onNewError={handleNewError} />
          )}
          
          {activeTab === 'readme' && <ReadmeGeneratorPage />}
          {activeTab === 'effects' && <EffectsVaultPage />}
          {activeTab === 'email' && <EmailTemplatesPage />}
          {activeTab === 'playground' && <CodePlaygroundPage />}
          {activeTab === 'dependency' && <DependencyCheckerPage />}
          {activeTab === 'color' && <ColorPaletteGeneratorPage />}
          {activeTab === 'regex' && <RegexTesterPage />}
          {activeTab === 'markdown' && <MarkdownPreviewerPage />}
          {activeTab === 'performance' && <PerformanceProfilerPage />}
        </div>
        
        <footer className="text-center text-gray-500 text-sm">
          <p>DevBuddy • All-in-one developer toolkit 🛠️</p>
        </footer>
      </div>
    </div>
  );
};

export default App;