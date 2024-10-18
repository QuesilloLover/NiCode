import React, { useState, useEffect } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { cpp } from '@codemirror/lang-cpp';
import { java } from '@codemirror/lang-java';
import { python } from '@codemirror/lang-python';
import { githubLight, githubDark } from '@uiw/codemirror-theme-github';
import { dracula } from '@uiw/codemirror-theme-dracula';
import { darcula } from '@uiw/codemirror-theme-darcula';
import { xcodeLight, xcodeDark } from '@uiw/codemirror-theme-xcode';
import './CodeEditor.css';

function CodeEditor() {
  const [language, setLanguage] = useState('python'); // default language
  const [value, setValue] = useState("print('Hello, world!')"); // initial code
  const [theme, setTheme] = useState(dracula); // default theme
  const [codeResult, setCodeResult] = useState("Ejecuta tu código para ver los resultados");


  const handleLanguageChange = (e) => {
    const selectedLanguage = e.target.value;
    setLanguage(selectedLanguage);
    const token = localStorage.getItem('accessToken');

    // Harcoded value
    const problem_id = 14;
    // TODO: fetch all and store them

    fetch(`http://localhost:8000/get-initial-code/${problem_id}/${selectedLanguage}`, {
        method: 'GET',
        headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json',
        },
    }).then(response => response.json())    
    .then(data => {
      console.log(data)
      setValue(data.code);
    })
    .catch(error => {
      console.error('Error fetching categories:', error);
    });   


  };

  const getLanguageExtension = () => {
    switch (language) {
      case 'python':
        return python();
        case 'cpp':
            return cpp(); 
        case 'java':
            return java(); 
        case 'javascript':
            return javascript(); 
      default:
        return python();
    }
  };

  // Function to change the theme dynamically
  const getTheme = (theme) => {

    switch (theme) {
      case 'githubLight':
        return githubLight;
      case 'githubDark':
        return githubDark;
      case 'dracula':
        return dracula;
      case 'darcula':
        return darcula;
      case 'xcodeLight':
        return xcodeLight;
      case 'xcodeDark':
        return xcodeDark;
      default:
        return githubLight;
    }
  };

  // Function to handle code execution (mock function)
  const runCode = () => {
    const token = localStorage.getItem('accessToken');

    const payload = {
      code: value,       
      language: language 
    };
    
    fetch(`http://localhost:8000/execute-code/`, {
      method: 'POST',
      headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }).then(response => response.json())    
    .then(data => {
      setCodeResult(`Output: ${data.output}`);
    })
    .catch(error => {
      console.error('Error fetching categories:', error);
    });   

  };

 
  return (
    <div className="content w-full" id="right">
      <div className="content-header ">
        <div className="select-dropdown text-green-700">
          <select id="language-selector" value={language} onChange={handleLanguageChange}>
            <option value="CPP">C++</option>
            <option value="JAVA">Java</option>
            <option value="C">C</option>
            <option value="PYTHON">Python</option>
          </select>
        </div>

        <div className="select-dropdown text-green-700">
          <select id="theme-select" value={theme} onChange={(e) => setTheme(e.target.value)}>
            <option value="githubLight">GitHub Light</option>
            <option value="githubDark">GitHub Dark</option>
            <option value="dracula">Dracula</option>
            <option value="darcula">Darcula</option>
            <option value="xcodeLight">Xcode Light</option>
            <option value="xcodeDark">Xcode Dark</option>
          </select>
        </div>

        <div className="icons text-stone-950">
          <button className="icon" id="screen">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/>
            </svg>
          </button>
          <button className="icon" onClick={() => setValue("print('Hello, world!')")}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-rotate-ccw"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>
            </svg>
          </button>
          <button className="icon" onClick={() => alert('Code saved!')}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-save"><path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"/><path d="M7 3v4a1 1 0 0 0 1 1h7"/>
            </svg>
          </button>
        </div>
      </div>

      <div className="working-space">
        <div className="editor-area">
          {/* CodeMirror editor component */}
          <CodeMirror
            value={value}
            height="400px"
            theme={getTheme(theme)}
            extensions={[getLanguageExtension()]}
            onChange={(val) => setValue(val)}
          />
        </div>

        <div className="resize-bar vertical">
          <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512">
            <path d="M8 256a56 56 0 1 1 112 0A56 56 0 1 1 8 256zm160 0a56 56 0 1 1 112 0 56 56 0 1 1 -112 0zm216-56a56 56 0 1 1 0 112 56 56 0 1 1 0-112z"/>
          </svg>
        </div>

        <div className="console">
          <div className="console-area">
            <div className="test-row"></div>
            <div className="test-area">
              <div id="placeholder">{codeResult}</div>
            </div>
          </div>
          <div className="button-row">
            <div className="button-container">
              <button className="action-button" id="run" onClick={runCode}>
                Ejecutar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;