import React, { useState } from 'react';
import { CheckCircle, Copy, ExternalLink, Lightbulb, Code, BookOpen, RotateCcw, AlertCircle, FileText, Save, Download, Filter, Search, Star, Loader2 } from 'lucide-react';

// Sound effect helper
const useSound = () => {
  const playSound = (type: 'click' | 'success' | 'typing') => {
    // In a real implementation, you would play actual sound files
    console.log(`Playing sound: ${type}`);
    // Example: 
    // const audio = new Audio(`/sounds/${type}.mp3`);
    // audio.play().catch(e => console.log("Sound play failed:", e));
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
}

interface ErrorSolutionProps {
  solution: Solution;
  onNewError: () => void;
}

// Error Solution Component
const ErrorSolution: React.FC<ErrorSolutionProps> = ({ solution, onNewError }) => {
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
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      syntax: 'from-red-400 to-pink-500',
      runtime: 'from-orange-400 to-red-500', 
      logic: 'from-blue-400 to-indigo-500',
      network: 'from-green-400 to-teal-500',
      dependency: 'from-purple-400 to-blue-500',
      configuration: 'from-yellow-400 to-orange-500',
      default: 'from-gray-400 to-gray-600'
    };
    return colors[category.toLowerCase()] || colors.default;
  };

  return (
    <div className="w-full space-y-6 animate-fade-in">
      {/* Success header */}
      <div className="text-center p-6 bg-white/10 backdrop-blur-md rounded-2xl">
        <div className="flex items-center justify-center gap-3 mb-3">
          <CheckCircle className="w-8 h-8 text-green-400" />
          <h2 className="text-2xl font-bold text-white">Solution Found! 🎉</h2>
        </div>
        <p className="text-white/80">Here's how to fix your error:</p>
      </div>
      
      {/* Solution card */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 space-y-6">
        {/* Error title and category */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <h3 className="text-xl font-semibold text-white">{solution.title}</h3>
          <span className={`px-3 py-1 rounded-full text-sm font-medium text-white bg-gradient-to-r ${getCategoryColor(solution.category)}`}>
            {solution.category}
          </span>
        </div>
        
        {/* Description */}
        <p className="text-white/80 leading-relaxed">{solution.description}</p>
        
        {/* Solution steps */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-400" />
            <h4 className="text-lg font-semibold text-white">Step-by-Step Solution</h4>
          </div>
          
          <div className="space-y-3">
            {solution.steps.map((step, index) => (
              <div key={index} className="flex items-start gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-200 group">
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
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
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code className="w-5 h-5 text-green-400" />
                <h4 className="text-lg font-semibold text-white">Code Example</h4>
              </div>
              <button
                onClick={() => copyToClipboard(solution.codeExample!, 'code')}
                className="flex items-center gap-2 px-3 py-1 hover:bg-white/10 rounded-lg transition-all duration-200 text-white/70 hover:text-white"
              >
                {copiedCode ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy Code
                  </>
                )}
              </button>
            </div>
            <pre className="bg-gray-900/50 p-4 rounded-xl overflow-x-auto">
              <code className="text-green-300 text-sm font-mono">{solution.codeExample}</code>
            </pre>
          </div>
        )}
        
        {/* Tips */}
        {solution.tips.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-400" />
              <h4 className="text-lg font-semibold text-white">Pro Tips</h4>
            </div>
            <div className="grid gap-2">
              {solution.tips.map((tip, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-yellow-400/10 border border-yellow-400/20 rounded-lg">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-white/90 text-sm">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Resources */}
        {solution.resources.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-lg font-semibold text-white">Learn More</h4>
            <div className="grid gap-2">
              {solution.resources.map((resource, index) => (
                <a
                  key={index}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-all duration-200 text-white/80 hover:text-white group"
                >
                  <ExternalLink className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span>{resource.title}</span>
                </a>
              ))}
            </div>
          </div>
        )}
        
        {/* Action buttons */}
        <div className="flex items-center justify-center gap-4 pt-4">
          <button
            onClick={onNewError}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-600 text-white font-medium rounded-xl hover:from-purple-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-200"
          >
            <RotateCcw className="w-5 h-5" />
            Debug Another Error
          </button>
        </div>
      </div>
    </div>
  );
};

// README Generator Component
const ReadmeGenerator: React.FC = () => {
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
    playSound('click');
    
    // Simulate AI generation with delay
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
        readme += `Contributions are always welcome!\n\n`;
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
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
          AI README Generator
        </h2>
        <p className="text-gray-300">Create beautiful README files for your projects</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 space-y-4">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FileText className="text-green-400" />
            Project Details
          </h3>
          
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
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
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
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
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
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
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
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
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
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
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
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
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
              Include Badges
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
              Table of Contents
            </label>
          </div>
          
          <button
            onClick={generateReadme}
            disabled={isGenerating}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-teal-600 text-white font-medium rounded-xl hover:from-green-600 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Generate README
              </>
            )}
          </button>
        </div>
        
        {/* Preview Section */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <Code className="text-blue-400" />
              README Preview
            </h3>
            
            <div className="flex gap-2">
              <button
                onClick={copyToClipboard}
                disabled={!generatedReadme}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 transition-all duration-200"
              >
                {copied ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Copied!
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
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-teal-600 text-white font-medium rounded-lg hover:from-green-600 hover:to-teal-700 disabled:opacity-50 transition-all duration-200"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
            </div>
          </div>
          
          <div className="bg-gray-900/50 border border-white/10 rounded-xl p-4 flex-1 overflow-auto">
            {isGenerating ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <Loader2 className="w-12 h-12 animate-spin mb-4" />
                <p>AI is generating your README...</p>
              </div>
            ) : generatedReadme ? (
              <pre className="text-gray-200 text-sm whitespace-pre-wrap font-mono">
                {generatedReadme}
              </pre>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <FileText className="w-12 h-12 mb-4" />
                <p>Fill in the form and click "Generate README"</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Effects Vault Component
interface EffectSnippet {
  id: string;
  title: string;
  description: string;
  code: string;
  tags: string[];
  isFavorite: boolean;
}

const EffectsVault: React.FC = () => {
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
      isFavorite: true
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
      isFavorite: true
    },
    {
      id: '3',
      title: 'Debounce Hook',
      description: 'Debounce user input for performance optimization',
      code: `import { useState, useEffect } from 'react';

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}`,
      tags: ['debounce', 'performance', 'input'],
      isFavorite: false
    },
    {
      id: '4',
      title: 'LocalStorage Hook',
      description: 'Sync state with localStorage automatically',
      code: `import { useState, useEffect } from 'react';

function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
}`,
      tags: ['localstorage', 'persistence', 'hook'],
      isFavorite: true
    },
    {
      id: '5',
      title: 'Window Dimensions Hook',
      description: 'Track window dimensions on resize',
      code: `import { useState, useEffect } from 'react';

function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    function handleResize() {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowDimensions;
}`,
      tags: ['resize', 'window', 'dimensions'],
      isFavorite: false
    },
    {
      id: '6',
      title: 'Interval Hook',
      description: 'Set up and clean up intervals properly',
      code: `import { useState, useEffect } from 'react';

function useInterval(callback, delay) {
  useEffect(() => {
    if (delay !== null) {
      const id = setInterval(callback, delay);
      return () => clearInterval(id);
    }
  }, [callback, delay]);
}`,
      tags: ['timer', 'interval', 'hook'],
      isFavorite: false
    }
  ]);

  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { playSound } = useSound();

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

  const generateNewEffect = () => {
    setIsGenerating(true);
    playSound('click');
    
    // Simulate AI generation with delay
    setTimeout(() => {
      const newSnippet: EffectSnippet = {
        id: Date.now().toString(),
        title: 'Custom Hook Template',
        description: 'A template for creating custom React hooks',
        code: `import { useState, useEffect } from 'react';

function useCustomHook(initialValue) {
  const [state, setState] = useState(initialValue);

  // Add your effect logic here
  useEffect(() => {
    // Effect code
  }, [state]);

  return [state, setState];
}`,
        tags: ['template', 'custom', 'hook'],
        isFavorite: false
      };
      
      setSnippets([newSnippet, ...snippets]);
      setIsGenerating(false);
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
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
          AI Effects Vault
        </h2>
        <p className="text-gray-300">A collection of reusable React useEffect patterns</p>
      </div>

      {/* Generate New Effect Button */}
      <div className="flex justify-center">
        <button
          onClick={generateNewEffect}
          disabled={isGenerating}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-medium rounded-xl hover:from-purple-600 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              AI is creating...
            </>
          ) : (
            <>
              <Code className="w-5 h-5" />
              Generate New Effect
            </>
          )}
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
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
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
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
              className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
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
        <div className="space-y-4">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Star className="text-yellow-400 fill-yellow-400" />
            Favorite Effects
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
        <h3 className="text-xl font-semibold">All Effects</h3>
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
          <div className="text-center py-8 bg-white/10 backdrop-blur-md rounded-2xl">
            <p className="text-gray-400">No effects found matching your search</p>
          </div>
        )}
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
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 flex flex-col h-full">
      <div className="flex justify-between items-start mb-3">
        <h4 className="text-lg font-semibold text-white">{snippet.title}</h4>
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
          <span key={tag} className="px-2 py-1 bg-white/5 text-white/70 text-xs rounded-full">
            {tag}
          </span>
        ))}
      </div>
      
      <div className="relative">
        <pre className="bg-gray-900/50 p-3 rounded-lg overflow-x-auto text-sm text-gray-200 font-mono max-h-40">
          {snippet.code}
        </pre>
        <button
          onClick={() => onCopy(snippet.id, snippet.code)}
          className="absolute top-2 right-2 p-1.5 bg-white/10 hover:bg-white/20 rounded-md transition-colors"
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

