import React, { useState } from 'react';
import { Container, Typography, Tabs, Tab, Box } from '@mui/material';

const Dashboard: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState(0);

  const handleChange = (event: React.ChangeEvent<unknown>, newValue: number) => {
    setSelectedTab(newValue);
  };

  return (
    <Container maxWidth="lg" className="pt-20">
      <Box display="flex">
        <Tabs
          orientation="vertical"
          variant="scrollable"
          value={selectedTab}
          onChange={handleChange}
          aria-label="Dashboard Tabs"
          className="mr-4"
        >
          <Tab label="Documentos" />
          <Tab label="Perguntas" />
          <Tab label="Chatbot" />
          <Tab label="API" />
        </Tabs>
        <Box flexGrow={1}>
          {selectedTab === 0 && <Typography>Documentos</Typography>}
          {selectedTab === 1 && <Typography>Perguntas</Typography>}
          {selectedTab === 2 && <Typography>Chatbot</Typography>}
          {selectedTab === 3 && <Typography>API</Typography>}
        </Box>
      </Box>
    </Container>
  );
};

export default Dashboard;
