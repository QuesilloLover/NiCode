import React from 'react';
import NiCode from '../../assets/NiCode.png';
import Text_animated from './Text_animated.jsx';

const HomeScreen = () => {
  return (
    <div className="bg-BodyColor mt-20 mb-60 flex flex-col items-center justify-center text-center">
      {/* Logo */}
      {/* <div className="flex flex-col items-center mb-10">
        <img
          src={NiCode}
          alt="Nicode Logo"
          className="w-20 mb-4"
        />
      </div> */}

      {/* Texto principal */}
      <h1 className="text-green-500 text-6xl font-bold mb-4">NICODE</h1>
      <p className="text-white text-xl">
        Plataforma de Aprendizaje Dinámico y Competitivo 
      </p>
      <p className="text-white text-xl mb-20">
        en Programación e Informática
      </p>

      {/* Texto adicional */}
      <Text_animated text="Este es un texto animado!" speed={150} />

    </div>
  );
};

export default HomeScreen;
