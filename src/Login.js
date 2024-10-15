import React, { useState } from 'react';
import { FaUser, FaLock } from "react-icons/fa"; 
import { RiUserAddLine } from "react-icons/ri";

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [showLogin, setShowLogin] = useState(true);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Email:', email, 'Password:', password);
    };

    const handleCreateAccount = () => {
        setShowLogin(false);
    };

    const handleAccountSubmit = (e) => {
        e.preventDefault();
        console.log('Nombre:', firstName, 'Apellido:', lastName, 'Email:', email, 'Password:', password);
    };

    return (
        <div className="login-container">
            {showLogin ? (
                <>
                    <h2 className="login-title">Inicio de sesión</h2>
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
                        <p className="create-account" onClick={handleCreateAccount}>
                            Crear una cuenta nueva
                        </p>
                        <button className="login-button" type="submit">Login</button>
                    </form>
                </>
            ) : (
                <form onSubmit={handleAccountSubmit}>
                    <h2 className="login-title">Crear tu cuenta</h2>
                    <div className="create-input-group">
                        <input 
                            type="text" 
                            placeholder="Nombre" 
                            required 
                            value={firstName} 
                            onChange={(e) => setFirstName(e.target.value)} 
                        />
                    </div>
                    <div className="create-input-group">
                        <input 
                            type="text" 
                            placeholder="Apellido" 
                            required 
                            value={lastName} 
                            onChange={(e) => setLastName(e.target.value)} 
                        />
                    </div>
                    <div className="create-input-group">
                        <input 
                            type="email" 
                            placeholder="Correo Electrónico" 
                            required 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                        />
                    </div>
                    <div className="create-input-group">
                        <input 
                            type="password" 
                            placeholder="Contraseña" 
                            required 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                        />
                    </div>
                    <button className="login-button" type="submit">Crear cuenta</button>
                    <p className="create-account" onClick={() => setShowLogin(true)}>
                        Volver al inicio de sesión
                    </p>
                </form>
            )}
        </div>
    );
}

export default Login;
