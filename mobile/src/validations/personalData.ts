import {ChangeDataType} from '@/constants';
import * as yup from 'yup';

const personalDataSchema = {
  [ChangeDataType.EMAIL]: yup.object({
    fieldToChange: yup
      .string()
      .email('Invalid email address')
      .required('Email is required'),
  }),
  [ChangeDataType.TAG]: yup.object({
    fieldToChange: yup
      .string()
      .matches(
        /^[a-zA-Z0-9._]+$/,
        'Tag can only contain letters, numbers, dots, and underscores',
      )
      .min(3, 'Tag must be at least 3 characters long')
      .required('Tag is required'),
  }),
  [ChangeDataType.PHONE]: yup.object({
    fieldToChange: yup
      .string()
      .matches(
        /^\+38\s\(\d{3}\)\s\d{2}\s-\s\d{2}\s-\s\d{3}$/,
        'Invalid phone number',
      )
      .required('Phone number is required'),
  }),
  [ChangeDataType.NAME]: yup.object({
    fieldToChange: yup
      .string()
      .min(2, 'Name must be at least 2 characters long')
      .required('Name is required'),
  }),
};

export default personalDataSchema;
