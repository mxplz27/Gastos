import { useState, useEffect } from 'react';
import {
  Box, Typography, TextField, Button, MenuItem, Select,
  InputLabel, FormControl, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, IconButton, InputAdornment,
  CircularProgress, Snackbar, Alert, Dialog, DialogTitle,
  DialogContent, DialogActions, DialogContentText,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Link } from 'react-router-dom';

const VERDE = '#22c55e';
const API = 'https://gastos-6upo.onrender.com';

const categorias = ['Alimentación', 'Movilidad', 'Vivienda', 'Ocio', 'Salud', 'Educación', 'Servicios', 'Otro'];

const catColors = {
  Alimentación: { bg: 'rgba(251,146,60,0.12)',  color: '#c2410c' },
  Movilidad:    { bg: 'rgba(96,165,250,0.12)',   color: '#1d4ed8' },
  Vivienda:     { bg: 'rgba(248,113,113,0.12)',  color: '#b91c1c' },
  Ocio:         { bg: 'rgba(167,139,250,0.12)',  color: '#6d28d9' },
  Salud:        { bg: 'rgba(34,197,94,0.12)',    color: '#15803d' },
  Educación:    { bg: 'rgba(250,204,21,0.12)',   color: '#854d0e' },
  Servicios:    { bg: 'rgba(129,140,248,0.12)',  color: '#4338ca' },
  Otro:         { bg: 'rgba(148,163,184,0.12)',  color: '#475569' },
};

const inputSx = {
  mb: 1.5,
  '& .MuiOutlinedInput-root': {
    borderRadius: 2,
    '& fieldset': { borderColor: '#e2e8f0' },
    '&:hover fieldset': { borderColor: VERDE },
    '&.Mui-focused fieldset': { borderColor: VERDE },
  },
  '& label.Mui-focused': { color: VERDE },
};

const dialogInputSx = { ...inputSx };
const fmt = (n) => `$${Math.round(n).toLocaleString('es-CO')}`;

