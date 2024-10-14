import React, { useState } from 'react';
import { FaUser, FaLock } from "react-icons/fa"; 

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showLogin, setShowLogin] = useState(true);

    const handleSubmit = (e) => {
        e.preventDefault();
        //nicio de sesion
        console.log('Email:', email, 'Password:', password);
    };

    const handleCreateAccount = () => {
        setShowLogin(false); // Cambiar a la vista de crear cuenta
    };

    return (
        <div className="login-container">
            {showLogin ? (
                <>
                    <h2 className="login-title">Inicio de Sesión</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <span className="icon"><FaUser /></span>
                            <input 
                                type="email" 
                                placeholder="Correo Electrónico" 
                                required 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                aria-label="Correo Electrónico"
                            />
                        </div>
                        <div className="input-group">
                            <span className="icon"><FaLock /></span>
                            <input 
                                type="password" 
                                placeholder="Contraseña" 
                                required 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                aria-label="Contraseña"
                            />
                        </div>
                        <p 
                            className="create-account" 
                            onClick={handleCreateAccount}
                        >
                            Crear una cuenta nueva
                        </p>
                        <button className="login-button" type="submit">Login</button>
                    </form>
                </>
            ) : (
                <div>
                    <h2 className="login-title">Crear Cuenta</h2>
                    {/* Aquí puedes agregar el formulario para crear una cuenta */}
                    <p>Formulario de registro aquí.</p>
                    <p 
                        className="create-account" 
                        onClick={() => setShowLogin(true)}
                    >
                        Volver al inicio de sesión
                    </p>
                </div>
            )}
        </div>
    );
}

export default Login;
