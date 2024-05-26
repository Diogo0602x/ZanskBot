import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';

const Header: React.FC = () => {
  return (
    <AppBar position="static" className="bg-blue-600">
      <Toolbar className="flex justify-between">
        <Typography variant="h6">
          Zanskbot
        </Typography>
        <div>
          <Button color="inherit" className="mr-4">Registrar</Button>
          <Button color="inherit">Login</Button>
        </div>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
