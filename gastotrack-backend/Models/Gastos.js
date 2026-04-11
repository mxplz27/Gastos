const mongoose = require('mongoose');

const gastoSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true,
  },
  titulo: {
    type: String,
    required: [true, 'El título es obligatorio'],
    trim: true,
  },
  descripcion: {
    type: String,
    trim: true,
    default: '',
  },
  monto: {
    type: Number,
    required: [true, 'El monto es obligatorio'],
    min: [0, 'El monto no puede ser negativo'],
  },
  categoria: {
    type: String,
    enum: ['Vivienda', 'Alimentación', 'Movilidad', 'Ocio', 'Salud', 'Educación', 'Servicios', 'Otro'],
    default: 'Otro',
  },
  fecha: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

module.exports = mongoose.model('Gasto', gastoSchema);