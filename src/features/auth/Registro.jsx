import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const VERDE = '#22c55e';
const API_URL = import.meta.env.VITE_API_URL;

const emailValido = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const inputStyle = {
  width: '100%',
  height: 38,
  borderRadius: 8,
  border: '0.5px solid #cbd5e1',
  background: '#f8fafc',
  fontSize: 14,
  padding: '0 12px',
  outline: 'none',
  color: '#0f172a',
  boxSizing: 'border-box',
};

export default function Registro() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ nombre: '', email: '', password: '', confirmar: '' });
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
      const res = await fetch(`${API_URL}/api/auth/registro`, {
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

  const fields = [
    { label: 'Nombre completo', name: 'nombre', type: 'text', placeholder: 'Tu nombre' },
    { label: 'Correo electrónico', name: 'email', type: 'email', placeholder: 'tu@correo.com' },
    { label: 'Contraseña', name: 'password', type: 'password', placeholder: 'Mínimo 6 caracteres' },
    { label: 'Confirmar contraseña', name: 'confirmar', type: 'password', placeholder: 'Repite tu contraseña' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>

      {/* LADO OSCURO */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'flex-start', justifyContent: 'center',
        background: '#0f172a', padding: '40px 48px', gap: 32,
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: VERDE, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            💰
          </div>
          <span style={{ color: '#fff', fontSize: 17, fontWeight: 500 }}>FinanzApp</span>
        </div>

        <div style={{ color: '#fff', fontSize: 28, fontWeight: 500, lineHeight: 1.35 }}>
          Toma el control de<br />
          tus <span style={{ color: VERDE }}>finanzas</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[
            { color: VERDE, text: 'Registro ilimitado de gastos' },
            { color: '#60a5fa', text: 'Metas y seguimiento financiero' },
            { color: '#a78bfa', text: '100% gratis, sin tarjeta de crédito' },
          ].map((f) => (
            <div key={f.text} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: f.color, flexShrink: 0 }} />
              <span style={{ color: '#94a3b8', fontSize: 13 }}>{f.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* FORMULARIO */}
      <div style={{ flex: 1.1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 36px' }}>
        <div style={{ width: '100%', maxWidth: 340 }}>

          <div style={{ marginBottom: 24 }}>
            <h2 style={{ fontSize: 20, fontWeight: 500, margin: 0 }}>Crear cuenta</h2>
            <p style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>Completa los datos para registrarte</p>
          </div>

          {fields.map((f) => (
            <div key={f.name} style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, fontWeight: 500, color: '#64748b', display: 'block', marginBottom: 5 }}>
                {f.label}
              </label>
              <input
                style={inputStyle}
                name={f.name}
                type={f.type}
                placeholder={f.placeholder}
                value={form[f.name]}
                onChange={handleChange}
              />
            </div>
          ))}

          {error && (
            <div style={{ background: '#fef2f2', border: '0.5px solid #fca5a5', borderRadius: 8, padding: '8px 12px', fontSize: 13, color: '#dc2626', marginBottom: 10 }}>
              {error}
            </div>
          )}
          {success && (
            <div style={{ background: '#f0fdf4', border: '0.5px solid #86efac', borderRadius: 8, padding: '8px 12px', fontSize: 13, color: '#16a34a', marginBottom: 10 }}>
              ¡Cuenta creada exitosamente!
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              width: '100%', height: 38, borderRadius: 8,
              background: loading ? '#86efac' : VERDE,
              color: '#fff', fontSize: 14, fontWeight: 500,
              border: 'none', cursor: 'pointer', marginTop: 8,
            }}
          >
            {loading ? 'Creando...' : 'Crear cuenta'}
          </button>

          <p style={{ textAlign: 'center', fontSize: 12, color: '#ffffff', marginTop: 14 }}>
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" style={{ color: VERDE, fontWeight: 500, textDecoration: 'none' }}>
              Inicia sesión
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}