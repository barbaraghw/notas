import React, { useState } from 'react'; 
import { FaNoteSticky } from "react-icons/fa6";
import { FaBold, FaItalic, FaUnderline } from "react-icons/fa";
import { firestore, auth } from './config/config'; 
import { doc, setDoc } from "firebase/firestore"; 
import { TfiWrite } from "react-icons/tfi"; 

function Block() {
    const [showPrincipal, setShowPrincipal] = useState(true);
    const [note, setNote] = useState('');
    const [title, setTitle] = useState('');
    const [isFocused, setIsFocused] = useState(false);

    const mostrarPrincipal = () => {
        setShowPrincipal(false);
    };

    const handleInput = (e) => {
        setNote(e.target.value);
    };

    const handleTitleInput = (e) => {
        setTitle(e.target.value);
    };

    const saveNote = async () => {
        const user = auth.currentUser; 
        if (user) {
            const noteData = {
                title,
                content: note,
                userId: user.uid,
                createdAt: new Date(),
            };

            try {
                const noteRef = doc(firestore, 'notes', `${user.uid}_${Date.now()}`);
                await setDoc(noteRef, noteData);
                alert('Nota guardada exitosamente!');
                setNote('');
                setTitle('');
            } catch (error) {
                console.error('Error al guardar la nota: ', error);
            }
        } else {
            alert('Por favor, inicie sesión para guardar notas.');
        }
    };

    return (
        <div className='page-container'>
            <div className='icon-container'>
                <TfiWrite className='write-icon' />
            </div>
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
                    <h2 className='new-note-title'>¡Nueva nota!</h2> 
                    <div className='top-row'>
                        <div className='toolbar'>
                            <button onClick={() => document.execCommand('bold')}>
                                <FaBold />
                            </button>
                            <button onClick={() => document.execCommand('italic')}>
                                <FaItalic />
                            </button>
                            <button onClick={() => document.execCommand('underline')}>
                                <FaUnderline />
                            </button>
                        </div>
                        <div className='button-container'>
                            <button className='save-button' onClick={saveNote}>Guardar Nota</button>
                            <button className='back-button' onClick={() => setShowPrincipal(true)}>Volver</button>
                        </div>
                    </div>
                    <input 
                        type="text" 
                        className='title-note' 
                        placeholder='Título de la nota' 
                        value={title}
                        onChange={handleTitleInput}
                    />
                    <textarea
                        className={`note-input ${isFocused ? 'focused' : ''}`}
                        value={note}
                        onChange={handleInput}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        placeholder='¡Comienza tu nueva nota!' 
                    />
                </div>
            )}
        </div>
    );
}

export default Block;
