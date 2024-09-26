import React from "react";
import AuthButtons from "./components_home/AuthHome";
import { Link } from "react-router-dom";
import NiCode from "../assets/NiCode.png";

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
    <>
        <header>
          <nav className="bg-BodyColor border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800">
              <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
                  <Link to="/" className="flex items-center">
                      <img src={NiCode} className="mr-3 h-6 sm:h-9" alt="Flowbite Logo" />
                      <span className=" text-white self-center text-xl font-semibold whitespace-nowrap dark:text-white">NiCode</span>
                  </Link>
                  <div className="flex items-center lg:order-2">
                      <Link to="/Login" className="text-white dark:text-white hover:bg-primary-800 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800">Salas</Link>
                      <Link to="/register" className="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800">Foros</Link>
                      <Link to="/Salas" className="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800">Foros</Link>

                      <button data-collapse-toggle="mobile-menu-2" type="button" className="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="mobile-menu-2" aria-expanded="false">
                          <span className="sr-only">Open main menu</span>
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path></svg>
                          <svg className="hidden w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                      </button>
                  </div>
                  <div className="hidden justify-between items-center w-full lg:flex lg:w-auto lg:order-1" id="mobile-menu-2">
                      <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
                          {/* <li>
                              <a href="#" className="block py-2 pr-4 pl-3 text-white rounded bg-primary-700 lg:bg-transparent lg:text-primary-700 lg:p-0 dark:text-white" aria-current="page">Home</a>
                          </li>
                          <li>
                              <a href="#" className="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700">Company</a>
                          </li>
                          <li>
                              <a href="#" className="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700">Marketplace</a>
                          </li>
                          <li>
                              <a href="#" className="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700">Features</a>
                          </li>
                          <li>
                              <a href="#" className="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700">Team</a>
                          </li>
                          <li>
                              <a href="#" className="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700">Contact</a>
                          </li> */}
                      </ul>
                  </div>
              </div>
             </nav>
          </header>
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
    
    
    </>
    
  );
};

export default RoomTable;
