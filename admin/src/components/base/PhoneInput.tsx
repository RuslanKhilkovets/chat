import Input from './Input';

interface IPhoneInput {
  value: string;
  onChange: (() => void) | ((text: string) => void);
  placeholder?: string;
  error?: string;
  label?: string;
}

const PhoneInput = ({ placeholder, value, onChange, error, label }: IPhoneInput) => {
  return (
    <Input
      label={label}
      placeholder={placeholder || 'Телефон'}
      value={value}
      onChangeText={onChange}
      error={error}
    />
  );
};

export default PhoneInput;
