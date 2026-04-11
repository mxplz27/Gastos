import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
  Chip,
  IconButton,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Divider
} from '@mui/material';

import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
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
  const [openMenu, setOpenMenu] = useState(false);

  const toggleMenu = () => setOpenMenu(!openMenu);

  useEffect(() => {
    if (!usuario) return;

    const fetchResumen = async () => {
      try {
        const res = await fetch(`${API_URL}/api/gastos/resumen`, {
          headers: {
            Authorization: `Bearer ${usuario.token}`,
          },
        });

        const data = await res.json();
        setResumenMes(data.totalMes ?? 0);
      } catch (err) {}
    };

    fetchResumen();
  }, [usuario?.token]);

  const handleCerrarSesion = () => {
    localStorage.removeItem('usuarioActivo');
    navigate('/');
  };

  const menuItems = [
    { text: 'Inicio', path: '/components' },
    { text: 'API', path: '/api' },
    { text: 'Mis gastos', path: '/MisGastos' },
    { text: 'Seguimiento', path: '/Seguimiento' },
  ];

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{ bgcolor: BG_NAV, borderBottom: '1px solid rgba(255,255,255,0.08)' }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>

        {/* LOGO */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <AccountBalanceWalletIcon sx={{ color: VERDE, fontSize: 22 }} />
          <Typography sx={{ fontSize: 15, fontWeight: 500, color: TEXTO }}>
            Gestor<Box component="span" sx={{ color: VERDE }}>financiero</Box>
          </Typography>
        </Box>

        {/* NAV DESKTOP */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
          {menuItems.map((item) => (
            <Button key={item.text} component={Link} to={item.path} sx={navBtn}>
              {item.text}
            </Button>
          ))}

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
              }}
            />
          )}

          {usuario ? (
            <>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Avatar sx={{ width: 26, height: 26, bgcolor: VERDE }}>
                  {usuario?.nombre?.charAt(0)?.toUpperCase()}
                </Avatar>
              </Box>

              <Button
                onClick={handleCerrarSesion}
                sx={{
                  ml: 1,
                  border: '1px solid rgba(34,197,94,0.5)',
                  color: VERDE,
                  textTransform: 'none',
                }}
              >
                Cerrar sesión
              </Button>
            </>
          ) : (
            <Button
              component={Link}
              to="/inicio"
              sx={{ ml: 1, bgcolor: VERDE, color: '#0f172a' }}
            >
              Iniciar sesión
            </Button>
          )}
        </Box>

        {/* HAMBURGER MOBILE */}
        <IconButton
          onClick={toggleMenu}
          sx={{ display: { xs: 'flex', md: 'none' }, color: TEXTO }}
        >
          <MenuIcon />
        </IconButton>

        {/* DRAWER MOBILE */}
        <Drawer anchor="right" open={openMenu} onClose={toggleMenu}>
          <Box sx={{ width: 250, p: 2, bgcolor: BG_NAV, height: '100%', color: TEXTO }}>

            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography sx={{ color: TEXTO }}>Menú</Typography>
              <IconButton onClick={toggleMenu} sx={{ color: TEXTO }}>
                <CloseIcon />
              </IconButton>
            </Box>

            <Divider sx={{ my: 1, borderColor: 'rgba(255,255,255,0.1)' }} />

            <List>
              {menuItems.map((item) => (
                <ListItemButton
                  key={item.text}
                  component={Link}
                  to={item.path}
                  onClick={toggleMenu}
                >
                  <ListItemText primary={item.text} />
                </ListItemButton>
              ))}
            </List>

            <Divider sx={{ my: 1, borderColor: 'rgba(255,255,255,0.1)' }} />

            {usuario ? (
              <Button fullWidth onClick={handleCerrarSesion} sx={{ color: VERDE }}>
                Cerrar sesión
              </Button>
            ) : (
              <Button fullWidth component={Link} to="/inicio" sx={{ bgcolor: VERDE }}>
                Iniciar sesión
              </Button>
            )}
          </Box>
        </Drawer>

      </Toolbar>
    </AppBar>
  );
}