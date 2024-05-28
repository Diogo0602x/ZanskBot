import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useHistory, useLocation } from 'react-router-dom';
import { styled } from '@mui/system';

interface StyledAppBarProps {
  scrolled: boolean;
  isLandingPage: boolean;
}

const StyledAppBar = styled(AppBar)<StyledAppBarProps>(({ scrolled, isLandingPage }) => ({
  backgroundColor: isLandingPage ? (scrolled ? '#000000' : 'transparent') : '#000000',
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

  const handleInitialPage = () => {
    history.push('/');
  };

  const isLandingPage = location.pathname === '/';

  return (
    <StyledAppBar position="fixed" scrolled={scrolled} isLandingPage={isLandingPage}>
      <Toolbar>
        <StyledTypography variant="h6" onClick={handleInitialPage}>
          Zanskbot
        </StyledTypography>
        <StyledButton color="inherit" onClick={handleRegisterClick}>
          Registrar
        </StyledButton>
        <LoginButton variant="outlined" onClick={handleLoginClick}>
          Login
        </LoginButton>
      </Toolbar>
    </StyledAppBar>
  );
}

export default Header;
