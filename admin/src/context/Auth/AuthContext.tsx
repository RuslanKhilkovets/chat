import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import useAuthMutation from '../../hooks/useAuthMutation';
import { Api } from '../../api/index';

export const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) return null;

  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [registerError, setRegisterError] = useState(null);
  const [registerInfo, setRegisterInfo] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [loginError, setLoginError] = useState(null);
  const [loginInfo, setLoginInfo] = useState({
    login: '',
    password: '',
  });

  const updateRegisterInfo = useCallback(info => {
    return setRegisterInfo(info);
  }, []);

  const updateLoginInfo = useCallback(info => {
    return setLoginInfo(info);
  }, []);

  const { mutate: loginMutate, isLoading: isLoginLoading } = useAuthMutation({
    mutationFn: Api.auth?.login,
    onSuccess: res => {
      setLoginError('');
    },
    onError({ message }) {
      setLoginError(message);
    },
  });

  const { mutate: registerMutate, isLoading: isRegisterLoading } = useAuthMutation({
    mutationFn: Api.auth?.register,
    onSuccess: res => {
      setRegisterError('');
    },
    onError({ message }) {
      setRegisterError(message);
    },
  });

  const loginUser = () => {
    loginMutate(loginInfo);
  };

  const registerUser = () => {
    registerMutate(registerInfo);
  };

  const logout = useCallback(() => {
    localStorage.removeItem('user');
    setUser(null);
  }, []);

  useEffect(() => {
    const userString = localStorage.getItem('user');

    if (userString) {
      setUser(JSON.parse(userString));
    } else {
      setUser(null);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        updateRegisterInfo,
        registerInfo,
        registerError,
        registerUser,
        isRegisterLoading,
        logout,
        loginError,
        isLoginLoading,
        loginInfo,
        loginUser,
        updateLoginInfo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
