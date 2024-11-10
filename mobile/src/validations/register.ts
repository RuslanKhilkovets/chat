import {regex} from '@/constants';
import * as yup from 'yup';

const registerSchema = yup.object().shape({
  email: yup
    .string()
    .email('Неправильний формат електронної пошти')
    .required('E-mail є обов’язковим'),
  name: yup.string().required("Ім'я є обов'язковим для введення"),
  password: yup.string().required('Пароль є обов’язковим'),
  token: yup.string().required("Токен є обов'язковим"),
  phone: yup
    .string()
    .matches(regex.PHONE_INPUT)
    .required("Номер телефону є обов'язковим для введення"),
});

export default registerSchema;
