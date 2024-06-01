import React, { useState, useEffect, useCallback } from 'react';
import { Container, TextField, Button, Box, Typography, Grid } from '@mui/material';
import { useFormik, FormikErrors } from 'formik';
import * as Yup from 'yup';
import { registerQuestions, fetchQuestions, editQuestions } from '../../services/question';
import { QuestionData, QuestionFormValues } from '../../types/type';

const Questions: React.FC = () => {
  const [questionId, setQuestionId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const validationSchema = Yup.object({
    questions: Yup.array()
      .of(Yup.object({ questionText: Yup.string().required('Pergunta é obrigatória') }))
      .length(10, 'Deve haver exatamente 10 perguntas')
      .required('Perguntas são obrigatórias'),
  });

  const formik = useFormik<QuestionFormValues>({
    initialValues: { questions: Array(10).fill({ questionText: '' }) },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        if (questionId) {
          await editQuestions(questionId, values.questions);
        } else {
          const response = await registerQuestions(values.questions);
          if (response.status === 201 && response.data.newQuestions) {
            setQuestionId(response.data.newQuestions._id);
            loadQuestions(); // Recarregar perguntas após salvar com sucesso
          }
        }
        alert('Perguntas salvas com sucesso!');
      } catch (error) {
        alert('Erro ao salvar perguntas');
      } finally {
        setSubmitting(false);
      }
    },
  });

  const loadQuestions = useCallback(async () => {
    try {
      const response = await fetchQuestions();
      if (response.data.questions && response.data.questions.length > 0) {
        const questionData = response.data.questions[0];
        setQuestionId(questionData._id);
        formik.setValues({ questions: questionData.questions });
      }
    } catch (error) {
      console.error('Erro ao buscar perguntas:', error);
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadQuestions();
  }, [loadQuestions]);

  if (loading) {
    return <div>Carregando...</div>;
  }

  const getError = (index: number): string | undefined => {
    if (
      formik.touched.questions &&
      Array.isArray(formik.touched.questions) &&
      formik.errors.questions &&
      Array.isArray(formik.errors.questions) &&
      formik.touched.questions[index] &&
      formik.errors.questions[index]
    ) {
      const error = formik.errors.questions[index] as FormikErrors<QuestionData>;
      return error.questionText;
    }
    return undefined;
  };

  const getTouched = (index: number): boolean => {
    return (
      formik.touched.questions &&
      Array.isArray(formik.touched.questions) &&
      !!formik.touched.questions[index]
    ) || false;
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom>
        Perguntas
      </Typography>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={2}>
          {formik.values.questions.map((question, index) => (
            <Grid item xs={12} key={index}>
              <TextField
                fullWidth
                id={`questions.${index}.questionText`}
                name={`questions.${index}.questionText`}
                label={`Pergunta ${index + 1}`}
                value={question.questionText}
                onChange={formik.handleChange}
                error={getTouched(index) && Boolean(getError(index))}
                helperText={getTouched(index) && getError(index)}
              />
            </Grid>
          ))}
        </Grid>
        <Box display="flex" justifyContent="flex-end" m={2}>
          <Button color="primary" variant="contained" type="submit">
            Salvar
          </Button>
        </Box>
      </form>
    </Container>
  );
};

export default Questions;
