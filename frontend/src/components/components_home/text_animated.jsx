import React, { useState, useEffect } from 'react';

const TypingAnimation = () => {
  const words = ['Python', 'Algoritmos', 'Logica', 'Programacion'];
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [charIndex, setCharIndex] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(200);

  useEffect(() => {
    let typingTimeout;

    if (isDeleting) {
      // Borrar letra por letra
      if (charIndex > 0) {
        setDisplayedText((prev) => prev.substring(0, prev.length - 1));
        setCharIndex((prev) => prev - 1);
        typingTimeout = setTimeout(() => setTypingSpeed(typingSpeed), typingSpeed);
      } else {
        // Cambiar al siguiente texto después de eliminar
        setIsDeleting(false);
        setCurrentWordIndex((prev) => (prev + 1) % words.length);
        typingTimeout = setTimeout(() => setTypingSpeed(1000), typingSpeed);
      }
    } else {
      // Escribir letra por letra
      if (charIndex < words[currentWordIndex].length) {
        setDisplayedText((prev) => prev + words[currentWordIndex].charAt(charIndex));
        setCharIndex((prev) => prev + 1);
        typingTimeout = setTimeout(() => setTypingSpeed(typingSpeed), typingSpeed);
      } else {
        // Pausa antes de empezar a borrar
        typingTimeout = setTimeout(() => setIsDeleting(true), 1000);
      }
    }

    return () => clearTimeout(typingTimeout);
  }, [charIndex, isDeleting, currentWordIndex, typingSpeed, words]);

  return (
    <div style={{ fontFamily: 'monospace', fontSize: '30px' }}> {/* Aumenta el tamaño de la fuente */}
      <span style={{ color: 'white' }}>Aprende </span>
      <span style={{ color: '#22c55e' }}>{displayedText}</span> {/* Cambia el color a #22c55e */}
      <span className="cursor" style={{ borderLeft: '2px solid black', marginLeft: '2px' }}></span>
    </div>
  );
};

export default TypingAnimation;


