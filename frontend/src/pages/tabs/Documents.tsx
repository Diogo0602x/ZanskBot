import React, { useState, useEffect } from 'react';
import { Typography, Button, IconButton, List, ListItem, Box } from '@mui/material';
import { Add as AddIcon, Download as DownloadIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { uploadDocument, fetchDocuments, downloadDocument, deleteDocument } from '../../services/api';
import { Document } from '../../types/type';
import { formatFileSize, formatMimeType } from '../../commons';

const Documents: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      await handleUpload(event.target.files[0]);
    }
  };

  const handleUpload = async (file: File) => {
    try {
      await uploadDocument(file);
      loadDocuments();
    } catch (error) {
      console.error('Erro ao enviar documento:', error);
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

  const handleDelete = async (id: string) => {
    try {
      await deleteDocument(id);
      loadDocuments();
    } catch (error) {
      console.error('Erro ao deletar documento:', error);
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
      <List>
        {documents.map((doc) => (
          <ListItem key={doc._id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <Typography variant="body1"><strong>Nome:</strong> {doc.originalName}</Typography>
              <Typography variant="body2"><strong>Tipo Documento:</strong> {formatMimeType(doc.mimeType)}</Typography>
              <Typography variant="body2"><strong>Tamanho:</strong> {formatFileSize(doc.size)} bytes</Typography>
            </Box>
            <Box>
              <IconButton edge="end" onClick={() => handleDownload(doc._id, doc.originalName)}>
                <DownloadIcon />
              </IconButton>
              <IconButton edge="end" onClick={() => handleDelete(doc._id)}>
                <DeleteIcon />
              </IconButton>
            </Box>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Documents;
