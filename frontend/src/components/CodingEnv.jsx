"use client"

import React, { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import CodeEditor from './CodeEditor'
import { useParams } from 'react-router-dom';


export const fetchProblem = async (problemId) => {
  const token = localStorage.getItem('accessToken');

  try {
    const response = await fetch(`http://localhost:8000/problem/${problemId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch problem data');
    }

    const data = await response.json();
    return data;  // Return the fetched data

  } catch (error) {
    console.error('Error fetching problem:', error);
    return null;  // Handle the error and return null or an error message
  }
};


export default function TwoSumScreen() {
  const { problemId } = useParams();  
  const [problem, setProblem] = useState(null)
  const [notes, setNotes] = useState("")
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState("")
  const [code, setCode] = useState("")

  const handleCallback = (childData) => {
    setCode(childData)
  }


  useEffect(() => {
    const loadProblem = async () => {
      const data = await fetchProblem(problemId)
      setProblem(data)
    }
    loadProblem()
  }, [])

  const handleNoteChange = (e) => {
    setNotes(e.target.value)
  }

  const handleMessageSubmit = (e) => {
    e.preventDefault()
    if (inputMessage.trim()) {
      const token = localStorage.getItem('accessToken');
      setMessages([...messages, { text: inputMessage, sender: 'user' }])
      
      const payload = {
        user_input: inputMessage,
        code_context: code,
      };
  
      fetch(`http://localhost:8000/chatbot/`, {
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
          setMessages(prev => [...prev, { text: data.hint, sender: 'assistant' }])
          setInputMessage("")
        })
        .catch(error => {
          console.error('Error fetching categories:', error);
        });


      // setMessages([...messages, { text: inputMessage, sender: 'user' }])
      // // Simulate assistant response
      // setTimeout(() => {
      //   setMessages(prev => [...prev, { text: "Estoy aquí para ayudar", sender: 'assistant' }])
      // }, 1000)
    }
  }

  if (!problem) return <div>Loading...</div>

  return (
    <div className="min-h-screen bg-gray-800 text-white p-6 flex flex-col md:flex-row">
      {/* Left column - Navbar and content */}
      <div className="w-full md:w-1/2 lg:w-1/3 p-4">
        <h1 className="text-3xl font-bold mb-4">{problem.id}. {problem.name}</h1>
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="description">Descripción</TabsTrigger>
            <TabsTrigger value="notes">Notas</TabsTrigger>
            <TabsTrigger value="assistant">Asistente  </TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="mt-4">
            <ScrollArea className="h-[calc(100vh-200px)]">
              <p className="text-gray-400 mb-4">{problem.description}</p>

            </ScrollArea>
          </TabsContent>
          <TabsContent value="notes" className="mt-4">
            <Textarea
              placeholder="Type your notes here..."
              className="min-h-[calc(100vh-200px)] bg-gray-700 text-white"
              value={notes}
              onChange={handleNoteChange}
            />
          </TabsContent>
          <TabsContent value="assistant" className="mt-4">
            <ScrollArea className="h-[calc(100vh-280px)] mb-4">
              {messages.map((message, index) => (
                <div key={index} className={`mb-2 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}>
                  <span className={`inline-block p-2 rounded-lg ${message.sender === 'user' ? 'bg-blue-500' : 'bg-gray-600'}`}>
                    {message.text}
                  </span>
                </div>
              ))}
            </ScrollArea>
            <form onSubmit={handleMessageSubmit} className="flex gap-2">
              <Input
                type="text"
                placeholder="Type your message..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                className="flex-grow text-black"
              />
              <Button type="submit">Send</Button>
            </form>
          </TabsContent>
        </Tabs>
      </div>

      {/* Right column - Code editor */}
      <div className="w-full lg:w-2/3 p-4 flex flex-col space-y-4">
        <div className="flex-grow w-full p-6 bg-gray-900 rounded-lg shadow-lg flex flex-col justify-between">
          <CodeEditor parentCallback ={handleCallback}/>
        </div>
      </div>
    </div>
  )
}