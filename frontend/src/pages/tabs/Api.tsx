import React, { useState } from 'react';
import { Container, Button, Typography, Card, CardContent } from '@mui/material';
import { generateApi } from '../../services/api';

const Api: React.FC = () => {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleGenerateApi = async () => {
    setLoading(true);
    try {
      const response = await generateApi();
      setApiKey(response.data.apiKey || '');
    } catch (error) {
      console.error('Erro ao gerar a API:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Card>
        <CardContent>
          <Typography variant="h4" component="h1" gutterBottom>
            Gerar API
          </Typography>
          <Typography variant="body1" gutterBottom>
            Nesta tela, você pode gerar uma chave de API para integrar o chatbot ao seu site. Clique no botão abaixo para gerar a chave de API.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleGenerateApi}
            disabled={loading}
            sx={{ mt: 2 }}
          >
            {loading ? 'Gerando...' : 'Gerar API'}
          </Button>
        </CardContent>
      </Card>
      {apiKey && (
        <Card sx={{ mt: 4 }}>
          <CardContent>
            <Typography variant="h5" component="h2" gutterBottom>
              Sua Chave de API
            </Typography>
            <Typography variant="body1" gutterBottom>
              Use a chave abaixo para integrar o chatbot ao seu site:
            </Typography>
            <Typography variant="body2" sx={{ wordBreak: 'break-all', mt: 2 }}>
              {apiKey}
            </Typography>
          </CardContent>
        </Card>
      )}
    </Container>
  );
};

export default Api;