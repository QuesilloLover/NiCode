import React from 'react';
import NiCode from '../../assets/NiCode.png';

const HomeScreen = () => {
  return (
    <div className="bg-BodyColor mt-20 mb-40 flex flex-col items-center justify-center text-center">
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
      <p className="text-white text-xl mb-10">
        en Programación e Informática
      </p>

      {/* Texto adicional */}
      <p className="text-indigo-300 mt-20 text-2xl mt-10 animate-bounce">
        ¡Practica ejercicios de programación...
      </p>
    </div>
  );
};

export default HomeScreen;
