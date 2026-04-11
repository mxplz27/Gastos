import { Box, Typography, Divider, Link } from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

const VERDE = '#22c55e';
const TEXTO = '#f1f5f9';

export default function Footer() {
  return (
    <Box sx={{ bgcolor: '#0f172a', borderTop: '1px solid rgba(255,255,255,0.08)', px: 4, pt: 6, pb: 3.5 }}>
      <Box sx={{ maxWidth: 900, mx: 'auto' }}>

        {/* Fila superior */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 4, mb: 5 }}>

          {/* Logo y descripción */}
          <Box sx={{ maxWidth: 260 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
              <Box sx={{ width: 28, height: 28, borderRadius: '6px', bgcolor: VERDE, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <AccountBalanceWalletIcon sx={{ fontSize: 14, color: '#0f172a' }} />
              </Box>
              <Typography sx={{ fontSize: 17, fontWeight: 600, color: TEXTO }}>
                Gestor<Box component="span" sx={{ color: VERDE }}>financiero</Box>
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: 'rgba(241,245,249,0.4)', lineHeight: 1.7, fontSize: 13 }}>
              Registra, visualiza y controla tus gastos mensuales. Toma mejores decisiones financieras con datos claros.
            </Typography>
          </Box>

          {/* Links */}
          <Box sx={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
            <Box>
              <Typography variant="caption" sx={{ color: 'rgba(241,245,249,0.3)', letterSpacing: 1.4, textTransform: 'uppercase', fontWeight: 600, display: 'block', mb: 1.8 }}>
                Navegar
              </Typography>
              {['Inicio', 'Mis gastos', 'Seguimiento'].map(item => (
                <Link key={item} href="#" underline="none" display="block"
                  sx={{ color: 'rgba(241,245,249,0.5)', fontSize: 13, mb: 1.2, '&:hover': { color: VERDE }, transition: 'color 0.2s' }}>
                  {item}
                </Link>
              ))}
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'rgba(241,245,249,0.3)', letterSpacing: 1.4, textTransform: 'uppercase', fontWeight: 600, display: 'block', mb: 1.8 }}>
                Cuenta
              </Typography>
              {['Registro', 'Iniciar sesión'].map(item => (
                <Link key={item} href="#" underline="none" display="block"
                  sx={{ color: 'rgba(241,245,249,0.5)', fontSize: 13, mb: 1.2, '&:hover': { color: VERDE }, transition: 'color 0.2s' }}>
                  {item}
                </Link>
              ))}
            </Box>
          </Box>
        </Box>

        <Divider sx={{ borderColor: 'rgba(255,255,255,0.07)', mb: 2.5 }} />

        {/* Fila inferior */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="caption" sx={{ color: 'rgba(241,245,249,0.2)', fontSize: 12 }}>
            © {new Date().getFullYear()} Gestor Financiero. Todos los derechos reservados.
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: VERDE }} />
            <Typography sx={{ fontSize: 12, color: 'rgba(241,245,249,0.3)' }}>Finanzas en tiempo real</Typography>
          </Box>
        </Box>

      </Box>
    </Box>
  );
}