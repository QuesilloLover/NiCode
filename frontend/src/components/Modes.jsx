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

  const navigateProblems = () => {
    navigate('/Problems');
  };

  const navigateSalas = () => {
    navigate('/Sala');
  }

  return (
    <>
        {/* Header */}
        <Header/>
        {/* Modes */}
        <div className="text-center font-sans text-white bg-gray-900 py-10 px-4">
        <h1 className="text-3xl mb-4 font-bold">
            ¡Bienvenido a NiCode, el lugar donde tu pasión por la programación cobra vida!
        </h1>
        <p className="text-xl mb-10">Explora tres emocionantes formas de mejorar tus habilidades:</p>

        <div className="grid md:grid-cols-3 gap-40 ml-20 mr-20">
            <div  className="bg-gray-800 rounded-lg p-6 transform transition-transform hover:scale-105">
                <div className="text-5xl mb-4">⚔️</div>
                <h2 className="text-blue-400 text-2xl font-semibold mb-4">1 vs 1</h2>
                <p className="text-gray-300">
                    Competencias de programación en tiempo real con desafíos y puntuación directa.
                </p>
            </div>

            <div onClick={navigateProblems} className="bg-gray-800 rounded-lg p-6 transform transition-transform hover:scale-105">
                <div className="text-5xl mb-4">💡</div>
                <h2 className="text-blue-400 text-2xl font-semibold mb-4">Entrenamiento</h2>
                <p className="text-gray-300">
                    Modo individual para practicar programación a ritmo propio con ejercicios personalizados.
                </p>
            </div>

            <div onClick={navigateSalas} className="bg-gray-800 rounded-lg p-6 transform transition-transform hover:scale-105">
                <div className="text-5xl mb-4">🏆</div>
                <h2 className="text-blue-400 text-2xl font-semibold mb-4">Salas</h2>
                <p className="text-gray-300">
                    Espacios virtuales para retos colaborativos o competencias grupales, fomentando interacción y aprendizaje.
                </p>
            </div>
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
      </>
  )
}
