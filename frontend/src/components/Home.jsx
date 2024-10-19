import React from 'react'
import { useState, useEffect } from 'react'
import axios from "axios"
import { Link, Outlet } from 'react-router-dom';
import NiCode from '../assets/NiCode.svg';
import HomeScreen from './components_home/HomeScreen';
import WhatIsNicode from './components_home/WhatIsNicode';
import AuthHome from './components_home/AuthHome';
import Header from './components_layouts/header' 

export default function Home() {
  
  const [username, setUsername] = useState("")
  const [isLoggedIn, setLoggedIn] = useState(false)
  
  useEffect (()=>{
    const checkLoggedInUser = async () =>{
      try{
        const token = localStorage.getItem("accessToken");
        if (token) {
          const config = {
            headers: {
              "Authorization":`Bearer ${token}`
            }
          };
          const response = await axios.get("http://127.0.0.1:8000/user/", config)
          setLoggedIn(true)
          setUsername(response.data.username)
        }
        else{
          setLoggedIn(false);
          setUsername("");
        }
      }
      catch(error){
        setLoggedIn(false);
        setUsername("");
      }
    };
    checkLoggedInUser()
  }, [])

  const handleLogout = async () => {
    try{
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");

      if(accessToken && refreshToken) {
        const config = {
          headers: {
            "Authorization":`Bearer ${accessToken}`
          }
        };
        await axios.post("http://127.0.0.1:8000/api/logout/", {"refresh":refreshToken}, config)
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setLoggedIn(false);
        setUsername("");
        console.log("Cierre de sesion exitoso!")
      }
    }
    catch(error){
      console.error("Failed to logout", error.response?.data || error.message)
    }
  }
  return (
    <div>

    (
        <> 
          <Header/>
          <HomeScreen />
          <WhatIsNicode />
          <AuthHome/>
        </>
      )
        
    </div>
  )
}