import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, Container, Typography } from '@mui/material';
import { requestPasswordReset } from '../services/login';
import { formatCNPJ } from '../commons';
import { useHistory } from 'react-router-dom';

const ForgotPassword: React.FC = () => {
  const [message, setMessage] = useState('');
  const history = useHistory();

  const validationSchema = Yup.object({
    cnpj: Yup.string().required('CNPJ é obrigatório'),
    email: Yup.string().email('Email inválido').required('Email é obrigatório'),
  });

  const formik = useFormik({
    initialValues: {
      cnpj: '',
      email: '',
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        const response = await requestPasswordReset(values.cnpj, values.email);
        setMessage(response.data.message);
        // Redirect to ResetPassword with the token
        history.push(`/reset-password/${response.data.token}`);
      } catch (error: unknown) {
        if (typeof error === 'object' && error !== null && 'message' in error) {
          setErrors({ email: (error as { message: string }).message });
        } else {
          setErrors({ email: 'Erro ao solicitar recuperação de senha' });
        }
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <Container maxWidth="xs" className="pt-20">
      <Typography variant="h4" component="h1" gutterBottom textAlign="center">
        Recuperar Senha
      </Typography>
      <form onSubmit={formik.handleSubmit}>
        <TextField
          fullWidth
          id="cnpj"
          name="cnpj"
          label="CNPJ"
          placeholder="Ex: XX.XXX.XXX/0001-XX"
          value={formatCNPJ(formik.values.cnpj)}
          onChange={formik.handleChange}
          error={formik.touched.cnpj && Boolean(formik.errors.cnpj)}
          helperText={formik.touched.cnpj && formik.errors.cnpj}
          margin="normal"
        />
        <TextField
          fullWidth
          id="email"
          name="email"
          label="Email"
          type="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
          margin="normal"
        />
        <div className="text-center mt-4">
          <Button color="primary" variant="contained" type="submit">
            Enviar
          </Button>
        </div>
      </form>
      {message && <Typography className="text-center mt-4">{message}</Typography>}
    </Container>
  );
};

export default ForgotPassword;