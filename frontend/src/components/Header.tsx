import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useHistory } from 'react-router-dom';
import { styled } from '@mui/system';

const StyledAppBar = styled(AppBar)({
  backgroundColor: '#000000',
});

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

  const handleRegisterClick = () => {
    history.push('/register');
  };

  const handleLoginClick = () => {
    history.push('/login');
  };

  return (
    <StyledAppBar position="static">
      <Toolbar>
        <StyledTypography variant="h6">
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
