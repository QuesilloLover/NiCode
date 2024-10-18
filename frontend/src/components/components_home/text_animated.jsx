'use client'

import React, { useState, useEffect } from 'react'

export default function Component({ text = "Bienvenidos" }) {
  const [displayText, setDisplayText] = useState('')
  const [index, setIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    if (isPaused) {
      const pauseTimer = setTimeout(() => {
        setIsPaused(false)
        setDisplayText('')
        setIndex(0)
      }, 5000) // Espera 5 segundos antes de reiniciar

      return () => clearTimeout(pauseTimer)
    }

    const intervalId = setInterval(() => {
      setIndex((prevIndex) => {
        if (prevIndex >= text.length) {
          setIsPaused(true)
          return prevIndex
        }
        setDisplayText((prevText) => prevText + text[prevIndex])
        return prevIndex + 1
      })
    }, 100) // Ajusta este valor para cambiar la velocidad de la animación

    return () => clearInterval(intervalId)
  }, [text, isPaused])

  return (
    <div className="flex items-center justify-center min-h-[200px] bg-gradient-to-r from-purple-500 to-pink-500 p-8 rounded-lg shadow-lg">
      <h1 className="text-4xl font-bold text-white text-center">
        {displayText}
        <span className={`animate-blink ${isPaused ? 'invisible' : ''}`}>|</span>
      </h1>
    </div>
  )
}