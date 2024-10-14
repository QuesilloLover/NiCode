import React, { useState } from 'react';
import axios from 'axios';
import NiCode from '../assets/NiCode.svg';
import { Link } from 'react-router-dom';

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function Login() {

    const [formData, setFormData] = useState({
        username: "",
        password: ""  // Eliminamos el email
    });

    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }

    const handleGoogleLogin = (e) => {
        e.preventDefault(); 
        window.location.href = 'http://127.0.0.1:8000/accounts/google/login/?process=login';
    };
    

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isLoading) return;

        setIsLoading(true);

        try {
            const response = await axios.post('http://127.0.0.1:8000/auth/login/', formData);
            setSuccessMessage("Inicio de sesión exitoso!");
            localStorage.setItem("accessToken", response.data.key);
            setError(null);
        } catch (error) {
            setSuccessMessage(null);
            if (error.response && error.response.data) {
                Object.keys(error.response.data).forEach((field) => {
                    const errorMessages = error.response.data[field];
                    if (errorMessages && errorMessages.length > 0) {
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
            <form onSubmit={handleSubmit}>
                <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px] ">
                    <div className="flex items-center justify-center py-12 ">
                        <div className="mx-auto grid w-full max-w-[500px] gap-6 bg-LogBackground p-10 rounded border border-white">
                            <div className="grid gap-2 text-center">
                                <h1 className="text-3xl font-bold text-white">Iniciar Sesión</h1>
                            </div>
                            <div className="grid gap-4">
                                <div className="grid gap-2">
                                    <div className="flex items-center">
                                        <Label className="text-white">Nombre de Usuario</Label>
                                    </div>
                                    <Input
                                        id="username"
                                        type="text"
                                        placeholder="Tu nombre de usuario"
                                        name='username'
                                        value={formData.username}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <div className="flex items-center">
                                        <Label htmlFor="password" className="text-white">Contraseña</Label>
                                    </div>
                                    <Input
                                        id="password"
                                        type="password"
                                        name='password'
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <Button type="submit" className="w-full font-bold bg-ButtonColor text-TextButtonColor" disabled={isLoading}>
                                    Iniciar Sesion
                                </Button>
                                <Button variant="outline" className="w-full" onClick={handleGoogleLogin}>
                                    Login with Google
                                </Button>
                                {error && <p style={{ color: 'red' }}>{error}</p>}
                                {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
                            </div>
                            <div className="grid gap-4">
                                
                            </div>
                            <div className="mt-4 text-center text-sm text-white">
                                ¿No tienes una cuenta?{" "}
                                <Link to="/register" className="underline text-LoginFooterColor">
                                    Regístrate
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
