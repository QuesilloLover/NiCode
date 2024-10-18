import React, { useState } from 'react';
import CodeEditor from './CodeEditor';

function TwoSumScreen() {
  const [nums, setNums] = useState([2, 7, 11, 15]);
  const [target, setTarget] = useState(9);
  const [result, setResult] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const map = {};
    for (let i = 0; i < nums.length; i++) {
      const complement = target - nums[i];
      if (map[complement] !== undefined) {
        setResult([map[complement], i]);
        return;
      }
      map[nums[i]] = i;
    }
  };

  return (
    <div className="min-h-screen bg-gray-800 text-white p-6 flex flex-col md:flex-row">
      {/* Columna izquierda - Texto */}
      <div className="w-full md:w-1/2 lg:w-1/3 p-4">
        <h1 className="text-3xl font-bold mb-4">1. Two Sum</h1>
        <p className="text-gray-400 mb-6">
          Given an array of integers <strong>nums</strong> and an integer <strong>target</strong>, return the indices of the two numbers such that they add up to the target.
        </p>
      </div>

      {/* Columna derecha - Dos contenedores con tamaño igual */}
      <div className="w-full md:w-1/2 lg:w-2/3 p-4 flex flex-col space-y-4">
        {/* Fila 1 - Editor de código */}
        <div className="flex-grow w-full p-6 bg-gray-900 rounded-lg shadow-lg flex flex-col justify-between">
          {/* <h2 className="text-xl font-bold mb-2">Editor de Código</h2>
          <div className="bg-gray-800 p-4 rounded-lg font-mono text-sm text-green-400 flex-grow">
            <pre>
              <code>
                {`class Solution {\n`} 
                {`  public int[] twoSum(int[] nums, int target) {\n`}
                {`    // Add your logic here\n`}
                {`  }\n`}
                {`}`}
              </code>
            </pre>
          </div> */}
          <CodeEditor/>
        </div>

        {/* Fila 2 - Resultados y Casos de Prueba */}
        <div className="flex-grow w-full p-4 bg-gray-900 rounded-lg shadow-lg flex flex-col justify-between">
          {result.length > 0 && (
            <div className="bg-gray-700 p-4 rounded-lg mb-4">
              <h2 className="text-xl font-bold mb-2">Output</h2>
              <p>Indices: [{result[0]}, {result[1]}]</p>
            </div>
          )}
          <div>
            <h2 className="text-xl font-bold mb-2">Test Cases</h2>
            <div className="bg-gray-700 p-4 rounded-lg mb-4">
              <h3 className="text-lg font-bold">Case 2</h3>
              <p className="text-gray-300">nums = [3, 2, 4], target = 6</p>
              <p className="text-green-500">Output: [1, 2]</p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <h3 className="text-lg font-bold">Case 3</h3>
              <p className="text-gray-300">nums = [3, 3], target = 6</p>
              <p className="text-green-500">Output: [0, 1]</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TwoSumScreen;



