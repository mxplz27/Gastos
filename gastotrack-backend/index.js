const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://gastos-1-qah3.onrender.com',
    /\.vercel\.app$/,  // permite cualquier subdominio de vercel
  ],
  credentials: true,
}));

app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB conectado'))
  .catch(err => console.error('❌ Error MongoDB:', err));

app.use('/api/auth',   require('./Routes/auth'));
app.use('/api/gastos', require('./Routes/Gastos'));
app.use('/api/metas',  require('./Routes/metas'));

app.get('/', (req, res) => res.json({ mensaje: 'GastoTrack API funcionando' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en puerto ${PORT}`));