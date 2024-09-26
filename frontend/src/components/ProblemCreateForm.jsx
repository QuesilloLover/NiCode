import React, { useState, useEffect } from 'react';
import NiCode from '../assets/NiCode.png';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ReactMarkdown from 'react-markdown';

const ProblemCreateForm = () => {
    const [problems, setProblems] = useState([]);
    const [name, setName] = useState('');
    const [functionName, setFunctionName] = useState('');
    const [description, setDescription] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [parameters, setParameters] = useState([]);
    const [editIndex, setEditIndex] = useState(null);
    const [paramName, setParamName] = useState('');
    const [paramType, setParamType] = useState('');
    const [paramIsArray, setParamIsArray] = useState(false);
    const [paramPosition, setParamPosition] = useState('');

    const [categories, setCategories] = useState([]);
    useEffect(() => {
        const token = localStorage.getItem('accessToken');

        fetch('http://localhost:8000/categories/', {
          method: 'GET',
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
          }
        }).then(response => response.json())    
          .then(data => {
            setCategories(data);
            console.log(data)
          })
          .catch(error => {
            console.error('Error fetching categories:', error);
          });   

      }, []);


    const paramTypes = [
        { value: 'string', label: 'String' },
        { value: 'char', label: 'Char' },
        { value: 'int', label: 'Int' },
        { value: 'float', label: 'Float' },
        { value: 'bool', label: 'Bool' }
    ];

    const handleSave = (event) => {
        event.preventDefault();
        
        const newProblem = {
            name: name,
            function_name: functionName,
            description: description,
            category: categoryId,
            parameters: parameters
        };

        console.log(newProblem)
    
        const token = localStorage.getItem('accessToken');
            const url = 'http://localhost:8000/upload-problem/';
    
        // Use fetch to send the new problem data
        fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Token ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newProblem), // Convert the newProblem object to JSON
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Success:', data); // Handle the response data
            // Optionally update the local state if necessary
            setProblems([...problems, newProblem]); // Update state with the newly added problem
            // Reset form fields
            setName('');
            setFunctionName('');
            setDescription('');
            setCategoryId('');
            setParameters([]);
        })
        .catch(error => {
            console.error('Error:', error); // Handle any errors
        });
    };
    

    const handleDelete = (index) => {
        const updatedProblems = problems.filter((_, i) => i !== index);
        setProblems(updatedProblems);
    };

    const handleEdit = (index) => {
        const problem = problems[index];
        setName(problem.name);
        setFunctionName(problem.functionName);
        setDescription(problem.description);
        setCategoryId(problem.categoryId);
        setParameters(problem.parameters);
        setEditIndex(index);
    };

    const handleTextareaChange = (e) => {
        setDescription(e.target.value);
        e.target.style.height = 'auto';  
        e.target.style.height = `${e.target.scrollHeight}px`;  
    };

    const handleAddParameter = () => {
        const newParam = {
            name: paramName,
            type: paramType,
            is_array: paramIsArray,
            position: paramPosition
        };

        setParameters([...parameters, newParam]);

        setParamName('');
        setParamType('');
        setParamIsArray(false);
        setParamPosition('');
    };

    const handleDeleteParameter = (index) => {
        const updatedParameters = parameters.filter((_, i) => i !== index);
        setParameters(updatedParameters);
    };

    return (
        <div className="relative w-full justify-center">
            <div className="absolute top-4 left-4 w-16 h-16">
                <img src={NiCode} alt="Logo" className="w-full h-full object-contain" />
            </div>

            <form className="w-full h-full flex items-center justify-center">
                <div className="mx-auto grid w-full max-w-[900px] gap-6 bg-LogBackground p-10 rounded border border-white">
                    <div className="grid gap-2 text-center">
                        <h1 className="text-3xl font-bold text-white">{editIndex !== null ? 'Editar Problema' : 'Crear Problema'}</h1>
                    </div>
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label className="text-white">Nombre del Problema</Label>
                            <Input
                                type="text"
                                placeholder="Ingresa el nombre del problema"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label className="text-white">Nombre de la Función</Label>
                            <Input
                                type="text"
                                placeholder="Ingresa el nombre de la función"
                                value={functionName}
                                onChange={(e) => setFunctionName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label className="text-white">Descripción (en Markdown)</Label>
                            <textarea
                                rows="4"
                                placeholder="Describe el problema (Markdown soportado)"
                                value={description}
                                onChange={handleTextareaChange}
                                required
                                className="resize-none w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Vista previa de Markdown */}
                        <div className="grid gap-2">
                            <Label className="text-white">Vista Previa de la Descripción</Label>
                            <div className="border p-4 bg-white rounded-md text-black">
                                <ReactMarkdown>{description}</ReactMarkdown>
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label className="text-white">Categoría</Label>
                            <select
                                value={categoryId}
                                onChange={(e) => setCategoryId(e.target.value)}
                                required
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="" disabled>Selecciona una categoría</option>
                                {categories.map(category => (
                                    <option key={category.category_id} value={category.category_id}>
                                        {category.category_name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* AÑADIENDO PARAMETROS */}
                        <h2 className="text-xl text-white mt-4">Agregar Parámetros</h2>
                        <div className="grid gap-2">
                            <Label className="text-white">Nombre del Parámetro</Label>
                            <Input
                                type="text"
                                placeholder="Ingresa el nombre del parámetro"
                                value={paramName}
                                onChange={(e) => setParamName(e.target.value)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label className="text-white">Tipo del Parámetro</Label>
                            <select
                                value={paramType}
                                onChange={(e) => setParamType(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="" disabled>Selecciona un tipo</option>
                                {paramTypes.map(type => (
                                    <option key={type.value} value={type.value}>
                                        {type.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="grid gap-2">
                            <Label className="text-white">¿Es un Arreglo?</Label>
                            <input
                                type="checkbox"
                                checked={paramIsArray}
                                onChange={(e) => setParamIsArray(e.target.checked)}
                                className="text-white"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label className="text-white">Posición del Parámetro</Label>
                            <Input
                                type="number"
                                min="0"
                                placeholder="Ingresa la posición del parámetro"
                                value={paramPosition}
                                onChange={(e) => setParamPosition(e.target.value)}
                            />
                        </div>

                        <Button type="button" onClick={handleAddParameter} className="w-full font-bold bg-ButtonColor text-TextButtonColor">
                            Agregar Parámetro
                        </Button>

                        <div className="mt-4">
                            {parameters.map((param, index) => (
                                <div key={index} className="border-b border-white py-2 flex justify-between">
                                    <div className="text-white">
                                        <p>{param.name} ({param.type}) - {param.is_array ? 'Arreglo' : 'No es arreglo'} - Posición: {param.position}</p>
                                    </div>
                                    <Button className="bg-red-500" onClick={() => handleDeleteParameter(index)}>
                                        Eliminar
                                    </Button>
                                </div>
                            ))}
                        </div>

                        <Button type="submit" className="w-full font-bold bg-ButtonColor text-TextButtonColor" onClick={handleSave}>
                            {editIndex !== null ? 'Guardar Cambios' : 'Crear Problema'}
                        </Button>
                    </div>
                </div>
            </form>

            {/* LISTA DE PROBLEMAS AQUÍ */}
            <div className="mt-10">
                <h2 className="text-2xl text-center text-white">Lista de Problemas</h2>
                <div className="flex flex-col items-center">
                    {problems.map((problem, index) => (
                        <div key={index} className="border-b border-white py-4 w-3/4 flex justify-between">
                            <div className="text-white">
                                <h3 className="text-xl">{problem.name}</h3>
                                <p>Función: {problem.functionName}</p>
                                <ReactMarkdown>{problem.description}</ReactMarkdown>
                                <p>Categoría: {categories.find(c => c.id === parseInt(problem.categoryId))?.name}</p>

                                <div>
                                    <h4 className="text-white">Parámetros:</h4>
                                    {problem.parameters.map((param, i) => (
                                        <p key={i}>{param.name} ({param.type}) - {param.is_array ? 'Arreglo' : 'No es arreglo'} - Posición: {param.position}</p>
                                    ))}
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button className="bg-yellow-500" onClick={() => handleEdit(index)}>
                                    Editar
                                </Button>
                                <Button className="bg-red-500" onClick={() => handleDelete(index)}>
                                    Eliminar
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProblemCreateForm;
