import React, { useState } from 'react'; 
import { FaNoteSticky } from "react-icons/fa6";

function Block() {
    const [showPrincipal, setShowPrincipal] = useState(true);
    const [note, setNote] = useState ('');
    const [isFocused, setIsFocused] = useState (false);

    const mostrarPrincipal = () => {
        setShowPrincipal(false);
    };

    return (
        <div className='page-container'>
            <div className='top-container'>
                <h1 className='page-title'>Mis notas</h1>
            </div>
            <div className='left-container'>
                <h3>Calendario</h3>
                <button onClick={mostrarPrincipal}>Nueva nota</button>
            </div>
            {showPrincipal ? (
                <div className='principal-container'>
                    <h2>Carpetas recientes</h2>
                    <button onClick={mostrarPrincipal}>Hoy</button>
                    <button onClick={mostrarPrincipal}>Esta semana</button>
                    <button onClick={mostrarPrincipal}>Este mes</button>
                    <div className='folder-container'>
                        <span className='icon'><FaNoteSticky /></span>
                        <div className='text'>
                            <h3>Hola</h3>
                            <h4>17/10/24</h4>
                        </div>
                    </div>
                </div>
            ) : (
                <div className='secondary-container'>
                    <h2>Contenedor Secundario</h2>
                    <textarea
                        className={`note-input ${isFocused ? 'focused' : ''}`}  
                        placeholder='¡Comienza tu nueva nota!'
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        />
                    <button onClick={() => setShowPrincipal(true)}>Volver</button>
                </div>
            )}
        </div>
    );
}

export default Block;