// Main App Component
const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'error' | 'readme' | 'effects'>('error');
  const [errorInput, setErrorInput] = useState('');
  const [solution, setSolution] = useState<Solution | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { playSound } = useSound();

  const analyzeError = (errorMessage: string): Solution => {
    // Real solutions for common errors
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

  const handleAnalyze = () => {
    if (!errorInput.trim()) return;
    
    setIsLoading(true);
    playSound('click');
    
    // Simulate API call delay
    setTimeout(() => {
      const solution = analyzeError(errorInput);
      setSolution(solution);
      setIsLoading(false);
      playSound('success');
    }, 800);
  };

  const handleNewError = () => {
    setSolution(null);
    setErrorInput('');
    playSound('click');
  };

  const handleTabChange = (tab: 'error' | 'readme' | 'effects') => {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            DevTools Suite
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            All-in-one development toolkit for debugging, documentation, and code snippets
          </p>
        </header>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-1 flex">
            <button
              onClick={() => handleTabChange('error')}
              className={`px-6 py-3 rounded-lg transition-all duration-200 flex items-center gap-2 ${
                activeTab === 'error' 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <AlertCircle className="w-5 h-5" />
              Debug Error
            </button>
            
            <button
              onClick={() => handleTabChange('readme')}
              className={`px-6 py-3 rounded-lg transition-all duration-200 flex items-center gap-2 ${
                activeTab === 'readme' 
                  ? 'bg-gradient-to-r from-green-500 to-teal-600 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <FileText className="w-5 h-5" />
              Generate README
            </button>
            
            <button
              onClick={() => handleTabChange('effects')}
              className={`px-6 py-3 rounded-lg transition-all duration-200 flex items-center gap-2 ${
                activeTab === 'effects' 
                  ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Code className="w-5 h-5" />
              Effects Vault
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="mb-12">
          {activeTab === 'error' && !solution && (
            <div className="space-y-8">
              {/* Error input section */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <AlertCircle className="text-red-400" />
                  Paste Your Error Message
                </h2>
                
                <textarea
                  value={errorInput}
                  onChange={(e) => {
                    setErrorInput(e.target.value);
                    playSound('typing');
                  }}
                  placeholder="Paste the full error message here..."
                  className="w-full h-40 bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
                
                <div className="flex justify-between items-center mt-4">
                  <button
                    onClick={handleAnalyze}
                    disabled={!errorInput.trim() || isLoading}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-xl hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="animate-spin h-5 w-5 text-white" />
                        Analyzing...
                      </span>
                    ) : 'Analyze Error'}
                  </button>
                  
                  <button
                    onClick={() => setErrorInput('')}
                    disabled={!errorInput}
                    className="px-4 py-2 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
                  >
                    Clear
                  </button>
                </div>
              </div>

              {/* Common errors section */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
                <h3 className="text-lg font-semibold mb-4">Common Errors</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {commonErrors.map((error, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setErrorInput(error);
                        setTimeout(handleAnalyze, 100);
                      }}
                      className="text-left p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-sm truncate"
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
            <ErrorSolution solution={solution} onNewError={handleNewError} />
          )}

          {activeTab === 'readme' && <ReadmeGenerator />}
          {activeTab === 'effects' && <EffectsVault />}
        </div>

        <footer className="text-center text-gray-500 text-sm">
          <p>DevTools Suite • All-in-one development toolkit</p>
        </footer>
      </div>
    </div>
  );
};

export default App;