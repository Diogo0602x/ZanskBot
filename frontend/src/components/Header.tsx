import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Menu, MenuItem } from '@mui/material';
import { useHistory, useLocation } from 'react-router-dom';
import { styled } from '@mui/system';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { StyledAppBarProps } from '../types/type';
import { useAuth } from '../contexts/AuthContext';

const StyledAppBar = styled(AppBar)<StyledAppBarProps>(({ scrolled, isLandingPage }) => ({
  backgroundColor: isLandingPage ? (scrolled ? '#1F2937' : 'transparent') : '#1F2937',
  transition: 'background-color 0.3s ease-in-out',
}));

const StyledTypography = styled(Typography)({
  flexGrow: 1,
});

const StyledButton = styled(Button)(({ theme }) => ({
  marginRight: theme.spacing(2),
}));

const LoginButton = styled(Button)({
  borderColor: '#ffffff',
  borderWidth: '2px',
  color: '#ffffff',
  '&:hover': {
    borderColor: '#ffffff',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
});

const Header: React.FC = () => {
  const history = useHistory();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleScroll = () => {
    const offset = window.scrollY;
    setScrolled(offset > 50);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleRegisterClick = () => {
    history.push('/register');
  };

  const handleLoginClick = () => {
    history.push('/login');
  };

  const handleLogout = () => {
    logout();
    history.push('/');
  };

  const handleInitialPage = () => {
    history.push('/');
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDashboardClick = () => {
    history.push('/dashboard');
    handleMenuClose();
  };

  const isLandingPage = location.pathname === '/';

  return (
    <StyledAppBar position="fixed" scrolled={scrolled} isLandingPage={isLandingPage}>
      <Toolbar>
        <StyledTypography variant="h6" onClick={handleInitialPage} className="cursor-pointer">
          Zanskbot
        </StyledTypography>
        {!isAuthenticated ? (
          <>
            <StyledButton color="inherit" onClick={handleRegisterClick}>
              Registrar
            </StyledButton>
            <LoginButton variant="outlined" onClick={handleLoginClick}>
              Login
            </LoginButton>
          </>
        ) : (
          <>
            <IconButton
              edge="end"
              color="inherit"
              onClick={handleMenuOpen}
            >
              <AccountCircle />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleDashboardClick}>Menu</MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </>
        )}
      </Toolbar>
    </StyledAppBar>
  );
};

export default Header;
