import React from 'react';
import { Link } from 'react-router-dom';

const AuthButtons = () => {
  return (
    <section className="bg-gradient-to-b from-BodyColor to-blue-900 w-full h-full flex flex-col items-center justify-center py-12 text-white">
      {/* Título */}
      <h2 className="text-lg mb-6 text-center">Empieza ahora</h2>

      {/* Contenedor de los botones */}
      <div className="flex items-center justify-center space-x-4">
        {/* Botón de Registrarse */}
        <Link to="login" className="relative inline-flex items-center px-6 py-3 bg-green-500 text-black font-bold rounded-full hover:bg-green-400 transition-colors duration-300">
          Registrarse
        </Link>
        
        {/* Texto entre los botones */}
        <span className="text-xl">o</span>

        {/* Botón de Iniciar Sesión */}
        <Link to="register" className="transition ease-in-out relative inline-flex items-center px-6 py-3 bg-green-500 text-black font-bold rounded-full hover:bg-green-400 transition-colors duration-300">
          Iniciar Sesión
        </Link>
      </div>
    </section>
  );
};

export default AuthButtons;
