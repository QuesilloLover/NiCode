import React from 'react';
import Header from '../components/components_layouts/header'
import { useNavigate } from 'react-router-dom';
const NiCode = () => {

  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/Problems');
  };

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

            <div onClick={handleClick} className="bg-gray-800 rounded-lg p-6 transform transition-transform hover:scale-105">
                <div className="text-5xl mb-4">💡</div>
                <h2 className="text-blue-400 text-2xl font-semibold mb-4">Entrenamiento</h2>
                <p className="text-gray-300">
                    Modo individual para practicar programación a ritmo propio con ejercicios personalizados.
                </p>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 transform transition-transform hover:scale-105">
            <div className="text-5xl mb-4">🏆</div>
            <h2 className="text-blue-400 text-2xl font-semibold mb-4">Salas</h2>
            <p className="text-gray-300">
                xEspacios virtuales para retos colaborativos o competencias grupales, fomentando interacción y aprendizaje.
            </p>
            </div>
        </div>
        </div>
    </>
  );
};

export default NiCode;
