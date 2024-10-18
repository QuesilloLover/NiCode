import React, { useState } from "react";
import { Link } from "react-router-dom";
import NiCode from "../assets/NiCode.png";
import JoinByCodeModal from "@/JoinByCodeModal";
import Header from './components_layouts/header'

const RoomTable = () => {
  const rooms = [
    { name: "Sala 1", creator: "User 01", users: "4/10", visibility: "Privada" },
    { name: "Sala 2", creator: "User 05", users: "10/10", visibility: "Pública" },
    { name: "Sala 3", creator: "User 10", users: "9/10", visibility: "Pública" },
    { name: "Sala 4", creator: "User 07", users: "3/10", visibility: "Privada" },
    { name: "Sala 5", creator: "User 04", users: "2/10", visibility: "Pública" },
    { name: "Sala 6", creator: "User 02", users: "4/10", visibility: "Privada" },
    { name: "Sala 7", creator: "User 06", users: "5/10", visibility: "Privada" },
  ];

  // Estado para controlar la visibilidad del modal
  const [showModal, setShowModal] = useState(false);

  // Función para abrir el modal
  const handleJoinByCode = () => {
    setShowModal(true);
  };

  // Función para cerrar el modal
  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <>
      {/* Header */}
      <Header/>

      {/* Body de la tabla */}
      <div className="bg-gray-900 min-h-screen flex flex-col items-center justify-center p-4">
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg w-full max-w-4xl">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-white font-bold text-lg">Mis Salas</h2>
            <h2 className="text-white font-bold text-lg">Salas</h2>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-lg"
              onClick={handleJoinByCode}
            >
              Unirme por código
            </button>
          </div>

          {/* Tabla de salas */}
          <table className="w-full text-white">
            <thead>
              <tr className="text-left bg-gray-700">
                <th className="py-2 px-4">Nombre de la Sala</th>
                <th className="py-2 px-4">Creador</th>
                <th className="py-2 px-4">Usuarios</th>
                <th className="py-2 px-4">Visibilidad</th>
                <th className="py-2 px-4"></th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((room, index) => (
                <tr
                  key={index}
                  className={`bg-gray-800 hover:bg-gray-700 ${
                    index % 2 === 0 ? "bg-gray-800" : "bg-gray-700"
                  }`}
                >
                  <td className="py-2 px-4">{room.name}</td>
                  <td className="py-2 px-4">{room.creator}</td>
                  <td className="py-2 px-4">{room.users}</td>
                  <td className="py-2 px-4">{room.visibility}</td>
                  <td className="py-2 px-4">
                    <button className="bg-gray-600 text-white p-2 rounded-lg">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M7.5 13.5l3 3 6-6"
                        />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-gray-800 rounded-lg p-8 shadow-lg text-center">
            <h2 className="text-white mb-4 text-xl font-bold">
              Introduzca código de acceso
            </h2>
            <form action="#" method="POST">
            <input
              type="text"
              name="code"
              className="text-green-500 bg-gray-700 text-center px-4 py-2 w-full rounded-lg mb-4 focus:outline-none"
              onChange={(e) => setCode(e.target.value)} // Actualiza el estado con el valor del input
            />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg w-full"
              >
                Entrar a la Sala
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default RoomTable;
