import React from 'react';
import {useTranslation} from 'react-i18next';

import {regex} from '@/constants';
import {Input} from '@/components';

interface IPhoneInput {
  value: string;
  onChange: (() => void) | ((text: string) => void);
  placeholder?: string;
  error?: string;
  label?: string;
}

const PhoneInput = ({
  placeholder,
  value,
  onChange,
  error,
  label,
}: IPhoneInput) => {
  const {t} = useTranslation();

  return (
    <Input
      label={label}
      placeholder={placeholder || t('input.Phone')}
      value={value}
      onChangeText={onChange}
      error={error}
      mask={regex.PHONE_MASK}
      maxLength={regex.PHONE_MASK.length}
      keyboardType="numeric"
    />
  );
};

export default PhoneInput;
