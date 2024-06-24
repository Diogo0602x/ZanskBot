import React, { useState } from 'react';
import { Container, Tabs, Tab, Box } from '@mui/material';
import Documents from './tabs/Documents';
import Questions from './tabs/Questions';
import Chatbot from './tabs/Chatbot';
import Api from './tabs/Api';

const Dashboard: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    console.log(event)
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
          {selectedTab === 0 && <Documents key={selectedTab} />}
          {selectedTab === 1 && <Questions key={selectedTab} />}
          {selectedTab === 2 && <Chatbot key={selectedTab} />} 
          {selectedTab === 3 && <Api key={selectedTab} />} 
        </Box>
      </Box>
    </Container>
  );
};

export default Dashboard;
