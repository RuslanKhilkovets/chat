import { createContext, useCallback, useEffect, useState } from 'react';
import { baseUrl, postRequest } from '../utils/services';

export const AuthContext = createContext({});

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [registerError, setRegisterError] = useState(null);
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);
  const [registerInfo, setRegisterInfo] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [loginError, setLoginError] = useState(null);
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [loginInfo, setLoginInfo] = useState({
    email: '',
    password: '',
  });

  const updateRegisterInfo = useCallback(info => {
    return setRegisterInfo(info);
  }, []);

  const updateLoginInfo = useCallback(info => {
    return setLoginInfo(info);
  }, []);

  const registerUser = async e => {
    e.preventDefault();
    setIsRegisterLoading(true);
    setRegisterError(null);

    const res = await postRequest(baseUrl + '/users/register', JSON.stringify(registerInfo));
    if (res.error) {
      setRegisterError(res.message);
      setIsRegisterLoading(false);
      return;
    }

    setIsRegisterLoading(false);

    localStorage.setItem('user', JSON.stringify(res));
    setUser(res);
  };

  const loginUser = async e => {
    e.preventDefault();
    setIsLoginLoading(true);
    setLoginError(null);

    const res = await postRequest(baseUrl + '/users/login', JSON.stringify(loginInfo));
    if (res.error) {
      setLoginError(res.message);
      setIsLoginLoading(false);
      return;
    }

    setIsLoginLoading(false);

    localStorage.setItem('user', JSON.stringify(res));
    setUser(res);
  };
  const logout = useCallback(() => {
    localStorage.removeItem('user');
    setUser(null);
  }, []);

  useEffect(() => {
    const userString = localStorage.getItem('user');
    console.log(userString);

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
