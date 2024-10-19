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
import {X, Save, RotateCcw } from 'lucide-react'
import './CodeEditor.css';
import { useParams } from 'react-router-dom';

function CodeEditor( {problemId: problemIdProp, parentCallback } ) {
  const { problemId: problemIdFromUrl } = useParams();  // Fetch problemId from URL
  // Use the prop value if available, otherwise fall back to the URL parameter
  const problemId = problemIdProp || problemIdFromUrl;

  const [language, setLanguage] = useState('python');
  const [value, setValue] = useState("print('Hello, world!')");
  const [theme, setTheme] = useState(dracula);
  const [codeResult, setCodeResult] = useState(null);

  const handleLanguageChange = (e) => {
    const selectedLanguage = e.target.value;
    setLanguage(selectedLanguage);
    const token = localStorage.getItem('accessToken');

    fetch(`http://localhost:8000/get-initial-code/${problemId}/${selectedLanguage}`, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
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

  const runCode = () => {
    const token = localStorage.getItem('accessToken');

    const payload = {
      code: value,
      language: language,
      problem_id: problemId
    };

    fetch(`http://localhost:8000/execute-problem-code/`, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setCodeResult(data);
      })
      .catch(error => {
        console.error('Error fetching categories:', error);
      });
  };

  const renderTestResults = (testResults) => {
    return testResults.map((result, index) => {
      const [params, expected, actual] = result.split('|');
      return (
        <div key={index} className="mb-2 p-2 bg-green-100 rounded text-black">
          <div className="font-semibold">Test Case {index + 1}:</div>
          <div>Parámetros: {params}</div>
          <div>Salida esperada: {expected}</div>
          <div>Salida actual: {actual}</div>
        </div>
      );
    });
  };

  return (
    <div className="content w-full flex flex-col" id="right">

      <div className="flex justify-between">
      <div className="content-header">
        <div className="select-dropdown text-[#050054]">
          <select id="language-selector" value={language} onChange={handleLanguageChange}>
            <option value="CPP">C++</option>
            <option value="JAVA">Java</option>
            <option value="C">C</option>
            <option value="PYTHON">Python</option>
          </select>
        </div>

        <div className="select-dropdown text-[#050054]" >
          <select id="theme-select" value={theme} onChange={(e) => setTheme(e.target.value)}>
            <option value="githubLight">GitHub Light</option>
            <option value="githubDark">GitHub Dark</option>
            <option value="dracula">Dracula</option>
            <option value="darcula">Darcula</option>
            <option value="xcodeLight">Xcode Light</option>
            <option value="xcodeDark">Xcode Dark</option>
          </select>
        </div>
      </div>

      <div className='flex justify-end'>
        <div className="flex flex-row space-x-2 ">
          <button  className="icons flex">
            <Save color='#050054'/>
          </button>
          <button  className="icons flex" onClick={() => ("print('Hello, world!')")}>
            <RotateCcw color='#050054'/>
          </button>
          <button className="icons flex" onClick={() => alert('Code saved!')}>
            <X color='#050054'/>
          </button>
        </div>
      </div>

      </div>

      <div className="working-space">
        <div className="editor-area">
          <CodeMirror
            value={value}
            height="400px"
            theme={getTheme(theme)}
            extensions={[getLanguageExtension()]}
            onChange={(val) => {setValue(val); parentCallback(val);}}
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
            <div className="test-area overflow-y-scroll">
              {codeResult ? (
                <div className={`p-4 rounded-lg`}>
                  <h3 className={`text-lg font-bold ${codeResult.isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                    {codeResult.isCorrect ? '¡Todas las pruebas aprobadas!' : 'Algunas pruebas fallaron.'}
                  </h3>
                  <p className="text-gray-700">
                    Test cases: {codeResult.badTestcase === null ? 
                      `${codeResult.totalTestcases}/${codeResult.totalTestcases}` : 
                      `${codeResult.badTestcase}/${codeResult.totalTestcases}`}
                  </p>
                  <div className="mt-4">
                    <h4 className="font-semibold mb-2 text-black" >Resultados de las pruebas:</h4>
                    {renderTestResults(codeResult.testResults)}
                  </div>
                </div>
              ) : (
                <div id="placeholder">Ejectua tu código para ver los resultados</div>
              )}
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
}

export default CodeEditor;