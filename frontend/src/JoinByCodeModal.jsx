import React, { useState } from 'react';

const JoinByCodeModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');

  // Función para abrir el modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Función para cerrar el modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Función para manejar el input
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  // Función que se ejecuta al continuar
  const handleContinue = () => {
    console.log('Código ingresado:', inputValue);
    // Aquí puedes realizar alguna acción con el código ingresado
    closeModal();
  };

  return (
    <div>
      {/* Botón para abrir el modal */}
      <button
        onClick={openModal}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg"
      >
        Unirme por código
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
          <div className="bg-gray-900 p-8 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4">Ingresa el código para unirte</h2>
            <p className="mb-4 text-sm text-gray-400">
              Por favor, introduce el código de invitación para unirte a la sala.
            </p>

            {/* Input para capturar el código */}
            <input
              type="text"
              placeholder="Código de invitación"
              value={inputValue}
              onChange={handleInputChange}
              className="w-full p-2 mb-4 bg-gray-800 text-white rounded-lg focus:outline-none"
            />

            <div className="flex justify-end space-x-2">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg"
              >
                Cancelar
              </button>
              <button
                onClick={handleContinue}
                className="px-4 py-2 bg-green-500 text-white rounded-lg"
              >
                Unirme
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JoinByCodeModal;
