import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './layout/Components/Header';
import Footer from './layout/Components/Footer';
import Components from './layout/Components/Components';
import { ApiRyC } from './features/api/components/ApiRyC';
import Registro from './features/auth/Registro';
import Inicio from './features/auth/Inicio';
import Seguimiento from './features/auth/Seguimiento';
import MisGastos from './features/auth/MisGastos';

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/Inicio" element={<Inicio />} />
        <Route path="/components" element={<Components />} />
        <Route path="/api" element={<ApiRyC />} />
        <Route path="/Registro" element={<Registro />} />
        <Route path="/MisGastos" element={<MisGastos />} />
        <Route path="/Seguimiento" element={<Seguimiento />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}