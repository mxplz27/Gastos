import { useState, useEffect } from 'react';
import { Box, Typography, Button, Chip, Snackbar, Alert, LinearProgress, CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import GitHubIcon from '@mui/icons-material/GitHub';

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
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(valor);

// ─────────────────────────────────────────────────────────────────────────
export default function Inicio() {
  const usuario = JSON.parse(localStorage.getItem('usuarioActivo') || 'null');

  const [gastos,        setGastos]        = useState([]);
  const [totalGastado,  setTotalGastado]  = useState(0);
  const [loadingGastos, setLoadingGastos] = useState(false);
  const [open,          setOpen]          = useState(false);
  const [mensaje,       setMensaje]       = useState('');
  const [tipo,          setTipo]          = useState('success');

  // ── Carga de datos ───────────────────────────────────────────────────
  useEffect(() => {
    if (!usuario) return;
    const fetchGastos = async () => {
      setLoadingGastos(true);
      try {
        const [gastosRes, resumenRes] = await Promise.all([
          fetch('https://gastos-1-qah3.onrender.com/', {
            headers: { Authorization: `Bearer ${usuario.token}` },
          }),
          fetch('https://gastos-1-qah3.onrender.com/', {
            headers: { Authorization: `Bearer ${usuario.token}` },
          }),
        ]);
        const gastosData  = await gastosRes.json();
        const resumenData = await resumenRes.json();
        setGastos(gastosData);
        setTotalGastado(resumenData.totalGastado || 0);
      } catch (err) {
        console.error('Error cargando datos:', err);
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
    if (!totalGastado || totalGastado === 0) return 0;
    return Math.min(Math.round((monto / totalGastado) * 100), 100);
  };

  // ── Render ───────────────────────────────────────────────────────────
  return (
    <Box sx={{ bgcolor: '#f1f5f9', minHeight: '100vh' }}>

      {/* ── Hero ── */}
      <Box sx={{
        height: 'calc(100vh - 64px)',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #0f2744 100%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', textAlign: 'center', px: 4,
        position: 'relative', overflow: 'hidden',
      }}>
        <Box sx={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(34,197,94,0.12), transparent 70%)', top: '-120px', left: '-120px' }} />
        <Box sx={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(96,165,250,0.08), transparent 70%)', bottom: '-80px', right: '-60px' }} />

        <Chip
          icon={<AccountBalanceWalletIcon sx={{ fontSize: 14, color: VERDE + ' !important' }} />}
          label="Controla tus finanzas fácilmente"
          sx={{ bgcolor: 'rgba(34,197,94,0.12)', color: VERDE, border: '0.5px solid rgba(34,197,94,0.3)', mb: 3, fontSize: 13 }}
        />

        <Typography variant="h2" sx={{ fontWeight: 700, color: TEXTO, mb: 2, lineHeight: 1.1 }}>
          Bienvenido a <Box component="span" sx={{ color: VERDE }}>Gastor Financiero</Box>
        </Typography>
        <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.45)', fontWeight: 400, mb: 5, maxWidth: 460 }}>
          Registra, visualiza y controla tus gastos mensuales. Toma mejores decisiones financieras con datos claros y en tiempo real.
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
          {!usuario && (
            <Button component={Link} to="/Registro" variant="contained" size="large"
              sx={{ bgcolor: VERDE, color: '#0f172a', borderRadius: '8px', textTransform: 'none', fontWeight: 500, fontSize: 15, px: 4, boxShadow: '0 4px 20px rgba(34,197,94,0.35)', '&:hover': { bgcolor: '#16a34a' } }}>
              Comenzar gratis
            </Button>
          )}
          <Button component={Link} to="/MisGastos" variant="outlined" size="large"
            sx={{ borderColor: 'rgba(255,255,255,0.25)', color: TEXTO, borderRadius: '8px', textTransform: 'none', fontWeight: 400, fontSize: 15, px: 4, '&:hover': { borderColor: VERDE, bgcolor: 'rgba(34,197,94,0.07)' } }}>
            Ver mis gastos
          </Button>
          <Button
            href="https://github.com/mxplz27/Gastos.git"
            target="_blank" rel="noopener noreferrer"
            variant="outlined" size="large"
            startIcon={<GitHubIcon sx={{ fontSize: 18 }} />}
            sx={{ borderColor: 'rgba(255,255,255,0.2)', color: 'rgba(241,245,249,0.7)', borderRadius: '8px', textTransform: 'none', fontWeight: 400, fontSize: 15, px: 4, '&:hover': { borderColor: 'rgba(255,255,255,0.5)', bgcolor: 'rgba(255,255,255,0.05)', color: TEXTO } }}>
            Ver en GitHub
          </Button>
        </Box>
      </Box>

      {/* ── Sección autenticada ── */}
      {usuario && (
        <>
          {/* ── Card: Total gastado ── */}
          <Box sx={{ maxWidth: 900, mx: 'auto', px: 4, pt: 8, pb: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: 500, mb: 1, color: '#0f172a' }}>Resumen del mes</Typography>
            <Typography variant="body2" sx={{ color: '#94a3b8', mb: 4 }}>
              Vista general de tus finanzas — {new Date().toLocaleString('es-CO', { month: 'long', year: 'numeric' })}
            </Typography>

            <Box sx={{ bgcolor: '#fff', borderRadius: '12px', border: '0.5px solid #e2e8f0', p: 2.5, display: 'inline-flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ bgcolor: 'rgba(248,113,113,0.10)', borderRadius: '8px', p: 1, display: 'flex' }}>
                <TrendingDownIcon sx={{ color: '#f87171', fontSize: 22 }} />
              </Box>
              <Box>
                <Typography sx={{ fontSize: 12, color: '#94a3b8', mb: 0.3 }}>Total gastado</Typography>
                <Typography sx={{ fontSize: 18, fontWeight: 500, color: '#f87171' }}>{formatCOP(totalGastado)}</Typography>
              </Box>
            </Box>
          </Box>

          {/* ── Gastos destacados ── */}
          <Box sx={{ maxWidth: 900, mx: 'auto', px: 4, pb: 8 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1, mt: 6 }}>
              <Typography variant="h5" sx={{ fontWeight: 500, color: '#0f172a' }}>Gastos destacados</Typography>
              <Button component={Link} to="/MisGastos" size="small"
                sx={{ color: VERDE, textTransform: 'none', fontSize: 13, '&:hover': { bgcolor: 'rgba(34,197,94,0.07)' } }}>
                Ver todos →
              </Button>
            </Box>
            <Typography variant="body2" sx={{ color: '#94a3b8', mb: 4 }}>Tus movimientos más recientes</Typography>

            {loadingGastos ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                <CircularProgress sx={{ color: VERDE }} />
              </Box>
            ) : gastos.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 8, bgcolor: '#fff', borderRadius: '12px', border: '0.5px solid #e2e8f0' }}>
                <Typography sx={{ fontSize: 32, mb: 1 }}>💸</Typography>
                <Typography sx={{ fontWeight: 500, color: '#0f172a', mb: 0.5 }}>Sin gastos registrados</Typography>
                <Typography sx={{ fontSize: 13, color: '#94a3b8', mb: 3 }}>Empieza registrando tu primer gasto</Typography>
                <Button component={Link} to="/MisGastos" variant="contained"
                  sx={{ bgcolor: VERDE, color: '#0f172a', textTransform: 'none', borderRadius: '8px', fontWeight: 500, '&:hover': { bgcolor: '#16a34a' } }}>
                  Registrar gasto
                </Button>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                {gastos.map((gasto) => {
                  const { color, icon } = getColorInfo(gasto.categoria);
                  const progreso = calcularProgreso(gasto.monto);
                  return (
                    <Box key={gasto._id} sx={{
                      display: 'flex', bgcolor: '#fff', borderRadius: '12px', overflow: 'hidden',
                      border: '0.5px solid #e2e8f0', borderLeft: `4px solid ${color}`,
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': { transform: 'translateY(-3px)', boxShadow: `0 8px 24px ${color}22` },
                    }}>
                      <Box sx={{ width: 72, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: `${color}10`, fontSize: 28, flexShrink: 0 }}>
                        {icon}
                      </Box>
                      <Box sx={{ p: 2.5, flexGrow: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.8 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography sx={{ fontWeight: 500, color: '#0f172a', fontSize: 15 }}>{gasto.titulo}</Typography>
                            <Chip label={gasto.categoria} size="small" sx={{ bgcolor: `${color}15`, color, fontSize: 11, fontWeight: 500, height: 22 }} />
                          </Box>
                          <Typography sx={{ fontWeight: 500, color, fontSize: 16 }}>{formatCOP(gasto.monto)}</Typography>
                        </Box>
                        <Typography variant="body2" sx={{ color: '#64748b', mb: 1.5, lineHeight: 1.6 }}>{gasto.descripcion}</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <LinearProgress variant="determinate" value={progreso}
                            sx={{ flexGrow: 1, height: 5, borderRadius: 3, bgcolor: `${color}18`, '& .MuiLinearProgress-bar': { bgcolor: color, borderRadius: 3 } }} />
                          <Typography sx={{ fontSize: 11, color: '#94a3b8', minWidth: 32 }}>{progreso}%</Typography>
                        </Box>
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            )}
          </Box>
        </>
      )}

      <Snackbar open={open} autoHideDuration={2500} onClose={() => setOpen(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={() => setOpen(false)} severity={tipo} sx={{ width: '100%' }}>{mensaje}</Alert>
      </Snackbar>
    </Box>
  );
}