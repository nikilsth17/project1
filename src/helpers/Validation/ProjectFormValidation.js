import * as Yup from 'yup';
export const projectValidationSchema = Yup.object().shape({
    title: Yup.string().required('Project title is required'),
    deadline: Yup.date().required('Deadline is required'),
  });