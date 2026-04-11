import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
  Chip
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

const API_URL = "https://gastos-1-qah3.onrender.com";

const VERDE = '#22c55e';
const VERDE_HOVER = '#16a34a';
const BG_NAV = '#0f172a';
const TEXTO = '#f1f5f9';
const TEXTO_MUTED = 'rgba(241,245,249,0.55)';

const navBtn = {
  color: TEXTO_MUTED,
  textTransform: 'none',
  fontSize: 13,
  borderRadius: '6px',
  px: 1.5,
  '&:hover': {
    color: TEXTO,
    bgcolor: 'rgba(255,255,255,0.06)',
  },
};

export default function Header() {
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem('usuarioActivo') || 'null');

  const [resumenMes, setResumenMes] = useState(null);

  // ── OBTENER RESUMEN ─────────────────────────────────────────────────
  useEffect(() => {
    if (!usuario) return;

    const fetchResumen = async () => {
      try {
        const res = await fetch(`${API_URL}/api/gastos/resumen`, {
          headers: {
            Authorization: `Bearer ${usuario.token}`,
          },
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();

        setResumenMes(data.totalMes ?? 0);
      } catch (err) {
        // silencioso
      }
    };

    fetchResumen();
  }, [usuario?.token]);

  const handleCerrarSesion = () => {
    localStorage.removeItem('usuarioActivo');
    navigate('/');
  };

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        bgcolor: BG_NAV,
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <Toolbar sx={{ px: 10, py: 0.5 }}>

        {/* ── LOGO ── */}
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <AccountBalanceWalletIcon sx={{ color: VERDE, fontSize: 22 }} />
          <Typography sx={{ fontSize: 15, fontWeight: 500, color: TEXTO }}>
            Gestor<Box component="span" sx={{ color: VERDE }}>financiero</Box>
          </Typography>
        </Box>

        {/* ── NAV ── */}
        <Button component={Link} to="/components" sx={navBtn}>Inicio</Button>
        <Button component={Link} to="/api" sx={navBtn}>API</Button>
        <Button component={Link} to="/MisGastos" sx={navBtn}>Mis gastos</Button>
        <Button component={Link} to="/Seguimiento" sx={navBtn}>Seguimiento</Button>

        {/* ── RESUMEN MES ── */}
        {usuario && (
          <Chip
            icon={<TrendingDownIcon sx={{ fontSize: 14, color: VERDE }} />}
            label={`$${(resumenMes || 0).toLocaleString('es-CO')} este mes`}
            size="small"
            sx={{
              mx: 2,
              bgcolor: 'rgba(34,197,94,0.10)',
              color: VERDE,
              border: '0.5px solid rgba(34,197,94,0.35)',
              fontSize: 12,
            }}
          />
        )}

        {/* ── USUARIO ── */}
        {usuario ? (
          <>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                mx: 1,
                bgcolor: 'rgba(255,255,255,0.05)',
                border: '0.5px solid rgba(255,255,255,0.08)',
                px: 1.5,
                py: 0.4,
                borderRadius: 3,
              }}
            >
              <Avatar
                sx={{
                  width: 26,
                  height: 26,
                  bgcolor: VERDE,
                  color: '#0f172a',
                  fontSize: 11,
                  fontWeight: 500,
                }}
              >
                {usuario?.nombre?.charAt(0)?.toUpperCase()}
              </Avatar>

              <Typography sx={{ color: TEXTO, fontSize: 13 }}>
                {usuario?.nombre}
              </Typography>
            </Box>

            <Button
              onClick={handleCerrarSesion}
              variant="outlined"
              sx={{
                borderColor: 'rgba(34,197,94,0.5)',
                color: VERDE,
                textTransform: 'none',
                fontSize: 13,
                ml: 1,
                '&:hover': {
                  bgcolor: 'rgba(34,197,94,0.10)',
                  borderColor: VERDE,
                },
              }}
            >
              Cerrar sesión
            </Button>
          </>
        ) : (
          <Button
            component={Link}
            to="/inicio"
            variant="contained"
            sx={{
              ml: 1,
              bgcolor: VERDE,
              color: '#0f172a',
              textTransform: 'none',
              fontSize: 13,
              '&:hover': {
                bgcolor: VERDE_HOVER,
              },
            }}
          >
            Iniciar sesión
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}