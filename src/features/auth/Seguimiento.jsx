import { useState, useEffect } from 'react';
import {
  Box, Typography, Button, CircularProgress,
} from '@mui/material';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Link } from 'react-router-dom';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import {
  Chart as ChartJS, ArcElement, Tooltip, CategoryScale,
  LinearScale, BarElement,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, CategoryScale, LinearScale, BarElement);

// ── Constantes ────────────────────────────────────────────────────────────
const VERDE      = '#22c55e';
const API_GASTOS = 'https://gastos-6upo.onrender.com';

// ── Helpers ───────────────────────────────────────────────────────────────
const coloresCat = {
  Vivienda:     '#f87171',
  Alimentación: '#fb923c',
  Movilidad:    '#60a5fa',
  Ocio:         '#a78bfa',
  Salud:        '#34d399',
  Educación:    '#fbbf24',
  Servicios:    '#818cf8',
  Otro:         '#94a3b8',
};

const SEM_DATA_VACIA = {
  labels: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'],
  datasets: [{
    label: 'Gastos',
    data: [0, 0, 0, 0],
    backgroundColor: 'rgba(34,197,94,0.18)',
    borderColor: VERDE,
    borderWidth: 1.5,
    borderRadius: 6,
  }],
};

const BAR_OPTIONS = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    x: {
      grid: { display: false },
      ticks: { font: { size: 11 }, color: '#94a3b8' },
    },
    y: {
      grid: { color: '#f1f5f9' },
      ticks: {
        font: { size: 11 },
        color: '#94a3b8',
        callback: (v) => '$' + v / 1000 + 'k',
      },
    },
  },
};

