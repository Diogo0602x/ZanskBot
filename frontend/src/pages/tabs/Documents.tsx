import React, { useState, useEffect } from 'react';
import { Typography, Button, IconButton, List, Box, Card, CardContent, CardActions } from '@mui/material';
import { Add as AddIcon, Download as DownloadIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { uploadDocument, fetchDocuments, downloadDocument, deleteDocument } from '../../services/document';
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
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4 }}>
      <Card>
        <CardContent>
          <Typography variant="h4" component="h1" gutterBottom>
            Documentos
          </Typography>
          <Typography variant="body1" gutterBottom>
            Nesta tela, você pode anexar, visualizar e gerenciar seus documentos. Utilize o botão abaixo para anexar novos documentos.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            component="label"
            sx={{ mt: 2 }}
          >
            Anexar Documentos
            <input type="file" hidden onChange={handleFileChange} />
          </Button>
        </CardContent>
      </Card>
      <List sx={{ mt: 4 }}>
        {documents.map((doc) => (
          <Card key={doc._id} sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="body1"><strong>Nome:</strong> {doc.originalName}</Typography>
              <Typography variant="body2"><strong>Tipo Documento:</strong> {formatMimeType(doc.mimeType)}</Typography>
              <Typography variant="body2"><strong>Tamanho:</strong> {formatFileSize(doc.size)} bytes</Typography>
            </CardContent>
            <CardActions>
              <IconButton edge="end" onClick={() => handleDownload(doc._id, doc.originalName)}>
                <DownloadIcon />
              </IconButton>
              <IconButton edge="end" onClick={() => handleDelete(doc._id)}>
                <DeleteIcon />
              </IconButton>
            </CardActions>
          </Card>
        ))}
      </List>
    </Box>
  );
};

export default Documents;