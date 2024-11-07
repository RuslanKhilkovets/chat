import React, { useState } from 'react';
import { useTheme } from '../../context/Theme/ThemeContext';

interface IInputProps {
  value: string;
  onChange: (text: any) => void;
  placeholder?: string;
  inputStyle?: React.CSSProperties;
  label?: string;
  labelStyle?: React.CSSProperties;
  error?: string;
  errorStyle?: React.CSSProperties;
  disabled?: boolean;
  maxLength?: number;
  endAdornment?: React.JSX.Element | null;
  numberOfLines?: number;
  multiline?: boolean;
  secureTextEntry?: boolean;
  required?: boolean;
}

const Input: React.FC<IInputProps> = ({
  value,
  onChange,
  placeholder,
  inputStyle,
  label,
  labelStyle,
  error,
  disabled = false,
  maxLength,
  endAdornment,
  numberOfLines = 1,
  multiline = false,
  secureTextEntry = false,
  required = false,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(secureTextEntry);

  const { theme, colorScheme } = useTheme();

  const handleTogglePasswordVisibility = () => {
    setShowPassword(prevState => !prevState);
  };

  return (
    <div style={{ ...styles.container, ...(disabled ? styles.disabled : {}) }}>
      {!!label && <label style={{ ...styles.label, ...labelStyle }}>{label}</label>}

      <div
        style={{
          ...styles.inputContainer,
          ...(error ? styles.error : {}),
          ...(isFocused ? styles.activeInput : {}),
          ...(multiline ? { height: numberOfLines * 25 } : {}),
        }}
      >
        <input
          type={showPassword && secureTextEntry ? 'password' : 'text'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          maxLength={maxLength}
          disabled={disabled}
          style={{
            ...styles.input,
            ...inputStyle,
            ...(multiline ? { height: numberOfLines * 20 } : {}),
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          required={required}
        />

        {endAdornment && <div style={styles.endAdornment}>{endAdornment}</div>}

        {secureTextEntry && (
          <button
            type="button"
            style={{ ...styles.endAdornment, background: 'none', border: 'none' }}
            onClick={handleTogglePasswordVisibility}
          >
            <span>{showPassword ? '🔓' : '🔒'}</span>
          </button>
        )}
      </div>

      {!!error && <div style={styles.errorText}>{error}</div>}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    marginBottom: '8px',
    fontSize: '16px',
    color: '#333',
    fontFamily: 'Jersey20',
  },
  inputContainer: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    borderRadius: '24px',
    padding: '12px 16px',
    border: '1px solid #424242',
    backgroundColor: '#1e1e1e',
  },
  input: {
    flex: 1,
    fontSize: '16px',
    fontFamily: 'Jersey20',
    color: '#E1FF00',
    border: 'none',
    outline: 'none',
    backgroundColor: 'transparent',
  },
  activeInput: {
    borderColor: '#000',
  },
  error: {
    borderColor: '#FF0000',
  },
  errorText: {
    color: '#FF0000',
    fontSize: '12px',
    marginTop: '4px',
  },
  disabled: {
    backgroundColor: '#f0f0f0',
    color: '#757575',
    cursor: 'not-allowed',
  },
  endAdornment: {
    marginLeft: '8px',
    cursor: 'pointer',
  },
};

export default Input;