// ─────────────────────────────────────────────────────────────────────────
export default function Seguimiento() {
  const usuario = JSON.parse(localStorage.getItem('usuarioActivo') || 'null');
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${usuario?.token}`,
  };

  const [gastos,  setGastos]  = useState([]);
  const [loading, setLoading] = useState(false);

  // ── Carga de datos ───────────────────────────────────────────────────
  useEffect(() => {
    if (!usuario) return;
    const fetchData = async () => {
      setLoading(true);
      try {
        const res  = await fetch(API_GASTOS, { headers });
        const data = await res.json();
        setGastos(data);
      } catch (err) {
        console.error('Error cargando gastos:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [usuario?.token]);

  // ── Cálculos derivados ───────────────────────────────────────────────
  const catData = Object.entries(
    gastos.reduce((acc, g) => {
      acc[g.categoria] = (acc[g.categoria] || 0) + g.monto;
      return acc;
    }, {})
  ).map(([label, valor]) => ({
    label,
    valor,
    color: coloresCat[label] || '#94a3b8',
  }));

  const datosSemana = [0, 0, 0, 0];
  gastos.forEach((g) => {
    const dia = new Date(g.fecha).getDate();
    const idx = Math.min(Math.floor((dia - 1) / 7), 3);
    datosSemana[idx] += g.monto;
  });

  const semData = {
    labels: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'],
    datasets: [{
      label: 'Gastos',
      data: datosSemana,
      backgroundColor: 'rgba(34,197,94,0.18)',
      borderColor: VERDE,
      borderWidth: 1.5,
      borderRadius: 6,
    }],
  };

  // ── Loading ──────────────────────────────────────────────────────────
  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <CircularProgress sx={{ color: VERDE }} />
    </Box>
  );

  // ── Render ───────────────────────────────────────────────────────────
  return (
    <Box sx={{ bgcolor: '#f1f5f9', minHeight: '100vh', px: { xs: 3, md: 6 }, py: 5 }}>
      <Box sx={{ maxWidth: 960, mx: 'auto' }}>

        {/* ── Encabezado ── */}
        <Typography variant="h5" sx={{ fontWeight: 500, color: '#0f172a', mb: 0.5 }}>
          Seguimiento financiero
        </Typography>
        <Typography variant="body2" sx={{ color: '#94a3b8', mb: 3.5 }}>
          Visualiza tu progreso y controla tus gastos del mes
        </Typography>

        {/* ── Banner invitado ── */}
        {!usuario && (
          <Box sx={{
            display: 'flex', alignItems: 'center', gap: 2,
            bgcolor: 'rgba(34,197,94,0.08)',
            border: '0.5px solid rgba(34,197,94,0.3)',
            borderRadius: '12px', px: 3, py: 2, mb: 3,
          }}>
            <LockOutlinedIcon sx={{ color: VERDE, fontSize: 20, flexShrink: 0 }} />
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontSize: 13, fontWeight: 500, color: '#0f172a' }}>
                Estás viendo el seguimiento como invitado
              </Typography>
              <Typography sx={{ fontSize: 12, color: '#64748b' }}>
                Inicia sesión para ver tus gastos reales y gráficas personalizadas.
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, flexShrink: 0 }}>
              <Button component={Link} to="/Inicio" size="small" sx={{
                color: VERDE, border: '0.5px solid rgba(34,197,94,0.4)',
                borderRadius: 2, textTransform: 'none', fontSize: 12, px: 1.5,
              }}>
                Iniciar sesión
              </Button>
              <Button component={Link} to="/Registro" size="small" variant="contained" sx={{
                bgcolor: VERDE, color: '#0f172a', borderRadius: 2,
                textTransform: 'none', fontSize: 12, px: 1.5, fontWeight: 500,
                '&:hover': { bgcolor: '#16a34a' },
              }}>
                Registrarse
              </Button>
            </Box>
          </Box>
        )}

        {/* ── Donut ── */}
        <Box sx={{ bgcolor: '#fff', borderRadius: '12px', border: '0.5px solid #e2e8f0', p: 2.5, mb: 2.5 }}>
          <Typography sx={{ fontSize: 14, fontWeight: 500, color: '#0f172a', mb: 0.5 }}>
            Gastos por categoría
          </Typography>
          <Typography sx={{ fontSize: 12, color: '#94a3b8', mb: 2 }}>
            Distribución del mes actual
          </Typography>

          {catData.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography sx={{ fontSize: 32, mb: 1 }}>📊</Typography>
              <Typography sx={{ fontSize: 13, color: '#cbd5e1' }}>
                {usuario ? 'Sin gastos registrados aún' : 'Inicia sesión para ver tus gráficas'}
              </Typography>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', gap: 4, alignItems: 'center' }}>
              {/* Gráfico */}
              <Box sx={{ width: 220, flexShrink: 0 }}>
                <Doughnut
                  data={{
                    labels: catData.map((c) => c.label),
                    datasets: [{
                      data:            catData.map((c) => c.valor),
                      backgroundColor: catData.map((c) => c.color),
                      borderWidth: 2,
                      borderColor: '#fff',
                    }],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: true,
                    cutout: '68%',
                    plugins: { legend: { display: false } },
                  }}
                />
              </Box>
              {/* Leyenda */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {catData.map((c) => (
                  <Box key={c.label} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 10, height: 10, borderRadius: '2px', bgcolor: c.color, flexShrink: 0 }} />
                    <Typography sx={{ fontSize: 13, color: '#64748b', minWidth: 100 }}>{c.label}</Typography>
                    <Typography sx={{ fontSize: 13, fontWeight: 500, color: '#0f172a' }}>
                      {'$' + Math.round(c.valor).toLocaleString('es-CO')}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          )}
        </Box>

        {/* ── Barras semanales ── */}
        <Box sx={{ bgcolor: '#fff', borderRadius: '12px', border: '0.5px solid #e2e8f0', p: 2.5 }}>
          <Typography sx={{ fontSize: 14, fontWeight: 500, color: '#0f172a', mb: 0.5 }}>
            Evolución semanal de gastos
          </Typography>
          <Typography sx={{ fontSize: 12, color: '#94a3b8', mb: 2 }}>
            {usuario
              ? 'Basado en tus gastos registrados en MongoDB'
              : 'Inicia sesión para ver tu evolución semanal'}
          </Typography>
          <Box sx={{ height: 220 }}>
            <Bar data={usuario ? semData : SEM_DATA_VACIA} options={BAR_OPTIONS} />
          </Box>
        </Box>

      </Box>
    </Box>
  );
}