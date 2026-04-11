import { useState } from 'react';
import {
  Box, Typography, TextField, Button,
  InputAdornment, IconButton, Alert
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { Link, useNavigate } from 'react-router-dom';

const VERDE = '#22c55e';
const API_URL = import.meta.env.VITE_API_URL;
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
  { color: VERDE, text: 'Registro ilimitado de gastos' },
  { color: '#60a5fa', text: 'Metas y seguimiento financiero' },
  { color: '#a78bfa', text: '100% gratis, sin tarjeta de crédito' },
];

const fields = [
  { label: 'Nombre completo', name: 'nombre', type: 'text', placeholder: 'Tu nombre' },
  { label: 'Correo electrónico', name: 'email', type: 'email', placeholder: 'tu@correo.com' },
  { label: 'Contraseña', name: 'password', type: 'password', placeholder: 'Mínimo 6 caracteres' },
  { label: 'Confirmar contraseña', name: 'confirmar', type: 'password', placeholder: 'Repite tu contraseña' },
];

// ✅ VALIDACIÓN QUE TE FALTABA
const emailValido = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export default function Registro() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmar: ''
  });

  const [showPass, setShowPass] = useState({
    password: false,
    confirmar: false
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async () => {
    if (!form.nombre || !form.email || !form.password || !form.confirmar) {
      setError('Por favor completa todos los campos.');
      return;
    }

    if (!emailValido(form.email)) {
      setError('El correo electrónico no es válido.');
      return;
    }

    if (form.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (form.password !== form.confirmar) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_URL}/api/auth/registro`, {
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

      setTimeout(() => {
        navigate('/Inicio');
      }, 1500);

    } catch (err) {
      setError('Error de conexión con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>

      {/* LADO OSCURO */}
      <Box sx={{
        flex: 1,
        display: { xs: 'none', md: 'flex' },
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#0f172a',
        px: 6,
      }}>
        <Typography sx={{ color: '#fff' }}>Registro</Typography>
      </Box>

      {/* FORM */}
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box sx={{ width: 360 }}>

          <Typography variant="h5" sx={{ mb: 2 }}>
            Crear cuenta
          </Typography>

          {fields.map((f) => (
            <Box key={f.name} sx={{ mb: 1.5 }}>
              <Typography sx={{ fontSize: 12 }}>{f.label}</Typography>

              <TextField
                fullWidth
                size="small"
                name={f.name}
                type={
                  f.type === 'password'
                    ? showPass[f.name] ? 'text' : 'password'
                    : f.type
                }
                value={form[f.name]}
                onChange={handleChange}
              />
            </Box>
          ))}

          {error && <Alert severity="error">{error}</Alert>}
          {success && <Alert severity="success">Cuenta creada</Alert>}

          <Button
            fullWidth
            onClick={handleSubmit}
            disabled={loading}
            sx={{ mt: 2 }}
          >
            {loading ? 'Creando...' : 'Crear cuenta'}
          </Button>

        </Box>
      </Box>
    </Box>
  );
}