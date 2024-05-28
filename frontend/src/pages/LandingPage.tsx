import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';

const LandingPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-cover bg-center" style={{ backgroundImage: 'url(/public/bg-2.jpg)' }}>
      <header className="flex-grow flex items-center justify-center text-white text-center">
        <Container>
          <Box className="backdrop-filter backdrop-blur-sm bg-black bg-opacity-40 p-8 rounded-lg">
            <Typography variant="h2" component="h1" gutterBottom>
              Bem-vindo ao Zanskbot
            </Typography>
            <Typography variant="h5" component="p" gutterBottom>
              Sua solução integrada para treinamento de chatbots personalizados para empresas.
            </Typography>
            <Button variant="contained" color="primary" href="#learn-more" className="mt-4">
              Saiba Mais
            </Button>
          </Box>
        </Container>
      </header>
    </div>
  );
}

export default LandingPage;
