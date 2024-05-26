import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, MenuItem, Select, InputLabel, FormControl, FormHelperText, Container, Typography } from '@mui/material';
import { formatCNPJ, formatPhone } from '../commons';

const Register: React.FC = () => {
  const validationSchema = Yup.object({
    cnpj: Yup.string().required('CNPJ é obrigatório'),
    companyName: Yup.string().required('Nome da empresa é obrigatório'),
    companySocialName: Yup.string().required('Razão Social é obrigatória'),
    phone: Yup.string().required('Celular é obrigatório'),
    email: Yup.string().email('E-mail inválido').required('E-mail é obrigatório'),
    companySize: Yup.string().required('Porte da empresa é obrigatório'),
    password: Yup.string().min(6, 'A senha deve ter pelo menos 6 caracteres').required('Senha é obrigatória'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'As senhas não correspondem')
      .required('Confirmação de senha é obrigatória'),
  });

  const formik = useFormik({
    initialValues: {
      cnpj: '',
      companyName: '',
      companySocialName: '',
      phone: '',
      email: '',
      companySize: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema,
    onSubmit: values => {
      console.log(values);
      // lógica para enviar os dados para o backend
    },
  });

  return (
    <Container maxWidth="sm" className="mt-4">
      <Typography variant="h4" component="h1" gutterBottom>
        Cadastro de Empresa
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
          id="companyName"
          name="companyName"
          label="Nome da Empresa"
          value={formik.values.companyName}
          onChange={formik.handleChange}
          error={formik.touched.companyName && Boolean(formik.errors.companyName)}
          helperText={formik.touched.companyName && formik.errors.companyName}
          margin="normal"
        />

        <TextField
          fullWidth
          id="companySocialName"
          name="companySocialName"
          label="Razão Social"
          value={formik.values.companySocialName}
          onChange={formik.handleChange}
          error={formik.touched.companySocialName && Boolean(formik.errors.companySocialName)}
          helperText={formik.touched.companySocialName && formik.errors.companySocialName}
          margin="normal"
        />

        <TextField
          fullWidth
          id="phone"
          name="phone"
          label="Celular"
          placeholder="Somente números, ex: (33) 3333-3333"
          value={formatPhone(formik.values.phone)}
          onChange={formik.handleChange}
          error={formik.touched.phone && Boolean(formik.errors.phone)}
          helperText={formik.touched.phone && formik.errors.phone}
          margin="normal"
          inputProps={{ maxLength: 14 }}
        />

        <TextField
          fullWidth
          id="email"
          name="email"
          label="E-mail"
          placeholder="exemplo@empresa.com"
          value={formik.values.email}
          onChange={formik.handleChange}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
          margin="normal"
        />

        <FormControl fullWidth margin="normal" error={formik.touched.companySize && Boolean(formik.errors.companySize)}>
          <InputLabel id="companySize-label">Porte da Empresa</InputLabel>
          <Select
            labelId="companySize-label"
            id="companySize"
            name="companySize"
            value={formik.values.companySize}
            onChange={formik.handleChange}
            label="Porte da Empresa"
          >
            <MenuItem value="" disabled>
              Selecione o porte da empresa
            </MenuItem>
            <MenuItem value="Microempresa (ME) Até 9 empregados">Microempresa (ME) Até 9 empregados</MenuItem>
            <MenuItem value="Microempresa (ME) Até 19 empregados">Microempresa (ME) Até 19 empregados</MenuItem>
            <MenuItem value="Empresa de Pequeno Porte (EPP) De 10 a 49 empregados">Empresa de Pequeno Porte (EPP) De 10 a 49 empregados</MenuItem>
            <MenuItem value="Empresa de Pequeno Porte (EPP) De 20 a 99 empregados">Empresa de Pequeno Porte (EPP) De 20 a 99 empregados</MenuItem>
            <MenuItem value="Empresa de médio porte De 50 a 99 empregados">Empresa de médio porte De 50 a 99 empregados</MenuItem>
            <MenuItem value="Empresa de médio porte De 100 a 499 empregados">Empresa de médio porte De 100 a 499 empregados</MenuItem>
            <MenuItem value="Grandes empresas 100 ou mais empregados">Grandes empresas 100 ou mais empregados</MenuItem>
            <MenuItem value="Grandes empresas 500 ou mais empregados">Grandes empresas 500 ou mais empregados</MenuItem>
          </Select>
          {formik.touched.companySize && Boolean(formik.errors.companySize) ? (
            <FormHelperText>{formik.errors.companySize}</FormHelperText>
          ) : null}
        </FormControl>

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

        <TextField
          fullWidth
          id="confirmPassword"
          name="confirmPassword"
          label="Confirmar Senha"
          type="password"
          value={formik.values.confirmPassword}
          onChange={formik.handleChange}
          error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
          helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
          margin="normal"
        />

        <div className="text-right">
          <Button color="primary" variant="contained" type="submit">
            Salvar
          </Button>
        </div>
      </form>
    </Container>
  );
};

export default Register;
