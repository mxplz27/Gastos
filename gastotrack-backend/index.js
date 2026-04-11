const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middlewares globales
app.use(cors({ origin: 'http://localhost:5173' })); // puerto de Vite
app.use(express.json());

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB conectado'))
  .catch(err => console.error('❌ Error MongoDB:', err));

// Rutas
app.use('/api/auth',   require('./Routes/auth'));
app.use('/api/gastos', require('./Routes/Gastos'));

// Ruta de prueba
app.get('/', (req, res) => res.json({ mensaje: 'GastoTrack API funcionando' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en puerto ${PORT}`));
