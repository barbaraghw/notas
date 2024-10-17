import React from 'react';
import Login from './Login';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './login.css';
import Block from './Block';
import './block.css';

function App() {
    return (
<Router>
<div className="App">
    <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Block" element={<Block />} />
        <Route path="/" element={<principal-container/>} />
        <Route path="/secondary" element={<notes-container />} />
    </Routes>
</div>
</Router>
);
}


export default App;
