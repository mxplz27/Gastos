const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ───────────────────────────────
// 🔥 CONFIGURACIÓN CORS (PRODUCCIÓN + LOCAL)
// ───────────────────────────────
app.use(cors({
  origin: function(origin, callback) {
    const allowed = [
      'http://localhost:5173',
      'http://localhost:4173',
      'https://gastos-x2iw.vercel.app',
    ];
    if (!origin || allowed.includes(origin) || origin.endsWith('.vercel.app')) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));

// ───────────────────────────────
// 🔥 MIDDLEWARE
// ───────────────────────────────
app.use(express.json());

// ───────────────────────────────
// 🔥 CONEXIÓN A MONGODB
// ───────────────────────────────
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB conectado'))
  .catch(err => console.error('❌ Error MongoDB:', err));

// ───────────────────────────────
// 🔥 RUTAS
// ───────────────────────────────
app.use('/api/auth', require('./Routes/auth'));
app.use('/api/gastos', require('./Routes/Gastos'));

// ───────────────────────────────
// 🔥 RUTA DE PRUEBA
// ───────────────────────────────
app.get('/', (req, res) => {
  res.json({ mensaje: 'Gastos financieros API funcionando 🚀' });
});

// ───────────────────────────────
// 🔥 INICIAR SERVIDOR
// ───────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});