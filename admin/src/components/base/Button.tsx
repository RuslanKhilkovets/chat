import React from 'react';

type TButtonType = 'primary' | 'secondary' | 'bordered' | 'light';

interface IButtonProps extends React.PropsWithChildren {
  type?: TButtonType;
  onClick: (...params: any) => void;
  style?: React.CSSProperties;
  before?: React.JSX.Element | null;
  after?: React.JSX.Element | null;
  fullWidth?: boolean;
  isLoading?: boolean;
  disabled: boolean;
}

const Button = ({
  children,
  type = 'primary',
  onClick,
  style,
  fullWidth,
  after = null,
  before = null,
  isLoading,
  disabled = false,
}: IButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        ...styles.button,
        ...styles[type],
        ...style,
        ...(fullWidth ? { width: '100%' } : {}),
        cursor: isLoading ? 'wait' : 'pointer', // Add wait cursor when loading
      }}
      disabled={isLoading || disabled}
    >
      {isLoading ? (
        <div className="spinner" style={styles.spinner}></div> // Simple spinner
      ) : (
        before
      )}

      <span
        style={{
          ...styles.buttonText,
          textDecoration: type === 'secondary' ? 'underline' : 'none',
        }}
      >
        {children}
      </span>

      {after}
    </button>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  button: {
    borderRadius: '24px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '12px 20px',
    margin: '10px 0',
    border: 'none',
    outline: 'none',
    transition: 'background-color 0.3s',
  },
  primary: {
    backgroundColor: '#1E1E1E',
  },
  bordered: {
    border: '1px solid #000',
  },
  secondary: {
    backgroundColor: 'transparent',
  },
  light: {
    backgroundColor: '#F8F6F6',
  },
  buttonText: {
    fontSize: '18px',
    fontFamily: 'Arial, sans-serif', // Adjust as needed
  },
  spinner: {
    border: '4px solid #f3f3f3' /* Light gray */,
    borderTop: '4px solid #3498db' /* Blue */,
    borderRadius: '50%',
    width: '20px',
    height: '20px',
    animation: 'spin 2s linear infinite',
  },
};

export default Button;
