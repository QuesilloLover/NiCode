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
    const problem_id = 26;
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
      language: language,
      // Hardcoded
      problem_id: 26
    };
    
    fetch(`http://localhost:8000/execute-problem-code/`, {
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
    <div className="content" id="right">
      <div className="content-header">
        <div className="select-dropdown">
          <select id="language-selector" value={language} onChange={handleLanguageChange}>
            <option value="CPP">C++</option>
            <option value="JAVA">Java</option>
            <option value="C">C</option>
            <option value="PYTHON">Python</option>
          </select>
        </div>

        <div className="select-dropdown">
          <select id="theme-select" value={theme} onChange={(e) => setTheme(e.target.value)}>
            <option value="githubLight">GitHub Light</option>
            <option value="githubDark">GitHub Dark</option>
            <option value="dracula">Dracula</option>
            <option value="darcula">Darcula</option>
            <option value="xcodeLight">Xcode Light</option>
            <option value="xcodeDark">Xcode Dark</option>
          </select>
        </div>

        <div className="icons">
          <button className="icon" id="screen">
            <svg xmlns="http://www.w3.org/2000/svg" height="1.5em" viewBox="0 0 512 512">
              <path d="M200 32H56C42.7 32 32 42.7 32 56V200c0 9.7 5.8 18.5 14.8 22.2s19.3 1.7 26.2-5.2l40-40 79 79-79 79L73 295c-6.9-6.9-17.2-8.9-26.2-5.2S32 302.3 32 312V456c0 13.3 10.7 24 24 24H200c9.7 0 18.5-5.8 22.2-14.8s1.7-19.3-5.2-26.2l-40-40 79-79 79 79-40 40c-6.9 6.9-8.9 17.2-5.2 26.2s12.5 14.8 22.2 14.8H456c13.3 0 24-10.7 24-24V312c0-9.7-5.8-18.5-14.8-22.2s-19.3-1.7-26.2 5.2l-40 40-79-79 79-79 40 40c6.9 6.9 17.2 8.9 26.2 5.2s14.8-12.5 14.8-22.2V56c0-13.3-10.7-24-24-24H312c-9.7 0-18.5 5.8-22.2 14.8s-1.7 19.3 5.2 26.2l40 40-79 79-79-79 40-40c6.9-6.9 8.9-17.2 5.2-26.2S209.7 32 200 32z"/>
            </svg>
          </button>
          <button className="icon" onClick={() => setValue("print('Hello, world!')")}>
            <svg xmlns="http://www.w3.org/2000/svg" height="1.5em" viewBox="0 0 512 512">
              <path d="M463.5 224H472c13.3 0 24-10.7 24-24V72c0-9.7-5.8-18.5-14.8-22.2s-19.3-1.7-26.2 5.2L413.4 96.6c-87.6-86.5-228.7-86.2-315.8 1c-87.5 87.5-87.5 229.3 0 316.8s229.3 87.5 316.8 0c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0c-62.5 62.5-163.8 62.5-226.3 0s-62.5-163.8 0-226.3c62.2-62.2 162.7-62.5 225.3-1L327 183c-6.9 6.9-8.9 17.2-5.2 26.2s12.5 14.8 22.2 14.8H463.5z"/>
            </svg>
          </button>
          <button className="icon" onClick={() => alert('Code saved!')}>
            <svg xmlns="http://www.w3.org/2000/svg" height="1.5em" viewBox="0 0 448 512">
              <path d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V173.3c0-17-6.7-33.3-18.7-45.3L352 50.7C340 38.7 323.7 32 306.7 32H64zm0 96c0-17.7 14.3-32 32-32H288c17.7 0 32 14.3 32 32v64c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V128zM224 288a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"/>
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