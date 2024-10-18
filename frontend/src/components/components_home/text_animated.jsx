import React, { useState, useEffect } from 'react';

const TypingAnimation = () => {
  const words = ['Programmer', 'Designer', 'Developer', 'Creator'];
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [charIndex, setCharIndex] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(200);

  useEffect(() => {
    let typingTimeout;

    if (!isDeleting && charIndex < words[currentWordIndex].length) {
      // Write characters
      setDisplayedText(prev => prev + words[currentWordIndex].charAt(charIndex));
      setCharIndex(prev => prev + 1);
      typingTimeout = setTimeout(() => setTypingSpeed(200), typingSpeed);
    } else if (isDeleting && charIndex > 0) {
      // Delete characters
      setDisplayedText(prev => prev.substring(0, prev.length - 1));
      setCharIndex(prev => prev - 1);
      typingTimeout = setTimeout(() => setTypingSpeed(100), typingSpeed);
    } else if (!isDeleting && charIndex === words[currentWordIndex].length) {
      // Pause before deleting
      setTimeout(() => setIsDeleting(true), 1000);
    } else if (isDeleting && charIndex === 0) {
      // Move to the next word
      setIsDeleting(false);
      setCurrentWordIndex((prev) => (prev + 1) % words.length);
    }

    return () => clearTimeout(typingTimeout);
  }, [charIndex, isDeleting, currentWordIndex, typingSpeed, words]);

  return (
    <div style={{ fontFamily: 'monospace', fontSize: '24px' }}>
      <span>I'm a {displayedText}</span>
      <span className="cursor" style={{ borderLeft: '2px solid black', marginLeft: '2px' }}></span>
    </div>
  );
};

export default TypingAnimation;
