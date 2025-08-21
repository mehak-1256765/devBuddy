interface Solution {
  title: string;
  description: string;
  category: string;
  steps: string[];
  codeExample?: string;
  tips: string[];
  resources: { title: string; url: string }[];
}

export const parseError = (errorText: string): Solution => {
  const lowerError = errorText.toLowerCase();

  // JavaScript/TypeScript Errors
  if (lowerError.includes("cannot read property") || lowerError.includes("cannot read properties")) {
    return {
      title: "Cannot Read Property Error",
      description: "This error occurs when you try to access a property on an undefined or null value. It's one of the most common JavaScript errors.",
      category: "Runtime",
      steps: [
        "Check if the variable is defined before accessing its properties",
        "Use optional chaining (?.) to safely access nested properties",
        "Add null/undefined checks with if statements or ternary operators",
        "Use default values when destructuring objects",
        "Debug by logging the variable to see its actual value"
      ],
      codeExample: `// Before (causes error)
const user = null;
console.log(user.name); // Error!

// After (safe access)
const user = null;
console.log(user?.name); // undefined (no error)

// Or with a check
if (user && user.name) {
  console.log(user.name);
}`,
      tips: [
        "Use TypeScript for better type checking and error prevention",
        "Initialize variables with default values when possible",
        "Use Array.isArray() before calling array methods like .map()"
      ],
      resources: [
        { title: "MDN - Working with Objects", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_Objects" },
        { title: "Optional Chaining Guide", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining" }
      ]
    };
  }

  if (lowerError.includes("syntaxerror") || lowerError.includes("unexpected token")) {
    return {
      title: "Syntax Error - Unexpected Token",
      description: "Syntax errors occur when JavaScript can't parse your code due to incorrect syntax. Check for missing brackets, quotes, or semicolons.",
      category: "Syntax",
      steps: [
        "Check for missing or extra brackets, parentheses, or braces",
        "Ensure all strings are properly closed with matching quotes",
        "Verify that all statements end with semicolons (if required)",
        "Look for missing commas in object literals or arrays",
        "Use a code formatter like Prettier to catch formatting issues"
      ],
      codeExample: `// Common syntax errors and fixes:

// Missing closing brace
function myFunction() {
  console.log("Hello");
} // Add this closing brace

// Unclosed string
const message = "Hello World"; // Add closing quote

// Missing comma in object
const obj = {
  name: "John",
  age: 30 // Add comma here if more properties follow
};`,
      tips: [
        "Use an IDE with syntax highlighting and error detection",
        "Install ESLint to catch syntax errors as you type",
        "Use proper indentation to spot missing brackets easily"
      ],
      resources: [
        { title: "MDN - SyntaxError", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SyntaxError" },
        { title: "ESLint Setup Guide", url: "https://eslint.org/docs/user-guide/getting-started" }
      ]
    };
  }

  if (lowerError.includes("referenceerror") || lowerError.includes("is not defined")) {
    return {
      title: "ReferenceError - Variable Not Defined",
      description: "This error occurs when you try to use a variable that hasn't been declared or is out of scope.",
      category: "Runtime",
      steps: [
        "Check if the variable is declared before using it",
        "Verify the variable name spelling and case sensitivity",
        "Ensure the variable is in the correct scope",
        "Import the variable/function if it's from another module",
        "Check if the variable is declared after where you're using it"
      ],
      codeExample: `// Error: variable not declared
console.log(myVariable); // ReferenceError!

// Fix: declare the variable first
let myVariable = "Hello";
console.log(myVariable); // Works!

// Or import from another file
import { myVariable } from './other-file.js';`,
      tips: [
        "Use 'const' by default, 'let' when you need to reassign",
        "Avoid using 'var' in modern JavaScript",
        "Be careful with hoisting - functions are hoisted, but let/const are not"
      ],
      resources: [
        { title: "MDN - ReferenceError", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ReferenceError" },
        { title: "JavaScript Scoping Guide", url: "https://developer.mozilla.org/en-US/docs/Glossary/Scope" }
      ]
    };
  }

  if (lowerError.includes("typeerror") || lowerError.includes("is not a function")) {
    return {
      title: "TypeError - Not a Function",
      description: "This error occurs when you try to call something that isn't a function, or when the variable is undefined/null.",
      category: "Runtime",
      steps: [
        "Check if the variable actually contains a function",
        "Verify the function name spelling and case sensitivity",
        "Ensure the function is defined before calling it",
        "Check if you're calling a method on the correct object type",
        "Look for typos in method names (e.g., 'map' vs 'Map')"
      ],
      codeExample: `// Common causes and fixes:

// Undefined function
myFunction(); // Error if myFunction is undefined

// Fix: define the function first
function myFunction() {
  console.log("Hello!");
}
myFunction(); // Works!

// Wrong method name
const arr = [1, 2, 3];
arr.Map(x => x * 2); // Error! Should be 'map'

// Fix: correct method name
arr.map(x => x * 2); // Works!`,
      tips: [
        "Use console.log to check what type of value you're working with",
        "Check the browser console for the exact line where the error occurs",
        "Use typeof operator to verify if something is a function"
      ],
      resources: [
        { title: "MDN - TypeError", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypeError" },
        { title: "JavaScript Functions Guide", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions" }
      ]
    };
  }

  if (lowerError.includes("404") || lowerError.includes("not found")) {
    return {
      title: "404 Not Found Error",
      description: "The requested resource could not be found on the server. This is usually a URL or file path issue.",
      category: "Network",
      steps: [
        "Check the URL or file path for typos",
        "Verify that the file or endpoint actually exists",
        "Ensure the server is running and accessible",
        "Check if the file has been moved or renamed",
        "Verify the correct HTTP method is being used (GET, POST, etc.)"
      ],
      codeExample: `// Common 404 scenarios and fixes:

// Wrong file path
import Component from './Component'; // Missing .js/.ts extension

// Fix: include the extension or configure resolver
import Component from './Component.js';

// Wrong API endpoint
fetch('/api/user'); // Wrong endpoint

// Fix: use correct endpoint
fetch('/api/users');`,
      tips: [
        "Use your browser's Network tab to see the exact failing request",
        "Check your server logs for more details about why the resource isn't found",
        "Use relative vs absolute paths correctly based on your setup"
      ],
      resources: [
        { title: "HTTP Status Codes Guide", url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Status" },
        { title: "Debugging Network Issues", url: "https://developer.chrome.com/docs/devtools/network/" }
      ]
    };
  }

  if (lowerError.includes("cors") || lowerError.includes("cross-origin")) {
    return {
      title: "CORS (Cross-Origin Resource Sharing) Error",
      description: "CORS errors occur when a web page tries to access a resource from a different domain, port, or protocol without proper permissions.",
      category: "Network",
      steps: [
        "Add proper CORS headers on your server",
        "Use a proxy during development to avoid CORS issues",
        "Configure your API to accept requests from your domain",
        "Use JSONP for simple GET requests (legacy approach)",
        "Consider using a serverless function as a proxy"
      ],
      codeExample: `// Server-side CORS fix (Express.js example)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Or use the cors middleware
const cors = require('cors');
app.use(cors());`,
      tips: [
        "CORS is a browser security feature - it doesn't affect server-to-server requests",
        "During development, you can disable CORS in Chrome with --disable-web-security flag",
        "Always fix CORS properly on the server side for production"
      ],
      resources: [
        { title: "MDN - CORS Guide", url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS" },
        { title: "Express CORS Middleware", url: "https://expressjs.com/en/resources/middleware/cors.html" }
      ]
    };
  }

  if (lowerError.includes("npm") || lowerError.includes("module not found") || lowerError.includes("cannot resolve")) {
    return {
      title: "Module Not Found / NPM Error",
      description: "This error occurs when trying to import a module that isn't installed or can't be found in the specified path.",
      category: "Dependency",
      steps: [
        "Install the missing package using npm or yarn",
        "Check if the package name is spelled correctly",
        "Verify the import path is correct",
        "Clear npm cache and reinstall dependencies",
        "Check if the package supports your Node.js version"
      ],
      codeExample: `// Install missing packages
npm install package-name

// Or with yarn
yarn add package-name

// Check if import path is correct
import React from 'react'; // Correct
import React from 'React'; // Wrong - case sensitive

// Relative imports need proper paths
import Component from './Component'; // Same directory
import Component from '../Component'; // Parent directory`,
      tips: [
        "Use 'npm list' to see installed packages and their versions",
        "Check package.json to ensure the dependency is listed",
        "Try deleting node_modules and package-lock.json, then reinstall"
      ],
      resources: [
        { title: "NPM Documentation", url: "https://docs.npmjs.com/" },
        { title: "Module Resolution Guide", url: "https://nodejs.org/api/modules.html#modules_module_resolution_algorithm" }
      ]
    };
  }

  // Generic fallback solution
  return {
    title: "General Error Analysis",
    description: "I've detected an error in your code. While I couldn't identify the specific type, here are some general debugging steps that often help resolve issues.",
    category: "Logic",
    steps: [
      "Read the error message carefully - it often tells you exactly what's wrong",
      "Check the line number mentioned in the error",
      "Look for typos in variable names, function names, or syntax",
      "Add console.log statements to track variable values",
      "Test your code in smaller pieces to isolate the problem",
      "Check if all required dependencies are installed and imported"
    ],
    codeExample: `// General debugging techniques:

// 1. Add logging to see what's happening
console.log('Variable value:', myVariable);

// 2. Use try-catch for error handling
try {
  // Your code here
  riskyOperation();
} catch (error) {
  console.error('Error occurred:', error);
}

// 3. Check types before operations
if (typeof myVar === 'string') {
  // Safe to use string methods
  myVar.toUpperCase();
}`,
    tips: [
      "Use your browser's developer tools to debug step by step",
      "Search for the exact error message online - others have likely faced the same issue",
      "Consider using a debugger or adding breakpoints to inspect your code"
    ],
    resources: [
      { title: "MDN - Debugging JavaScript", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Debugging" },
      { title: "Chrome DevTools Guide", url: "https://developers.google.com/web/tools/chrome-devtools" },
      { title: "Stack Overflow", url: "https://stackoverflow.com/" }
    ]
  };
};