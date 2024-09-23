import React, { useState } from 'react';
import axios from 'axios';
import NiCode from '../assets/NiCode.png';
import { Link, Outlet } from 'react-router-dom';

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function Login() {

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [error, setError] = useState(null);  // Add state for error messages
    const [successMessage, setSuccessmessage] = useState(null);  // Add state for success message
    const [isLoading, setIsLoading] = useState(false);  // State to track loading

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if(isLoading) return;

        setIsLoading(true);

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/login/', formData);
            setSuccessmessage("Inicio de sesión exitoso!");  // Set success message
            localStorage.setItem("accessToken", response.data.tokens.access);
            localStorage.setItem("refreshToken", response.data.tokens.refresh);
            setError(null);  // Clear any previous errors
        } catch (error) {
            setSuccessmessage(null);  // Clear success message in case of error
            if(error.response && error.response.data){
                Object.keys(error.response.data).forEach((field) => {
                    const errorMessages = error.response.data[field];
                    if(errorMessages && errorMessages.length > 0){
                        setError(errorMessages[0]);  
                    }
                });
            } else {
                setError("An unexpected error occurred.");
            }
        } finally {
            setIsLoading(false); 
        }
    }

    return (
        <div>
            {error && <p style={{ color: 'red' }}>{error}</p>}  
            {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}  
            <form>
                <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px] ">
                    <div className="flex items-center justify-center py-12 ">
                        <div className="mx-auto grid w-full max-w-[500px] gap-6 bg-LogBackground p-10 rounded border border-white">
                            <div className="grid gap-2 text-center">
                                <h1 className="text-3xl font-bold text-white">Iniciar Sesion</h1>
                            </div>
                            <div className="grid gap-4">
                                <div className="grid gap-2">
                                    <div className="flex items-center">
                                        <Label className="text-white">Correo Electronico</Label>
                                    </div>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="quesillo@nicode.com"
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <div className="flex items-center">
                                        <Label htmlFor="password" className="text-white">Contraseña</Label>
                                    </div>
                                    <Input id="password" type="password" required />
                                </div>
                                <Button type="submit" className="w-full font-bold bg-ButtonColor text-TextButtonColor">
                                    Iniciar Sesion
                                </Button>
                            </div>
                            <div className="mt-4 text-center text-sm text-white">
                                No tienes una cuenta?{" "}
                                <Link to="/register" className="underline text-LoginFooterColor">
                                Registrate
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="hidden bg-muted lg:flex lg:items-center lg:justify-center w-1/2 h-1/2 mx-auto my-auto bg-BodyColor">
                        <div className="w-full h-full flex items-center justify-center bg-BodyColor">
                            <img
                                src={NiCode}
                                alt="Image"
                                className="max-w-full max-h-full object-contain dark:brightness-75 dark:grayscale"
                            />
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}