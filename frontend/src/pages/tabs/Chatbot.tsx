import React, { useState, useEffect, useCallback } from 'react';
import { Container, TextField, Button, Box, Typography, List, ListItem, ListItemText, Avatar } from '@mui/material';
import { askQuestion } from '../../services/chatbot'; 
import RobotIcon from '@mui/icons-material/SmartToy';
import { fetchQuestions } from '../../services/question';

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<{ question: string; answer: string }[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [questions, setQuestions] = useState<string[]>([]);

  const loadQuestions = useCallback(async () => {
    try {
      const response = await fetchQuestions();
      if (response.data.questions && response.data.questions.length > 0) {
        const formattedQuestions = response.data.questions[0].questions.map((q, index) => `${index + 1} - ${q.questionText}`);
        setQuestions(formattedQuestions);
        setMessages([{ question: '', answer: 'Hello, this is ZanskBot. Please choose one number of the following questions:\n' + formattedQuestions.join('\n') }]);
      }
    } catch (error) {
      console.error('Erro ao buscar perguntas:', error);
    }
  }, []);

  useEffect(() => {
    loadQuestions();
  }, [loadQuestions]);

  const handleAsk = async () => {
    if (!currentQuestion.trim()) return;
    const questionNumber = parseInt(currentQuestion.trim());
    setCurrentQuestion('');
    if (isNaN(questionNumber) || questionNumber < 1 || questionNumber > questions.length) {
      setMessages((prevMessages) => [...prevMessages, { question: currentQuestion, answer: 'Número da pergunta inválido. Por favor, escolha um número válido.' }]);
      return;
    }
    try {
      const response = await askQuestion(questionNumber);
      setMessages((prevMessages) => [...prevMessages, { question: currentQuestion, answer: response.data.answer }]);
    } catch (error) {
      console.error('Erro ao perguntar:', error);
      setMessages((prevMessages) => [...prevMessages, { question: currentQuestion, answer: 'Erro ao processar sua pergunta. Por favor, tente novamente.' }]);
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom>
        Chatbot
      </Typography>
      <List>
        {messages.map((message, index) => (
          <ListItem key={index} alignItems="flex-start">
            <Avatar>
              <RobotIcon />
            </Avatar>
            <ListItemText
              primary={message.question ? `Você: ${message.question}` : ''}
              secondary={`Zanskbot: ${message.answer}`}
              style={{ whiteSpace: 'pre-wrap', marginLeft: '10px'}}
            />
          </ListItem>
        ))}
      </List>
      <Box display="flex" mt={2}>
        <TextField
          fullWidth
          variant="outlined"
          label="Digite o número da pergunta"
          value={currentQuestion}
          onChange={(e) => setCurrentQuestion(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleAsk();
            }
          }}
        />
        <Button color="primary" variant="contained" onClick={handleAsk} style={{ marginLeft: '10px' }}>
          Enviar
        </Button>
      </Box>
    </Container>
  );
};

export default Chatbot;
