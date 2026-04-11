const router = require('express').Router();
const Gasto = require('../Models/Gastos');
const auth = require('../middleware/middleware');

// ── GET /api/gastos/resumen ──────────────────────────────────────────────────
// OJO: esta ruta va ANTES de /:id para que no la confunda
router.get('/resumen', auth, async (req, res) => {
  try {
    const ahora = new Date();
    const inicioDeMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1);

    const gastos = await Gasto.find({
      usuario: req.usuario.id,
      fecha: { $gte: inicioDeMes },
    });

    const totalGastado = gastos.reduce((acc, g) => acc + g.monto, 0);

    // Por ahora ingresos es fijo; luego puedes crear un modelo Ingreso
    const ingresos = 3500000;

    res.json({
      totalGastado,
      ingresos,
      ahorro: ingresos - totalGastado,
      cantidadGastos: gastos.length,
    });
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al calcular resumen.' });
  }
});

// ── GET /api/gastos?limite=4 ─────────────────────────────────────────────────
router.get('/', auth, async (req, res) => {
  try {
    const limite = parseInt(req.query.limite) || 20;
    const gastos = await Gasto.find({ usuario: req.usuario.id })
      .sort({ fecha: -1 })
      .limit(limite);
    res.json(gastos);
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al obtener gastos.' });
  }
});

// ── POST /api/gastos ─────────────────────────────────────────────────────────
router.post('/', auth, async (req, res) => {
  try {
    const { titulo, descripcion, monto, categoria, fecha } = req.body;

    if (!titulo || !monto) {
      return res.status(400).json({ mensaje: 'Título y monto son obligatorios.' });
    }

    const gasto = new Gasto({
      usuario: req.usuario.id,
      titulo,
      descripcion,
      monto,
      categoria,
      fecha,
    });

    await gasto.save();
    res.status(201).json(gasto);
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al guardar el gasto.' });
  }
});

// ── PUT /api/gastos/:id ──────────────────────────────────────────────────────
router.put('/:id', auth, async (req, res) => {
  try {
    const gasto = await Gasto.findOneAndUpdate(
      { _id: req.params.id, usuario: req.usuario.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!gasto) return res.status(404).json({ mensaje: 'Gasto no encontrado.' });
    res.json(gasto);
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al actualizar.' });
  }
});

// ── DELETE /api/gastos/:id ───────────────────────────────────────────────────
router.delete('/:id', auth, async (req, res) => {
  try {
    const gasto = await Gasto.findOneAndDelete({
      _id: req.params.id,
      usuario: req.usuario.id,
    });
    if (!gasto) return res.status(404).json({ mensaje: 'Gasto no encontrado.' });
    res.json({ mensaje: 'Gasto eliminado correctamente.' });
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al eliminar.' });
  }
});
router.put('/:id', auth, async (req, res) => {
  try {
    const gasto = await Gasto.findOneAndUpdate(
      { _id: req.params.id, usuario: req.usuario.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!gasto) return res.status(404).json({ mensaje: 'Gasto no encontrado.' });
    res.json(gasto);
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al actualizar.' });
  }
});

module.exports = router;