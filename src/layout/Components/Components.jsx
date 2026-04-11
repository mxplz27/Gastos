import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Chip,
  Snackbar,
  Alert,
  LinearProgress,
  CircularProgress
} from '@mui/material';
import { Link } from 'react-router-dom';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import GitHubIcon from '@mui/icons-material/GitHub';

const API_URL = "https://gastos-1-qah3.onrender.com";

const VERDE = '#22c55e';
const TEXTO = '#f1f5f9';

const COLORES_CATEGORIA = {
  Vivienda:     { color: '#f87171', icon: '🏠' },
  Alimentación: { color: '#fb923c', icon: '🛒' },
  Movilidad:    { color: '#60a5fa', icon: '🚌' },
  Ocio:         { color: '#a78bfa', icon: '🎮' },
  Salud:        { color: '#34d399', icon: '🏥' },
  Educación:    { color: '#fbbf24', icon: '📚' },
  Servicios:    { color: '#818cf8', icon: '💡' },
  Otro:         { color: '#94a3b8', icon: '📦' },
};

const getColorInfo = (categoria) =>
  COLORES_CATEGORIA[categoria] || COLORES_CATEGORIA['Otro'];

const formatCOP = (valor) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
  }).format(valor);

// ─────────────────────────────────────────────────────────────────────────
export default function Inicio() {
  const usuario = JSON.parse(localStorage.getItem('usuarioActivo') || 'null');

  const [gastos, setGastos] = useState([]);
  const [totalGastado, setTotalGastado] = useState(0);
  const [loadingGastos, setLoadingGastos] = useState(false);

  const [open, setOpen] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [tipo, setTipo] = useState('success');

  // ── CARGA DE DATOS ───────────────────────────────────────────────────
  useEffect(() => {
    if (!usuario) return;

    const fetchGastos = async () => {
      setLoadingGastos(true);

      try {
        const [gastosRes, resumenRes] = await Promise.all([
          fetch(`${API_URL}/api/gastos`, {
            headers: {
              Authorization: `Bearer ${usuario.token}`
            },
          }),

          fetch(`${API_URL}/api/gastos/resumen`, {
            headers: {
              Authorization: `Bearer ${usuario.token}`
            },
          }),
        ]);

        const gastosData = await gastosRes.json();
        const resumenData = await resumenRes.json();

        setGastos(gastosData);
        setTotalGastado(resumenData.totalGastado || 0);

      } catch (err) {
        console.error(err);
        setMensaje('No se pudieron cargar los gastos.');
        setTipo('error');
        setOpen(true);
      } finally {
        setLoadingGastos(false);
      }
    };

    fetchGastos();
  }, [usuario?.token]);

  const calcularProgreso = (monto) => {
    if (!totalGastado) return 0;
    return Math.min(Math.round((monto / totalGastado) * 100), 100);
  };

  // ── RENDER ───────────────────────────────────────────────────────────
  return (
    <Box sx={{ bgcolor: '#f1f5f9', minHeight: '100vh' }}>

      {/* HERO */}
      <Box sx={{
        height: 'calc(100vh - 64px)',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #0f2744 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        px: 4,
      }}>

        <Chip
          icon={<AccountBalanceWalletIcon sx={{ fontSize: 14, color: VERDE }} />}
          label="Controla tus finanzas fácilmente"
          sx={{ bgcolor: 'rgba(34,197,94,0.12)', color: VERDE, mb: 3 }}
        />

        <Typography variant="h2" sx={{ fontWeight: 700, color: TEXTO }}>
          Bienvenido a <span style={{ color: VERDE }}>Gastor Financiero</span>
        </Typography>

        <Typography sx={{ color: 'rgba(255,255,255,0.5)', mt: 2, mb: 4 }}>
          Registra y controla tus gastos fácilmente
        </Typography>

        <Box sx={{ display: 'flex', gap: 2 }}>
          {!usuario && (
            <Button component={Link} to="/Registro" variant="contained"
              sx={{ bgcolor: VERDE, color: '#0f172a' }}>
              Comenzar gratis
            </Button>
          )}

          <Button component={Link} to="/MisGastos" variant="outlined"
            sx={{ color: TEXTO }}>
            Ver mis gastos
          </Button>

          <Button
            href="https://github.com/mxplz27/Gastos"
            target="_blank"
            startIcon={<GitHubIcon />}
          >
            GitHub
          </Button>
        </Box>
      </Box>

      {/* SECCIÓN PRIVADA */}
      {usuario && (
        <Box sx={{ maxWidth: 900, mx: 'auto', p: 4 }}>

          <Typography variant="h5">Resumen del mes</Typography>

          <Box sx={{ mt: 2, mb: 4 }}>
            <Typography>Total gastado:</Typography>
            <Typography sx={{ color: '#f87171', fontSize: 20 }}>
              {formatCOP(totalGastado)}
            </Typography>
          </Box>

          {/* LOADING */}
          {loadingGastos ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
              <CircularProgress sx={{ color: VERDE }} />
            </Box>
          ) : gastos.length === 0 ? (
            <Typography>No tienes gastos aún</Typography>
          ) : (
            gastos.map((gasto) => {
              const { color, icon } = getColorInfo(gasto.categoria);

              return (
                <Box key={gasto._id} sx={{
                  p: 2,
                  mb: 2,
                  bgcolor: '#fff',
                  borderLeft: `4px solid ${color}`,
                  borderRadius: 2,
                }}>
                  <Typography>{icon} {gasto.titulo}</Typography>
                  <Typography sx={{ color }}>{formatCOP(gasto.monto)}</Typography>
                </Box>
              );
            })
          )}

        </Box>
      )}

      {/* ALERT */}
      <Snackbar open={open} autoHideDuration={3000} onClose={() => setOpen(false)}>
        <Alert severity={tipo}>{mensaje}</Alert>
      </Snackbar>

    </Box>
  );
}