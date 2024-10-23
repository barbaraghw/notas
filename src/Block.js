import React, { useState, useRef, useEffect } from 'react'; 
import { FaNoteSticky, FaCircleArrowRight, FaCircleArrowLeft } from "react-icons/fa6";
import { FaBold, FaItalic, FaUnderline, FaTrash } from "react-icons/fa";
import { firestore, auth } from './config/config'; 
import { doc, setDoc, collection, getDocs, deleteDoc } from "firebase/firestore"; 
import { TfiWrite } from "react-icons/tfi"; 
import { MdAdd } from "react-icons/md";

const Popup = ({ note, onClose }) => {
    if (!note) return null;

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <h2>{note.title}</h2>
                <p>{note.content}</p>
                <p>Creado el: {note.createdAt.toLocaleDateString('es-ES')}</p>
                <button onClick={onClose}>Cerrar</button>
            </div>
        </div>
    );
};

function Block() {
    const [showPrincipal, setShowPrincipal] = useState(false);
    const [showEditor, setShowEditor] = useState(false);
    const [note, setNote] = useState('');
    const [title, setTitle] = useState('');
    const [isBold, setIsBold] = useState(false);
    const [isItalic, setIsItalic] = useState(false);
    const [isUnderlined, setIsUnderlined] = useState(false);
    const [notes, setNotes] = useState([]);
    const [filteredNotes, setFilteredNotes] = useState([]);
    const [startIndex, setStartIndex] = useState(0);
    const [showBackButton, setShowBackButton] = useState(false);
    
    const [folders, setFolders] = useState([]);
    const [selectedFolder, setSelectedFolder] = useState(null); 
    const [newFolderName, setNewFolderName] = useState(''); 
    const [showFolderInput, setShowFolderInput] = useState(false);
    const [selectedNote, setSelectedNote] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    
    const notesToShow = filteredNotes.slice(startIndex, startIndex + 4);
    const noteInputRef = useRef(null);

    const toggleBold = () => setIsBold(prev => !prev);
    const toggleItalic = () => setIsItalic(prev => !prev);
    const toggleUnderlined = () => setIsUnderlined(prev => !prev);

    const newNote = () => {
        setShowEditor(true);
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

    const addFolder = () => {
        if (newFolderName.trim() !== '') {
            const newFolder = {
                id: Date.now(),
                name: newFolderName,
                notes: [] 
            };
            setFolders(prev => [...prev, newFolder]);
            setNewFolderName('');
            setShowFolderInput(false);
        }
    };

    const toggleFolderInput = () => {
        if (showFolderInput) {
            addFolder();
        } else {
            setShowFolderInput(true);
        }
    };

    const selectFolder = (folder) => {
        setSelectedFolder(folder);
    };

    const showMoreNotes = () => {
        setStartIndex(prevIndex => Math.min(prevIndex + 4, filteredNotes.length));
    };

    const showLessNotes = () => {
        setStartIndex(prevIndex => Math.max(prevIndex - 4, 0));
    };

    const showAllNotes = () => {
        setStartIndex(0);
        setFilteredNotes(notes);
        setShowBackButton(notes.length > 4);
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
                        createdAt: data.createdAt.toDate() 
                    };
                }).sort((a, b) => b.createdAt - a.createdAt);

                setNotes(notesList);
                setFilteredNotes(notesList);
                setShowBackButton(notesList.length > 4); 
            }
        };

        fetchNotes();
    }, []);
    
    const handleInput = (e) => {
        setNote(e.currentTarget.textContent);
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
                
                const newNote = { ...noteData, id: noteRef.id };
                setNotes(prevNotes => [...prevNotes, newNote]);
                setFilteredNotes(prevNotes => [...prevNotes, newNote]);
                setStartIndex(0);
                setShowBackButton([...notes, noteData].length > 4);

                alert('Nota guardada exitosamente!');
                setNote('');
                setTitle('');
                setShowEditor(false);
                setShowPrincipal(true);
                if (noteInputRef.current) {
                    noteInputRef.current.innerHTML = '';
                }
            } catch (error) {
                console.error('Error al guardar la nota: ', error);
            }
        } 
    };

    const filterNotes = (type) => {
        const now = new Date();
        let filtered;

        if (type === 'today') {
            filtered = notes.filter(note => note.createdAt.toDateString() === now.toDateString());
        } else if (type === 'thisMonth') {
            filtered = notes.filter(note => note.createdAt.getMonth() === now.getMonth() && note.createdAt.getFullYear() === now.getFullYear());
        } else if (type === 'thisYear') {
            filtered = notes.filter(note => note.createdAt.getFullYear() === now.getFullYear());
        } else {
            filtered = notes;
        }
        
        setFilteredNotes(filtered);
        setStartIndex(0); 
        setShowBackButton(filtered.length > 4); 
    };

    const openPopup = (note) => {
        setSelectedNote(note);
        setShowPopup(true);
    };

    const handleBackToPrincipal = () => {
        setShowEditor(false);
        setSelectedFolder(null);
        setShowPrincipal(true);
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
                <button className='new-note' onClick={newNote}>Nueva nota</button>
    
                {showEditor && (
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
                                <button className='back-button' onClick={handleBackToPrincipal}>Volver</button>
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
                            onInput={handleInput}
                            style={{
                                fontWeight: isBold ? 'bold' : 'normal',
                                fontStyle: isItalic ? 'italic' : 'normal',
                                textDecoration: isUnderlined ? 'underline' : 'none'
                            }}
                        />
                    </div>
                )}

                <div className='folders'>
                    Carpetas
                </div>
                <div className="folders-list">
                    {folders.map(folder => (
                        <button key={folder.id} onClick={() => selectFolder(folder)}>
                            {folder.name}
                        </button>
                    ))}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                    {showFolderInput && (
                        <input 
                            type="text" 
                            value={newFolderName} 
                            onChange={(e) => setNewFolderName(e.target.value)} 
                            placeholder="Nombre de la carpeta" 
                        />
                    )}
                    <button className="add-folder-button" onClick={toggleFolderInput}>
                        <span className="add-folder-icon"><MdAdd /></span>
                    </button>
                </div>

                {selectedFolder ? (
                    <div>
                        <h1>{selectedFolder.name}</h1>
                        {selectedFolder.notes.map(note => (
                            <div key={note.id}>
                                <h3>{note.title}</h3>
                                <p>{note.content}</p>
                                <button onClick={() => deleteNote(note.id)}>Borrar</button>
                            </div>
                        ))}
                        <button onClick={() => setSelectedFolder(null)}>Volver a todas las notas</button>
                    </div>
                ) : (
                    showPrincipal && (
                    <div className='principal-container'>
                        <div className='title-folders'>Carpetas recientes</div>
                        <div className="button-container">
                            <button onClick={showAllNotes}>Todas</button>
                            <button onClick={() => filterNotes('today')}>Hoy</button>
                            <button onClick={() => filterNotes('thisMonth')}>Este mes</button>
                        </div>
                        <div className='folder-container'>
                            {showBackButton && startIndex > 0 && (
                                <button className='back2-button' onClick={showLessNotes}>
                                    <FaCircleArrowLeft />
                                </button>
                            )}
                            {notesToShow.map(note => (
                                <div className='folder' key={note.id} onClick={() => openPopup(note)}>
                                    <span className='icon'><FaNoteSticky /></span>
                                    <button className='trash-icon' onClick={() => deleteNote(note.id)}><FaTrash /></button>
                                    <div className='text'>
                                        <h3>{note.title}</h3>
                                        <p className='note-content'>{note.content}</p>
                                        <h4>{note.createdAt.toLocaleDateString('es-ES')}</h4>
                                    </div>
                                </div>
                            ))}
                            {startIndex + 4 < filteredNotes.length && (
                                <button className='back2-button' onClick={showMoreNotes}>
                                    <FaCircleArrowRight />
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            {showPopup && <Popup note={selectedNote} onClose={() => setShowPopup(false)} />}
        </div>
    );
}

export default Block;
