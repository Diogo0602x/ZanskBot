import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, Container, Typography, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { resetPassword } from '../services/login';
import { useParams, useHistory } from 'react-router-dom';
import axios from 'axios';

const ResetPassword: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const history = useHistory();

  const validationSchema = Yup.object({
    password: Yup.string().required('Senha é obrigatória').min(6, 'A senha deve ter no mínimo 6 caracteres'),
    confirmPassword: Yup.string()
      .required('Confirmação de senha é obrigatória')
      .oneOf([Yup.ref('password'), null], 'As senhas devem coincidir'),
  });

  const formik = useFormik({
    initialValues: {
      password: '',
      confirmPassword: '',
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        const response = await resetPassword(token, values.password);
        setMessage(response.data.message);
        history.push('/login');
      } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response && error.response.status === 400) {
          setErrors({ password: 'Token inválido ou expirado' });
        } else {
          setErrors({ password: 'Erro ao redefinir senha' });
        }
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <Container maxWidth="xs" className="pt-20">
      <Typography variant="h4" component="h1" gutterBottom textAlign="center">
        Redefinir Senha
      </Typography>
      <form onSubmit={formik.handleSubmit}>
        <TextField
          fullWidth
          id="password"
          name="password"
          label="Nova Senha"
          type={showPassword ? 'text' : 'password'}
          value={formik.values.password}
          onChange={formik.handleChange}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
          margin="normal"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <TextField
          fullWidth
          id="confirmPassword"
          name="confirmPassword"
          label="Confirme a Nova Senha"
          type={showConfirmPassword ? 'text' : 'password'}
          value={formik.values.confirmPassword}
          onChange={formik.handleChange}
          error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
          helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
          margin="normal"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle confirm password visibility"
                  onClick={handleClickShowConfirmPassword}
                  edge="end"
                >
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <div className="text-center mt-4">
          <Button color="primary" variant="contained" type="submit">
            Redefinir Senha
          </Button>
        </div>
      </form>
      {message && <Typography className="text-center mt-4">{message}</Typography>}
    </Container>
  );
};

export default ResetPassword;
