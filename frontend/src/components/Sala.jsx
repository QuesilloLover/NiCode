import React from "react";

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

  return (
    <div className="bg-gray-900 min-h-screen flex flex-col items-center justify-center p-4">
      <div className="bg-gray-800 p-4 rounded-lg shadow-lg w-full max-w-4xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-white font-bold text-lg">Mis Salas</h2>
          <h2 className="text-white font-bold text-lg">Salas</h2>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">
            Unirme por código
          </button>
        </div>
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
  );
};

export default RoomTable;
