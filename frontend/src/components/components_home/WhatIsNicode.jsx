import React from 'react';
import python from '../../assets/Language_home_img/python.png';
import javascript from '../../assets/Language_home_img/javascript.png';
import c from '../../assets/Language_home_img/c.png';
import csharp from '../../assets/Language_home_img/csharp.png';
import { Link } from 'react-router-dom';

const QueEsNicode = () => {
  return (
    <section className="bg-BodyColor w-full h-full flex flex-col items-center justify-center py-12 text-white">
      {/* Título */}
      <h1 className="text-green-400 text-5xl font-bold mb-6 text-center">¿QUÉ ES NICODE?</h1>
      
      {/* Descripción */}
      <p className="text-center text-lg px-4 md:px-20 lg:px-40">
        NiCode, una plataforma educativa enfocada en el aprendizaje dinámico y competitivo de programación e informática. 
        Incluye módulos de desafíos de codificación, competencias en tiempo real, y prácticas de mecanografía, 
        todo diseñado para estudiantes, profesionales y entusiastas de la programación. La plataforma busca transformar 
        el aprendizaje técnico en una experiencia entretenida y accesible para todos los niveles.
      </p>

      {/* Subtítulo */}
      <h2 className="mt-10 text-3xl text-purple-300 font-semibold">Lo que ofrecemos...</h2>
      <p className="mt-2 text-center text-lg">Salas de codeo, problemas tuanis, foro QA entre usuarios, cursos.</p>

      {/* Sección de iconos */}
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Icono de C++ */}
        <div className="flex flex-col items-center">
          <img 
            src={c}
            alt="C++"
            className="w-24 h-24 mb-4"
          />
          <Link to="Sala" className="bg-green-400 text-black font-bold px-4 py-2 rounded-full hover:bg-green-300">
            Ir a la sala
          </Link>
        </div>

        {/* Icono de Python */}
        <div className="flex flex-col items-center">
          <img 
            src={python} 
            alt="Python"
            className="w-24 h-24 mb-4"
          />
          <Link to="Sala" className="bg-green-400 text-black font-bold px-4 py-2 rounded-full hover:bg-green-300">
            Ir a la sala
          </Link>
        </div>

        {/* Icono de JavaScript */}
        <div className="flex flex-col items-center">
          <img 
            src={javascript} 
            alt="JavaScript"
            className="w-24 h-24 mb-4"
          />
          <Link to="Sala" className="bg-green-400 text-black font-bold px-4 py-2 rounded-full hover:bg-green-300">
            Ir a la sala
          </Link>
        </div>

        {/* Icono de C# */}
        <div className="flex flex-col items-center">
          <img 
            src={csharp}
            alt="C#"
            className="w-24 h-24 mb-4"
          />
          <Link to="Sala" className="bg-green-400 text-black font-bold px-4 py-2 rounded-full hover:bg-green-300">
            Ir a la sala
          </Link>
        </div>
      </div>
    </section>
  );
};

export default QueEsNicode;
