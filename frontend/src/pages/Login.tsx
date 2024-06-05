import React from 'react';
import { useHistory } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, Container, Typography } from '@mui/material';
import { formatCNPJ } from '../commons';
import { loginUser } from '../services/login';
import { LoginData } from '../types/type';
import { useAuth } from '../contexts/AuthContext';

const Login: React.FC = () => {
  const history = useHistory();
  const { login } = useAuth();

  const validationSchema = Yup.object({
    cnpj: Yup.string().required('CNPJ é obrigatório'),
    password: Yup.string().required('Senha é obrigatória'),
  });

  const formik = useFormik<LoginData>({
    initialValues: {
      cnpj: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        const response = await loginUser(values);
        if (response.status === 200 && response.data.token) {
          login(response.data.token);
          history.push('/dashboard');
        } else {
          setErrors({ cnpj: 'Dados incorretos' });
        }
      } catch (error: unknown) {
        if (typeof error === 'object' && error !== null && 'message' in error) {
          setErrors({ cnpj: (error as { message: string }).message });
        } else {
          setErrors({ cnpj: 'Erro desconhecido ao fazer login' });
        }
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <Container maxWidth="xs" className="pt-20">
      <Typography variant="h4" component="h1" gutterBottom textAlign="center">
        Login
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
          inputProps={{ maxLength: 18 }}
        />

        <TextField
          fullWidth
          id="password"
          name="password"
          label="Senha"
          type="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
          margin="normal"
        />

        <div className="text-center mt-4">
          <Button color="primary" variant="contained" type="submit">
            Entrar
          </Button>
        </div>
      </form>
    </Container>
  );
};

export default Login;
