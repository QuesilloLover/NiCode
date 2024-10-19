import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sword, Lightbulb, Trophy } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Header from "./components_layouts/header"

export default function Modes() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [socket, setSocket] = useState(null)

  const modes = [
    {
      icon: <Lightbulb className="h-40 w-10" />,
      title: "Entrenamiento",
      description: "Modo individual para practicar programación a ritmo propio con ejercicios personalizados.",
      color: "bg-green-500",
    },
    {
      icon: <Sword className="h-40 w-10" />,
      title: "1 vs 1",
      description: "Competencias de programación en tiempo real con desafíos y puntuación directa.",
      color: "bg-blue-500",
    },
    {
      icon: <Trophy className="h-40 w-10" />,
      title: "Salas",
      description: "Espacios virtuales para retos colaborativos o competencias grupales, fomentando interacción y aprendizaje.",
      color: "bg-purple-500",
    },
  ]

  const handleQuickMatch = () => {
    if (loading) {
      // Cancel the matchmaking
      setLoading(false)
      if (socket) {
        socket.close()
        setSocket(null)
      }
      return
    }

    const newSocket = new WebSocket('ws://' + window.location.hostname + ':8000/ws/matchmaking/')
    setSocket(newSocket)
    setLoading(true)

    newSocket.onopen = () => {
      newSocket.send(JSON.stringify({ message: 'socket' }))
    }

    newSocket.onmessage = (e) => {
      const data = JSON.parse(e.data)
      if (data.message === 'in_queue') {
        // Handle in queue logic (if needed)
      } else if (data.message === 'match_found') {
        window.location.href = data.url
      }
    }
  }

  useEffect(() => {
    return () => {
      if (socket) {
        socket.close()
      }
    }
  }, [socket])

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <Header /> 
      <div className="container flex flex-col items-center mx-auto px-4 py-16">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
            ¡Bienvenido a NiCode!
          </h1>
          <p className="text-xl text-center mb-12 text-gray-300">
            El lugar donde tu pasión por la programación cobra vida. Explora tres emocionantes formas de mejorar tus habilidades:
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {modes.map((mode, index) => (
            <Card key={index} className="bg-gray-800 border-gray-700 overflow-hidden group">
              <CardHeader className={`${mode.color} p-6 transition-all duration-300 group-hover:p-10`}>
                <div className="flex justify-center">{mode.icon}</div>
              </CardHeader>
              <CardContent className="p-6">
                <CardTitle className="text-2xl font-semibold mb-2 text-center mt-10 text-white">
                  {mode.title}
                </CardTitle>
                <CardDescription className="text-gray-400 text-center mb-4">
                  {mode.description}
                </CardDescription>
                {mode.title === "1 vs 1" ? (
                  <Button 
                    className="w-full bg-gray-700 hover:bg-gray-600 transition-colors duration-300"
                    onClick={handleQuickMatch}
                  >
                    {loading ? 'Cancelando...' : 'Comenzar'}
                  </Button>
                ) : (
                  <Button 
                    className="w-full bg-gray-700 hover:bg-gray-600 transition-colors duration-300"
                    onClick={() => navigate(`/${mode.title.toLowerCase().replace(/\s+/g, '-')}`)}
                  >
                    Comenzar
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
