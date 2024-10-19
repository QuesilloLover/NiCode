"use client"

import React, { useState, useEffect } from 'react'

const words = ['Programación', 'Algoritmos', 'Lógica', 'Procesos',]

export default function TextAnimation() {
  const [currentWord, setCurrentWord] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const animateText = () => {
      const word = words[currentIndex]

      if (!isDeleting && currentWord.length < word.length) {
        setCurrentWord(word.slice(0, currentWord.length + 1))
      } else if (isDeleting && currentWord.length > 0) {
        setCurrentWord(word.slice(0, currentWord.length - 1))
      } else if (currentWord.length === word.length) {
        setIsDeleting(true)
      } else if (isDeleting && currentWord.length === 0) {
        setIsDeleting(false)
        setCurrentIndex((prev) => (prev + 1) % words.length)
      }
    }

    const timer = setTimeout(animateText, isDeleting ? 70 : 200)
    return () => clearTimeout(timer)
  }, [currentWord, currentIndex, isDeleting])

  return (
    <div className="flex items-center justify-center bg-gray-900">
      <h1 className="text-4xl font-bold">
        <span className="text-white font-mono">Aprende </span>
        <span className="text-green-400 font-mono">{currentWord}</span>
        <span className="text-green-400 animate-blink" aria-hidden="true">|</span>
      </h1>
    </div>
  )
}