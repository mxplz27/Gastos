const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ───────────────────────────────
// 🔥 CORS PRODUCCIÓN (FIX FINAL)
// ───────────────────────────────
app.use(cors({
  origin: (origin, callback) => {
    if (
      !origin ||
      origin.includes('localhost') ||
      origin.includes('.vercel.app')
    ) {
      callback(null, true);
    } else {
      callback(null, true); // (modo permisivo para evitar errores en deploy)
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

app.use(express.json());

// ───────────────────────────────
// 🔥 MONGO DB CONNECTION
// ───────────────────────────────
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB conectado'))
  .catch(err => console.error('❌ Error MongoDB:', err));

// ───────────────────────────────
// 🔥 ROUTES
// ───────────────────────────────
app.use('/api/auth', require('./Routes/auth'));
app.use('/api/gastos', require('./Routes/Gastos'));
app.use('/api/metas', require('./Routes/metas'));

// ───────────────────────────────
// 🔥 TEST SERVER
// ───────────────────────────────
app.get('/', (req, res) => {
  res.json({ mensaje: 'GastoTrack API funcionando 🚀' });
});

// ───────────────────────────────
// 🔥 START SERVER
// ───────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en puerto ${PORT}`));