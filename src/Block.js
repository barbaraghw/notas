import React, { useState, useRef, useEffect } from 'react'; 
import { FaNoteSticky } from "react-icons/fa6";
import { FaBold, FaItalic, FaUnderline } from "react-icons/fa";
import { firestore, auth } from './config/config'; 
import { doc, setDoc, collection, getDocs, deleteDoc } from "firebase/firestore"; 
import { TfiWrite } from "react-icons/tfi"; 

function Block() {
    const [showPrincipal, setShowPrincipal] = useState(false);
    const [note, setNote] = useState('');
    const [title, setTitle] = useState('');
    const [isBold, setIsBold] = useState(false);
    const [isItalic, setIsItalic] = useState(false);
    const [isUnderlined, setIsUnderlined] = useState(false);
    const [notes, setNotes] = useState([]);
    const [filteredNotes, setFilteredNotes] = useState([]);

    const noteInputRef = useRef(null);

    const toggleBold = () => setIsBold(prev => !prev);
    const toggleItalic = () => setIsItalic(prev => !prev);
    const toggleUnderlined = () => setIsUnderlined(prev => !prev);
    
    const newNote = () => {
        setShowPrincipal(false);
        setNote('');
        setTitle('');
        if (noteInputRef.current) {
            noteInputRef.current.innerHTML = ''; 
        }
    };

    const deleteNote = async (id) => {
        try {
            await deleteDoc(doc(firestore, 'notes', id));
            setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
            setFilteredNotes(prevNotes => prevNotes.filter(note => note.id !== id));
            alert('Nota borrada.');
        } catch (error) {
            console.error('Error al borrar la nota: ', error);
        }
    };

    useEffect(() => {
        const fetchNotes = async () => {
            const user = auth.currentUser;
            if (user) {
                const notesCollection = collection(firestore, 'notes');
                const notesSnapshot = await getDocs(notesCollection);
                const notesList = notesSnapshot.docs.map(doc => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        title: data.title,
                        content: data.content,
                        userId: data.userId,
                        createdAt: data.createdAt.toDate() // Convertir a Date
                    };
                });
                setNotes(notesList);
                setFilteredNotes(notesList); // Inicialmente, mostrar todas las notas
            }
        };
    
        fetchNotes();
    }, []);

    const mostrarPrincipal = () => {
        setShowPrincipal(true);
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
    
                setNotes(prevNotes => [...prevNotes, {...noteData, id: noteRef.id}]);
                setFilteredNotes(prevNotes => [...prevNotes, {...noteData, id: noteRef.id}]);

                alert('Nota guardada exitosamente!');
                setNote('');
                setTitle('');
                if (noteInputRef.current) {
                    noteInputRef.current.innerHTML = '';
                }
            } catch (error) {
                console.error('Error al guardar la nota: ', error);
            }
        } else {
            alert('Por favor, inicie sesión para guardar notas.');
        }
    };

    const filterNotes = (type) => {
        const now = new Date();
        let filtered;

        if (type === 'today') {
            filtered = notes.filter(note => {
                return note.createdAt.toDateString() === now.toDateString();
            });
        } else if (type === 'thisMonth') {
            filtered = notes.filter(note => {
                return note.createdAt.getMonth() === now.getMonth() && note.createdAt.getFullYear() === now.getFullYear();
            });
        } else if (type === 'thisYear') {
            filtered = notes.filter(note => {
                return note.createdAt.getFullYear() === now.getFullYear();
            });
        } else {
            filtered = notes;
        }
        
        setFilteredNotes(filtered);
    }

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
                <button onClick={newNote}>Nueva nota</button>
            </div>
            {showPrincipal ? (
                <div className='principal-container'>
                    <h2>Carpetas recientes</h2>
                    <button onClick={() => filterNotes('today')}>Hoy</button>
                    <button onClick={() => filterNotes('thisWeek')}>Esta semana</button>
                    <button onClick={() => filterNotes('thisMonth')}>Este mes</button>
                    <div className='folder-container'>
                        {filteredNotes.map(note => (
                            <div className='folder' key={note.id}>
                                <span className='icon'><FaNoteSticky /></span>
                                <div className='text'>
                                    <h3>{note.title}</h3>
                                    <p className='note-content'>{note.content}</p>
                                    <h4>{note.createdAt.toLocaleDateString('es-ES')}</h4>
                                    <button onClick={() => deleteNote(note.id)}>Borrar</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className='secondary-container'>
                    <h2 className='new-note-title'>¡Nueva nota!</h2> 
                    <div className='top-row'>
                        <div className='toolbar'>
                            <button onClick={toggleBold}>
                                <FaBold />
                            </button>
                            <button onClick={toggleItalic}>
                                <FaItalic />
                            </button>
                            <button onClick={toggleUnderlined}>
                                <FaUnderline />
                            </button>
                        </div>
                        <div className='button-container'>
                            <button className='save-button' onClick={saveNote}>Guardar Nota</button>
                            <button className='delete-button' onClick={deleteNote}>Borrar</button>
                            <button className='back-button' onClick={mostrarPrincipal}>Volver</button>
                        </div>
                    </div>
                    <input 
                        type="text" 
                        className='title-note' 
                        placeholder='Título de la nota' 
                        value={title}
                        onChange={handleTitleInput}
                    />
                    <div
                        ref={noteInputRef}
                        contentEditable
                        className='note-input'
                        onInput={(e) => setNote(e.currentTarget.textContent)}
                        style={{
                            fontWeight: isBold ? 'bold' : 'normal',
                            fontStyle: isItalic ? 'italic' : 'normal',
                            textDecoration: isUnderlined ? 'underline' : 'none'
                        }}
                    />
                </div>
            )}
        </div>
    );
};

export default Block;
