import { useState } from 'react';
import { Box, Typography, TextField, Button, InputAdornment, IconButton, Alert } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { Link, useNavigate } from 'react-router-dom';

const VERDE = '#22c55e';
const API_URL = import.meta.env.VITE_API_URL || 'https://gastos-1-qah3.onrender.com';

const inputSx = {
  mb: 0,
  '& .MuiOutlinedInput-root': {
    borderRadius: 2,
    '& fieldset': { borderColor: '#e2e8f0' },
    '&:hover fieldset': { borderColor: VERDE },
    '&.Mui-focused fieldset': { borderColor: VERDE },
  },
  '& label.Mui-focused': { color: VERDE },
};

const emailValido = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export default function Registro() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ nombre: '', email: '', password: '', confirmar: '' });
  const [showPass, setShowPass] = useState({ password: false, confirmar: false });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async () => {
    if (!form.nombre || !form.email || !form.password || !form.confirmar)
      return setError('Por favor completa todos los campos.');
    if (!emailValido(form.email))
      return setError('El correo electrónico no es válido.');
    if (form.password.length < 6)
      return setError('La contraseña debe tener al menos 6 caracteres.');
    if (form.password !== form.confirmar)
      return setError('Las contraseñas no coinciden.');

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/Registro`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: form.nombre, email: form.email, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) return setError(data.mensaje || 'Error al crear la cuenta.');
      setSuccess(true);
      setTimeout(() => navigate('/Inicio'), 1500);
    } catch {
      setError('Error de conexión con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>

      {/* ── FORMULARIO ── */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', bgcolor: '#fff', px: 5 }}>
        <Box sx={{ width: '100%', maxWidth: 360 }}>

          {/* Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3.5 }}>
            <Box sx={{ width: 30, height: 30, borderRadius: '8px', bgcolor: VERDE, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AccountBalanceWalletIcon sx={{ fontSize: 15, color: '#0f172a' }} />
            </Box>
            <Typography sx={{ fontSize: 17, fontWeight: 500, color: '#0f172a' }}>
              Gestor<Box component="span" sx={{ color: VERDE }}>Financiero</Box>
            </Typography>
          </Box>

          <Typography variant="h5" sx={{ fontWeight: 500, color: '#0f172a', mb: 0.5 }}>Crea tu cuenta</Typography>
          <Typography variant="body2" sx={{ color: '#94a3b8', mb: 3 }}>Completa los datos para registrarte</Typography>

          {/* Nombre */}
          <Typography sx={{ fontSize: 12, color: '#64748b', mb: 0.6 }}>Nombre completo</Typography>
          <TextField fullWidth size="small" name="nombre" placeholder="Tu nombre"
            value={form.nombre} onChange={handleChange} sx={{ ...inputSx, mb: 1.8 }} />

          {/* Email */}
          <Typography sx={{ fontSize: 12, color: '#64748b', mb: 0.6 }}>Correo electrónico</Typography>
          <TextField fullWidth size="small" name="email" type="email" placeholder="tu@correo.com"
            value={form.email} onChange={handleChange} sx={{ ...inputSx, mb: 1.8 }} />

          {/* Contraseña */}
          <Typography sx={{ fontSize: 12, color: '#64748b', mb: 0.6 }}>Contraseña</Typography>
          <TextField fullWidth size="small" name="password" placeholder="Mínimo 6 caracteres"
            type={showPass.password ? 'text' : 'password'}
            value={form.password} onChange={handleChange} sx={{ ...inputSx, mb: 1.8 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPass({ ...showPass, password: !showPass.password })} edge="end" size="small">
                    {showPass.password ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />

          {/* Confirmar contraseña */}
          <Typography sx={{ fontSize: 12, color: '#64748b', mb: 0.6 }}>Confirmar contraseña</Typography>
          <TextField fullWidth size="small" name="confirmar" placeholder="Repite tu contraseña"
            type={showPass.confirmar ? 'text' : 'password'}
            value={form.confirmar} onChange={handleChange} sx={{ ...inputSx, mb: 2.5 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPass({ ...showPass, confirmar: !showPass.confirmar })} edge="end" size="small">
                    {showPass.confirmar ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />

          {error && (
            <Alert severity="error" sx={{ borderRadius: 2, fontSize: 12, py: 0.5, mb: 2 }}>{error}</Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ borderRadius: 2, fontSize: 12, py: 0.5, mb: 2 }}>¡Cuenta creada exitosamente!</Alert>
          )}

          <Button fullWidth onClick={handleSubmit} disabled={loading} sx={{
            bgcolor: VERDE, color: '#0f172a', borderRadius: 2,
            textTransform: 'none', fontWeight: 500, fontSize: 14, py: 1.2, mb: 2,
            '&:hover': { bgcolor: '#16a34a' },
            '&.Mui-disabled': { bgcolor: '#bbf7d0', color: '#0f172a' },
          }}>
            {loading ? 'Creando cuenta...' : 'Crear cuenta'}
          </Button>

          <Typography variant="body2" sx={{ color: '#94a3b8', textAlign: 'center' }}>
            ¿Ya tienes cuenta?{' '}
            <Box component={Link} to="/Inicio" sx={{ color: VERDE, fontWeight: 500, textDecoration: 'none' }}>
              Inicia sesión
            </Box>
          </Typography>

        </Box>
      </Box>

      {/* ── LADO OSCURO ── */}
      <Box sx={{ flex: 1, display: { xs: 'none', md: 'flex' }, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', bgcolor: '#0f172a', px: 6, position: 'relative', overflow: 'hidden' }}>
        <Box sx={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', bgcolor: 'rgba(34,197,94,0.08)', top: -80, right: -80 }} />
        <Box sx={{ position: 'absolute', width: 200, height: 200, borderRadius: '50%', bgcolor: 'rgba(96,165,250,0.06)', bottom: -40, left: -40 }} />

        <Box sx={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: 300 }}>
          <Box sx={{ width: 56, height: 56, borderRadius: '14px', bgcolor: 'rgba(34,197,94,0.15)', border: '0.5px solid rgba(34,197,94,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 3 }}>
            <AccountBalanceWalletIcon sx={{ fontSize: 24, color: VERDE }} />
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 500, color: '#f1f5f9', mb: 1.5, lineHeight: 1.3 }}>
            Toma el control de tus{' '}
            <Box component="span" sx={{ color: VERDE }}>finanzas</Box>
          </Typography>
          <Typography sx={{ fontSize: 13, color: 'rgba(241,245,249,0.4)', lineHeight: 1.7, mb: 4 }}>
            Registra gastos, define metas y visualiza tu progreso financiero en tiempo real.
          </Typography>
          {[
            { color: VERDE,     text: 'Registro y categorización de gastos' },
            { color: '#60a5fa', text: 'Gráficas y reportes visuales' },
            { color: '#a78bfa', text: 'Metas de ahorro personalizadas' },
          ].map((item) => (
            <Box key={item.text} sx={{ display: 'flex', alignItems: 'center', gap: 1.2, bgcolor: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.08)', borderRadius: '10px', px: 1.8, py: 1.4, mb: 1.2, textAlign: 'left' }}>
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: item.color, flexShrink: 0 }} />
              <Typography sx={{ fontSize: 12, color: 'rgba(241,245,249,0.6)' }}>{item.text}</Typography>
            </Box>
          ))}
        </Box>
      </Box>

    </Box>
  );
}