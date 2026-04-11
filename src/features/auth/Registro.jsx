import { useState } from 'react';
import { Box, Typography, TextField, Button, InputAdornment, IconButton, Alert } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { Link, useNavigate } from 'react-router-dom';

const VERDE = '#22c55e';

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

const features = [
  { color: VERDE,     text: 'Registro ilimitado de gastos' },
  { color: '#60a5fa', text: 'Metas y seguimiento financiero' },
  { color: '#a78bfa', text: '100% gratis, sin tarjeta de crédito' },
];

export default function Registro() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ nombre: '', email: '', password: '', confirmar: '' });
  const [showPass, setShowPass] = useState({ password: false, confirmar: false });
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const emailValido = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async () => {
    // ── Validaciones frontend ──────────────────────────────────────────────
    if (!form.nombre || !form.email || !form.password || !form.confirmar) {
      setError('Por favor completa todos los campos.'); return;
    }
    if (!emailValido(form.email)) {
      setError('El correo electrónico no es válido.'); return;
    }
    if (form.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.'); return;
    }
    if (form.password !== form.confirmar) {
      setError('Las contraseñas no coinciden.'); return;
    }

    // ── Llamada al backend ─────────────────────────────────────────────────
    setLoading(true);
    try {
      const res = await fetch('https://gastos-1-qah3.onrender.com/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: form.nombre,
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.mensaje || 'Error al crear la cuenta.');
        return;
      }

      setSuccess(true);
      setTimeout(() => navigate('/Inicio'), 1500);

    } catch (err) {
      setError('No se pudo conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { label: 'Nombre completo',      name: 'nombre',   type: 'text',     placeholder: 'Tu nombre' },
    { label: 'Correo electrónico',   name: 'email',    type: 'email',    placeholder: 'tu@correo.com' },
    { label: 'Contraseña',           name: 'password', type: 'password', placeholder: 'Mínimo 6 caracteres' },
    { label: 'Confirmar contraseña', name: 'confirmar',type: 'password', placeholder: 'Repite tu contraseña' },
  ];

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>

      {/* ── LADO OSCURO ── */}
      <Box sx={{
        flex: 1, display: { xs: 'none', md: 'flex' }, flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        bgcolor: '#0f172a', px: 6, position: 'relative', overflow: 'hidden',
      }}>
        <Box sx={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', bgcolor: 'rgba(34,197,94,0.08)', top: -80, left: -80 }} />
        <Box sx={{ position: 'absolute', width: 200, height: 200, borderRadius: '50%', bgcolor: 'rgba(96,165,250,0.06)', bottom: -40, right: -40 }} />

        <Box sx={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: 300 }}>
          <Box sx={{ width: 56, height: 56, borderRadius: '14px', bgcolor: 'rgba(34,197,94,0.15)', border: '0.5px solid rgba(34,197,94,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 3 }}>
            <AccountBalanceWalletIcon sx={{ fontSize: 24, color: VERDE }} />
          </Box>

          <Typography variant="h5" sx={{ fontWeight: 500, color: '#f1f5f9', mb: 1.5, lineHeight: 1.3 }}>
          Únete a <Box component="span" sx={{ color: VERDE }}>Gestor Financiero</Box>
        </Typography>
          <Typography sx={{ fontSize: 13, color: 'rgba(241,245,249,0.4)', lineHeight: 1.7, mb: 4 }}>
            Empieza a controlar tus finanzas de manera inteligente y sin esfuerzo.
          </Typography>

          {features.map(f => (
            <Box key={f.text} sx={{ display: 'flex', alignItems: 'center', gap: 1.2, bgcolor: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.08)', borderRadius: '10px', px: 1.8, py: 1.4, mb: 1.2, textAlign: 'left' }}>
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: f.color, flexShrink: 0 }} />
              <Typography sx={{ fontSize: 12, color: 'rgba(241,245,249,0.6)' }}>{f.text}</Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* ── LADO FORMULARIO ── */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', bgcolor: '#fff', px: 5 }}>
        <Box sx={{ width: '100%', maxWidth: 360 }}>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3.5 }}>
            <Box sx={{ width: 30, height: 30, borderRadius: '8px', bgcolor: VERDE, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AccountBalanceWalletIcon sx={{ fontSize: 15, color: '#0f172a' }} />
            </Box>
            <Typography sx={{ fontSize: 17, fontWeight: 500, color: '#0f172a' }}>
              Gasto<Box component="span" sx={{ color: VERDE }}>Track</Box>
            </Typography>
          </Box>

          <Typography variant="h5" sx={{ fontWeight: 500, color: '#0f172a', mb: 0.5 }}>Crear cuenta</Typography>
          <Typography variant="body2" sx={{ color: '#94a3b8', mb: 3 }}>
            ¿Ya tienes cuenta?{' '}
            <Box component={Link} to="/Inicio" sx={{ color: VERDE, fontWeight: 500, textDecoration: 'none' }}>
              Inicia sesión
            </Box>
          </Typography>

          {fields.map(f => (
            <Box key={f.name} sx={{ mb: 1.5 }}>
              <Typography sx={{ fontSize: 12, color: '#64748b', mb: 0.6 }}>{f.label}</Typography>
              <TextField fullWidth size="small" name={f.name} placeholder={f.placeholder}
                type={f.type === 'password' ? (showPass[f.name] ? 'text' : 'password') : f.type}
                value={form[f.name]} onChange={handleChange} sx={inputSx}
                InputProps={f.type === 'password' ? {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton size="small" edge="end"
                        onClick={() => setShowPass(p => ({ ...p, [f.name]: !p[f.name] }))}>
                        {showPass[f.name] ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  )
                } : undefined}
              />
            </Box>
          ))}

          {error   && <Alert severity="error"   sx={{ mb: 1.5, borderRadius: 2, fontSize: 12, py: 0.5 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 1.5, borderRadius: 2, fontSize: 12, py: 0.5 }}>¡Cuenta creada! Redirigiendo...</Alert>}

          <Button fullWidth onClick={handleSubmit} disabled={loading} sx={{
            bgcolor: VERDE, color: '#0f172a', borderRadius: 2, mt: 0.5,
            textTransform: 'none', fontWeight: 500, fontSize: 14, py: 1.2,
            '&:hover': { bgcolor: '#16a34a' },
            '&.Mui-disabled': { bgcolor: '#bbf7d0', color: '#0f172a' },
          }}>
            {loading ? 'Creando cuenta...' : 'Crear cuenta gratis'}
          </Button>

          <Typography sx={{ fontSize: 11, color: '#cbd5e1', textAlign: 'center', mt: 1.5, lineHeight: 1.6 }}>
            Al registrarte aceptas nuestros términos de uso y política de privacidad.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}