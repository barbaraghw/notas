import React from 'react';
import { FaUser, FaLock } from "react-icons/fa"; // Importar ambos iconos

export function Login() {
    return (
        <div className="login-container">
            <div className="input-group">
                <span className="icon"><FaUser /></span>
                <input type="email" placeholder="Correo Electrónico" required />
            </div>
            <div className="input-group">
                <span className="icon"><FaLock /></span>
                <input type="password" placeholder="Contraseña" required />
            </div>
        </div>
    );
}

export default Login;
