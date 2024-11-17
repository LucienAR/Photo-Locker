import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Home from './pages/Home';
import ShowAlbum from './pages/ShowAlbum';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/showalbum/:id" element={<ShowAlbum />} /> {/* เพิ่มเส้นทางสำหรับ ShowAlbum */}
      </Routes>
    </div>
  );
}

export default App;
