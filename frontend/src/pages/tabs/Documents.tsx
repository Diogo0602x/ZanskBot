import React, { useState, useEffect } from 'react';
import { Typography, Button, IconButton, List, ListItem, ListItemText, ListItemSecondaryAction, Box } from '@mui/material';
import { Add as AddIcon, Download as DownloadIcon } from '@mui/icons-material';
import { uploadDocument, fetchDocuments, downloadDocument } from '../../services/api';
import { Document } from "../../types/type";

const Documents: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (selectedFile) {
      try {
        await uploadDocument(selectedFile);
        loadDocuments();
      } catch (error) {
        console.error('Erro ao enviar documento:', error);
      }
    }
  };

  const loadDocuments = async () => {
    try {
      const response = await fetchDocuments();
      if (response.data.documents) { 
        setDocuments(response.data.documents);
      } else {
        console.error('Documentos não encontrados na resposta da API');
      }
    } catch (error) {
      console.error('Erro ao buscar documentos:', error);
    }
  };

  const handleDownload = async (id: string, originalName: string) => {
    try {
      const response = await downloadDocument(id);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', originalName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Erro ao fazer download do documento:', error);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Documentos
      </Typography>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        component="label"
      >
        Anexar Documentos
        <input type="file" hidden onChange={handleFileChange} />
      </Button>
      <Button
        variant="contained"
        color="secondary"
        onClick={handleUpload}
        disabled={!selectedFile}
        style={{ marginLeft: '10px' }}
      >
        Upload
      </Button>
      <List>
        {documents.map((doc) => (
          <ListItem key={doc._id}>
            <ListItemText
              primary={`Nome: ${doc.originalName}`}
              secondary={`Tipo Documento: ${doc.mimeType} | Tamanho: ${doc.size} bytes`}
            />
            <ListItemSecondaryAction>
              <IconButton edge="end" onClick={() => handleDownload(doc._id, doc.originalName)}>
                <DownloadIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Documents;