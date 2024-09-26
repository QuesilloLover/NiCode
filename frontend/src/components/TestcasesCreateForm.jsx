import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ReactMarkdown from 'react-markdown';

const TestCaseAddPage = () => {
    const { problemId } = useParams();
    const [problem, setProblem] = useState(null);
    const [testCase, setTestCase] = useState({ input: {}, output: "" }); // Initialize inputs as an object
    const [testCases, setTestCases] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');

        fetch(`http://localhost:8000/problem/${problemId}/`, {
            method: 'GET',
            headers: {
                'Authorization': `Token ${token}`,
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Fetched problem:', data);
            setProblem(data);
        })
        .catch(error => console.error('Error fetching problem:', error));
    }, [problemId]);

    const handleInputChange = (index, value) => {
        setTestCase(prevTestCase => ({
            ...prevTestCase,
            input: {
                ...prevTestCase.input,
                [problem.parameters[index].name]: value
            }
        }));
    };

    const handleOutputChange = (value) => {
        setTestCase(prevTestCase => ({
            ...prevTestCase,
            output: value
        }));
    };

    const handleAddTestCase = (e) => {
        e.preventDefault();

        // Convert inputs to the desired string format
        const inputStr = Object.entries(testCase.input)
            .map(([key, value]) => `${value}`)
            .join('|');

        const newTestCase = {
            input: inputStr,  // Use the formatted string for inputs
            output: testCase.output // Assuming you're also capturing the output
        };

        setTestCases([...testCases, newTestCase]);
        setTestCase({ input: {}, output: "" }); // Resetting the test case form
    };

    const handleSaveTestCases = (event) => {
        event.preventDefault();
        
        const data = {
            problem: problemId,
            test_cases: testCases
        };

        console.log(data)
    
        const token = localStorage.getItem('accessToken');
            const url = `http://localhost:8000/upload-testcases/${problemId}/`;
    
        fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Token ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Success:', data); // Handle the response data
            alert('Testcases guardados correctamente');
        })
        .catch(error => {
            console.error('Error:', error);
        });


        console.log('Saving test cases:', testCases);
    };

    return (
        <div className="container mx-auto p-4">
            {problem ? (
                <div className="bg-gray-800 text-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold mb-4">{problem.name}</h2>
                    <p className="mb-2"><strong>Function Name:</strong> {problem.function_name}</p>
                    <p className="mb-4"><strong>Description:</strong> <ReactMarkdown>{problem.description}</ReactMarkdown></p>
                    
                    <form onSubmit={handleAddTestCase} className="space-y-4">
                        {problem.parameters.map((param, index) => (
                            <div key={index} className="flex items-center">
                                <Label className="text-white w-1/4">{param.name} ({param.type})</Label>
                                <Input
                                    type={param.type === 'int' ? 'number' : 'text'}
                                    placeholder={`Enter value for ${param.name}`}
                                    onChange={(e) => handleInputChange(index, e.target.value)}
                                    required
                                    className="text-black w-3/4 p-2 border border-gray-300 rounded-md"
                                />
                            </div>
                        ))}
                        <div className="flex items-center">
                            <Label className="text-white w-1/4">Output</Label>
                            <Input
                                type="text"
                                placeholder="Enter expected output"
                                onChange={(e) => handleOutputChange(e.target.value)}
                                required
                                className="text-black w-3/4 p-2 border border-gray-300 rounded-md"
                            />
                        </div>
                        <Button type="submit" className="w-full bg-blue-600 text-white font-bold p-2 rounded hover:bg-blue-700">
                            Add Test Case
                        </Button>
                    </form>

                    <div className="mt-6">
                        <h3 className="text-lg font-semibold">Test Cases:</h3>
                        <ul className="space-y-2">
                            {testCases.map((testCase, index) => (
                                <li key={index} className="bg-gray-700 p-2 rounded">
                                    {JSON.stringify(testCase)}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <Button onClick={handleSaveTestCases} className="mt-4 w-full bg-green-600 text-white font-bold p-2 rounded hover:bg-green-700">
                        Save Test Cases
                    </Button>
                </div>
            ) : (
                <p className="text-white">Loading problem details...</p>
            )}
        </div>
    );
};

export default TestCaseAddPage;