export default function MisGastos() {
  const usuario = JSON.parse(localStorage.getItem('usuarioActivo') || 'null');
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${usuario?.token}`,
  };

  const [form, setForm]             = useState({ titulo: '', descripcion: '', monto: '', categoria: '', fecha: '' });
  const [gastos, setGastos]         = useState([]);
  const [busqueda, setBusqueda]     = useState('');
  const [filtroCat, setFiltroCat]   = useState('');
  const [error, setError]           = useState('');
  const [loading, setLoading]       = useState(false);
  const [guardando, setGuardando]   = useState(false);
  const [snack, setSnack]           = useState({ open: false, msg: '', tipo: 'success' });
  const [editandoId, setEditandoId] = useState(null);
  const [alertaLogin, setAlertaLogin]     = useState(false);
  const [confirmEliminar, setConfirmEliminar] = useState({ open: false, id: null, titulo: '' });
  const [confirmEditar, setConfirmEditar]     = useState({ open: false, gasto: null });
  const [modalEditar, setModalEditar]         = useState(false);
  const [formEditar, setFormEditar]           = useState({ titulo: '', descripcion: '', monto: '', categoria: '', fecha: '' });
  const [guardandoEditar, setGuardandoEditar] = useState(false);

  // ── Carga gastos ─────────────────────────────────────────────────────────
  const fetchGastos = async () => {
    if (!usuario) return;
    setLoading(true);
    try {
      const res  = await fetch(API, { headers });
      const data = await res.json();
      setGastos(Array.isArray(data) ? data : []);
    } catch {
      setSnack({ open: true, msg: 'Error al cargar gastos.', tipo: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (usuario) fetchGastos();
    else setLoading(false);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  // ── Agregar ──────────────────────────────────────────────────────────────
  const handleAgregar = async () => {
    if (!usuario) { setAlertaLogin(true); return; }
    if (!form.titulo || !form.monto || !form.categoria || !form.fecha) {
      setError('Completa todos los campos.'); return;
    }
    if (isNaN(form.monto) || Number(form.monto) <= 0) {
      setError('El monto debe ser un número válido.'); return;
    }
    setGuardando(true);
    try {
      const res = await fetch(API, {
        method: 'POST', headers,
        body: JSON.stringify({
          titulo: form.titulo, descripcion: form.descripcion,
          monto: parseFloat(form.monto), categoria: form.categoria, fecha: form.fecha,
        }),
      });
      if (!res.ok) throw new Error();
      setForm({ titulo: '', descripcion: '', monto: '', categoria: '', fecha: '' });
      setSnack({ open: true, msg: 'Gasto agregado correctamente ✓', tipo: 'success' });
      fetchGastos();
    } catch {
      setSnack({ open: true, msg: 'Error al guardar el gasto.', tipo: 'error' });
    } finally {
      setGuardando(false);
    }
  };

  // ── Eliminar ─────────────────────────────────────────────────────────────
  const pedirConfirmEliminar = (gasto) =>
    setConfirmEliminar({ open: true, id: gasto._id, titulo: gasto.titulo });

  const handleEliminar = async () => {
    try {
      await fetch(`${API}/${confirmEliminar.id}`, { method: 'DELETE', headers });
      setGastos(prev => prev.filter(g => g._id !== confirmEliminar.id));
      setSnack({ open: true, msg: 'Gasto eliminado correctamente.', tipo: 'warning' });
    } catch {
      setSnack({ open: true, msg: 'Error al eliminar.', tipo: 'error' });
    } finally {
      setConfirmEliminar({ open: false, id: null, titulo: '' });
    }
  };

  // ── Editar ───────────────────────────────────────────────────────────────
  const abrirEditar = (gasto) => {
    setEditandoId(gasto._id);
    setConfirmEditar({ open: true, gasto });
  };

  const abrirModalEditar = () => {
    const g = confirmEditar.gasto;
    setFormEditar({
      titulo: g.titulo, descripcion: g.descripcion || '',
      monto: g.monto, categoria: g.categoria,
      fecha: g.fecha ? g.fecha.substring(0, 10) : '',
    });
    setConfirmEditar({ open: false, gasto: null });
    setModalEditar(true);
  };

  const handleGuardarEdicionFinal = async () => {
    if (!formEditar.titulo || !formEditar.monto || !formEditar.categoria || !formEditar.fecha) {
      setSnack({ open: true, msg: 'Completa todos los campos.', tipo: 'error' }); return;
    }
    setGuardandoEditar(true);
    try {
      const res = await fetch(`${API}/${editandoId}`, {
        method: 'PUT', headers,
        body: JSON.stringify({
          titulo: formEditar.titulo, descripcion: formEditar.descripcion,
          monto: parseFloat(formEditar.monto), categoria: formEditar.categoria, fecha: formEditar.fecha,
        }),
      });
      if (!res.ok) throw new Error();
      setSnack({ open: true, msg: 'Gasto actualizado correctamente ✓', tipo: 'success' });
      setModalEditar(false);
      fetchGastos();
    } catch {
      setSnack({ open: true, msg: 'Error al actualizar el gasto.', tipo: 'error' });
    } finally {
      setGuardandoEditar(false);
    }
  };

  const gastosFiltrados = gastos.filter(g =>
    (g.titulo || '').toLowerCase().includes(busqueda.toLowerCase()) &&
    (!filtroCat || g.categoria === filtroCat)
  );

  const total = gastos.reduce((a, g) => a + g.monto, 0);
  const avg   = gastos.length ? total / gastos.length : 0;

  return (
    <Box sx={{ bgcolor: '#f1f5f9', minHeight: '100vh', px: { xs: 3, md: 6 }, py: 5 }}>
      <Box sx={{ maxWidth: 960, mx: 'auto' }}>

        <Typography variant="h5" sx={{ fontWeight: 500, color: '#0f172a', mb: 0.5 }}>Mis gastos</Typography>
        <Typography variant="body2" sx={{ color: '#94a3b8', mb: 3.5 }}>
          Registra y controla tus movimientos del mes
        </Typography>

        {/* ── Banner invitado ── */}
        {!usuario && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, bgcolor: 'rgba(34,197,94,0.08)', border: '0.5px solid rgba(34,197,94,0.3)', borderRadius: '12px', px: 3, py: 2, mb: 3 }}>
            <LockOutlinedIcon sx={{ color: VERDE, fontSize: 20, flexShrink: 0 }} />
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontSize: 13, fontWeight: 500, color: '#0f172a' }}>Estás viendo la página como invitado</Typography>
              <Typography sx={{ fontSize: 12, color: '#64748b' }}>Para guardar tus gastos inicia sesión o créate una cuenta gratis.</Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, flexShrink: 0 }}>
              <Button component={Link} to="/Inicio" size="small"
                sx={{ color: VERDE, border: `0.5px solid rgba(34,197,94,0.4)`, borderRadius: 2, textTransform: 'none', fontSize: 12, px: 1.5 }}>
                Iniciar sesión
              </Button>
              <Button component={Link} to="/Registro" size="small" variant="contained"
                sx={{ bgcolor: VERDE, color: '#0f172a', borderRadius: 2, textTransform: 'none', fontSize: 12, px: 1.5, fontWeight: 500, '&:hover': { bgcolor: '#16a34a' } }}>
                Registrarse
              </Button>
            </Box>
          </Box>
        )}

        {/* ── Stats ── */}
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1.5, mb: 3.5 }}>
          {[
            { label: 'Total gastos',       valor: fmt(total),    color: '#f87171' },
          ].map(s => (
            <Box key={s.label} sx={{ bgcolor: '#fff', borderRadius: '12px', border: '0.5px solid #e2e8f0', p: 2 }}>
              <Typography sx={{ fontSize: 12, color: '#94a3b8', mb: 0.5 }}>{s.label}</Typography>
              <Typography sx={{ fontSize: 20, fontWeight: 500, color: s.color }}>{s.valor}</Typography>
            </Box>
          ))}
        </Box>

        <Box sx={{ display: 'flex', gap: 2.5, alignItems: 'flex-start', flexWrap: 'wrap' }}>

          {/* ── Formulario ── */}
          <Box sx={{ bgcolor: '#fff', borderRadius: '12px', border: '0.5px solid #e2e8f0', p: 2.5, width: 260, flexShrink: 0 }}>
            <Typography sx={{ fontSize: 14, fontWeight: 500, color: '#0f172a', mb: 2 }}>Agregar gasto</Typography>
            <TextField fullWidth size="small" label="Título" name="titulo"
              value={form.titulo} onChange={handleChange} sx={inputSx} />
            <TextField fullWidth size="small" label="Descripción (opcional)" name="descripcion"
              value={form.descripcion} onChange={handleChange} sx={inputSx} />
            <TextField fullWidth size="small" label="Monto" name="monto" type="number"
              value={form.monto} onChange={handleChange} sx={inputSx}
              InputProps={{ startAdornment: <InputAdornment position="start"><Typography sx={{ fontSize: 13, color: '#94a3b8' }}>$</Typography></InputAdornment> }} />
            <FormControl fullWidth size="small" sx={inputSx}>
              <InputLabel>Categoría</InputLabel>
              <Select name="categoria" value={form.categoria} onChange={handleChange} label="Categoría">
                {categorias.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
              </Select>
            </FormControl>
            <TextField fullWidth size="small" label="Fecha" name="fecha" type="date"
              value={form.fecha} onChange={handleChange} sx={inputSx}
              InputLabelProps={{ shrink: true }} />
            {error && <Typography sx={{ fontSize: 12, color: '#f87171', mb: 1 }}>{error}</Typography>}
            <Button fullWidth onClick={handleAgregar} disabled={guardando} sx={{
              bgcolor: VERDE, color: '#0f172a', borderRadius: 2,
              textTransform: 'none', fontWeight: 500, mt: 0.5,
              '&:hover': { bgcolor: '#16a34a' },
              '&.Mui-disabled': { bgcolor: '#bbf7d0', color: '#0f172a' },
            }}>
              {guardando ? 'Guardando...' : '+ Agregar gasto'}
            </Button>
          </Box>

          {/* ── Tabla ── */}
          <Box sx={{ flex: 1, minWidth: 280 }}>
            <Box sx={{ display: 'flex', gap: 1.5, mb: 2, flexWrap: 'wrap' }}>
              <TextField size="small" placeholder="Buscar gasto..." value={busqueda}
                onChange={e => setBusqueda(e.target.value)}
                sx={{ flex: 1, minWidth: 160, ...inputSx, mb: 0 }}
                InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 16, color: '#94a3b8' }} /></InputAdornment> }} />
              <FormControl size="small" sx={{ width: 160 }}>
                <InputLabel>Categoría</InputLabel>
                <Select value={filtroCat} onChange={e => setFiltroCat(e.target.value)} label="Categoría"
                  sx={{ borderRadius: 2, '& fieldset': { borderColor: '#e2e8f0' } }}>
                  <MenuItem value="">Todas</MenuItem>
                  {categorias.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                </Select>
              </FormControl>
            </Box>

            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                <CircularProgress sx={{ color: VERDE }} />
              </Box>
            ) : (
              <TableContainer sx={{ bgcolor: '#fff', borderRadius: '12px', border: '0.5px solid #e2e8f0' }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#f8fafc', '& th': { fontSize: 11, fontWeight: 500, color: '#94a3b8', borderBottom: '0.5px solid #e2e8f0' } }}>
                      <TableCell>Fecha</TableCell>
                      <TableCell>Título</TableCell>
                      <TableCell>Descripción</TableCell>
                      <TableCell>Categoría</TableCell>
                      <TableCell align="right">Monto</TableCell>
                      {usuario && <TableCell align="center">Acciones</TableCell>}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {gastosFiltrados.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} align="center" sx={{ py: 5, border: 'none' }}>
                          <Typography sx={{ fontSize: 32, mb: 1 }}>💸</Typography>
                          <Typography sx={{ fontSize: 13, color: '#cbd5e1' }}>
                            {usuario ? 'Sin gastos registrados' : 'Inicia sesión para ver tus gastos'}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : gastosFiltrados.map(g => {
                      const c = catColors[g.categoria] || catColors['Otro'];
                      return (
                        <TableRow key={g._id} sx={{ '&:hover': { bgcolor: '#f8fafc' }, '& td': { borderBottom: '0.5px solid #f1f5f9', fontSize: 13 } }}>
                          <TableCell sx={{ color: '#64748b', fontSize: '12px !important' }}>
                            {new Date(g.fecha).toLocaleDateString('es-CO')}
                          </TableCell>
                          <TableCell sx={{ color: '#0f172a', fontWeight: 500 }}>{g.titulo}</TableCell>
                          <TableCell sx={{ color: '#64748b' }}>{g.descripcion || '—'}</TableCell>
                          <TableCell>
                            <Box sx={{ display: 'inline-block', bgcolor: c.bg, color: c.color, px: 1.2, py: 0.3, borderRadius: '6px', fontSize: 11, fontWeight: 500 }}>
                              {g.categoria}
                            </Box>
                          </TableCell>
                          <TableCell align="right" sx={{ color: '#f87171', fontWeight: 500 }}>
                            {fmt(g.monto)}
                          </TableCell>
                          {usuario && (
                            <TableCell align="center">
                              <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                                <IconButton size="small" onClick={() => abrirEditar(g)}
                                  sx={{ color: '#e2e8f0', '&:hover': { color: VERDE, bgcolor: 'rgba(34,197,94,0.1)' } }}>
                                  <EditIcon sx={{ fontSize: 16 }} />
                                </IconButton>
                                <IconButton size="small" onClick={() => pedirConfirmEliminar(g)}
                                  sx={{ color: '#e2e8f0', '&:hover': { color: '#f87171', bgcolor: 'rgba(248,113,113,0.1)' } }}>
                                  <DeleteIcon sx={{ fontSize: 16 }} />
                                </IconButton>
                              </Box>
                            </TableCell>
                          )}
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
        </Box>
      </Box>

      {/* ── Alerta login ── */}
      <Dialog open={alertaLogin} onClose={() => setAlertaLogin(false)}
        PaperProps={{ sx: { borderRadius: '12px', p: 1, maxWidth: 360 } }}>
        <DialogTitle sx={{ fontWeight: 500, color: '#0f172a', fontSize: 16, display: 'flex', alignItems: 'center', gap: 1 }}>
          <LockOutlinedIcon sx={{ color: VERDE, fontSize: 20 }} />
          ¿Quieres guardar este gasto?
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontSize: 13, color: '#64748b' }}>
            Para guardar tus gastos y acceder a tu historial necesitas una cuenta. Es gratis y toma menos de un minuto.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button onClick={() => setAlertaLogin(false)}
            sx={{ color: '#64748b', textTransform: 'none', borderRadius: 2, border: '0.5px solid #e2e8f0', px: 2, fontSize: 13 }}>
            Cancelar
          </Button>
          <Button component={Link} to="/Inicio"
            sx={{ color: VERDE, textTransform: 'none', borderRadius: 2, border: `0.5px solid rgba(34,197,94,0.4)`, px: 2, fontSize: 13 }}>
            Iniciar sesión
          </Button>
          <Button component={Link} to="/Registro" variant="contained"
            sx={{ bgcolor: VERDE, color: '#0f172a', textTransform: 'none', borderRadius: 2, px: 2, fontSize: 13, fontWeight: 500, '&:hover': { bgcolor: '#16a34a' } }}>
            Registrarse
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Dialog ELIMINAR ── */}
      <Dialog open={confirmEliminar.open} onClose={() => setConfirmEliminar({ open: false, id: null, titulo: '' })}
        PaperProps={{ sx: { borderRadius: '12px', p: 1 } }}>
        <DialogTitle sx={{ fontWeight: 500, color: '#0f172a', fontSize: 16 }}>¿Eliminar gasto?</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontSize: 13, color: '#64748b' }}>
            Estás a punto de eliminar <strong style={{ color: '#0f172a' }}>{confirmEliminar.titulo}</strong>. Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button onClick={() => setConfirmEliminar({ open: false, id: null, titulo: '' })}
            sx={{ color: '#64748b', textTransform: 'none', borderRadius: 2, border: '0.5px solid #e2e8f0', px: 2 }}>
            Cancelar
          </Button>
          <Button onClick={handleEliminar}
            sx={{ bgcolor: '#f87171', color: '#fff', textTransform: 'none', borderRadius: 2, px: 2, '&:hover': { bgcolor: '#ef4444' } }}>
            Sí, eliminar
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Dialog EDITAR confirmación ── */}
      <Dialog open={confirmEditar.open} onClose={() => setConfirmEditar({ open: false, gasto: null })}
        PaperProps={{ sx: { borderRadius: '12px', p: 1 } }}>
        <DialogTitle sx={{ fontWeight: 500, color: '#0f172a', fontSize: 16 }}>¿Editar gasto?</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontSize: 13, color: '#64748b' }}>
            Vas a editar <strong style={{ color: '#0f172a' }}>{confirmEditar.gasto?.titulo}</strong>. ¿Deseas continuar?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button onClick={() => setConfirmEditar({ open: false, gasto: null })}
            sx={{ color: '#64748b', textTransform: 'none', borderRadius: 2, border: '0.5px solid #e2e8f0', px: 2 }}>
            Cancelar
          </Button>
          <Button onClick={abrirModalEditar}
            sx={{ bgcolor: VERDE, color: '#0f172a', textTransform: 'none', borderRadius: 2, px: 2, fontWeight: 500, '&:hover': { bgcolor: '#16a34a' } }}>
            Sí, editar
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Modal EDITAR formulario ── */}
      <Dialog open={modalEditar} onClose={() => setModalEditar(false)} fullWidth maxWidth="xs"
        PaperProps={{ sx: { borderRadius: '12px', p: 1 } }}>
        <DialogTitle sx={{ fontWeight: 500, color: '#0f172a', fontSize: 16 }}>Editar gasto</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <TextField fullWidth size="small" label="Título" value={formEditar.titulo}
              onChange={e => setFormEditar({ ...formEditar, titulo: e.target.value })} sx={dialogInputSx} />
            <TextField fullWidth size="small" label="Descripción (opcional)" value={formEditar.descripcion}
              onChange={e => setFormEditar({ ...formEditar, descripcion: e.target.value })} sx={dialogInputSx} />
            <TextField fullWidth size="small" label="Monto" type="number" value={formEditar.monto}
              onChange={e => setFormEditar({ ...formEditar, monto: e.target.value })} sx={dialogInputSx}
              InputProps={{ startAdornment: <InputAdornment position="start"><Typography sx={{ fontSize: 13, color: '#94a3b8' }}>$</Typography></InputAdornment> }} />
            <FormControl fullWidth size="small" sx={dialogInputSx}>
              <InputLabel>Categoría</InputLabel>
              <Select value={formEditar.categoria} onChange={e => setFormEditar({ ...formEditar, categoria: e.target.value })} label="Categoría">
                {categorias.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
              </Select>
            </FormControl>
            <TextField fullWidth size="small" label="Fecha" type="date" value={formEditar.fecha}
              onChange={e => setFormEditar({ ...formEditar, fecha: e.target.value })}
              sx={dialogInputSx} InputLabelProps={{ shrink: true }} />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button onClick={() => setModalEditar(false)}
            sx={{ color: '#64748b', textTransform: 'none', borderRadius: 2, border: '0.5px solid #e2e8f0', px: 2 }}>
            Cancelar
          </Button>
          <Button onClick={handleGuardarEdicionFinal} disabled={guardandoEditar}
            sx={{ bgcolor: VERDE, color: '#0f172a', textTransform: 'none', borderRadius: 2, px: 2, fontWeight: 500, '&:hover': { bgcolor: '#16a34a' }, '&.Mui-disabled': { bgcolor: '#bbf7d0' } }}>
            {guardandoEditar ? 'Guardando...' : 'Guardar cambios'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snack.open} autoHideDuration={2500} onClose={() => setSnack({ ...snack, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity={snack.tipo} onClose={() => setSnack({ ...snack, open: false })} sx={{ width: '100%' }}>
          {snack.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
}