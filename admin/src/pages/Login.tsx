import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Grid2, Typography } from '@mui/material';
import './Login.css';

const Login = () => {
  const { loginInfo, updateLoginInfo, loginError, loginUser, isLoginLoading } =
    useContext(AuthContext);

  const handleSubmit = e => {
    e.preventDefault();
    loginUser();
  };

  return (
    <Grid2
      container
      justifyContent="center"
      alignItems="center"
      style={{ height: '100vh', width: '100vw' }}
    >
      <div className="login-container">
        <Typography variant="h3" sx={{ mb: 2 }}>
          Login
        </Typography>
        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="text"
            placeholder="Login"
            value={loginInfo.login || ''}
            onChange={e => updateLoginInfo({ ...loginInfo, login: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={loginInfo.password || ''}
            onChange={e => updateLoginInfo({ ...loginInfo, password: e.target.value })}
            required
          />
          <button type="submit" disabled={isLoginLoading}>
            {isLoginLoading ? 'Logging...' : 'Login'}
          </button>
          {loginError && <div className="alert alert-danger">{loginError}</div>}
        </form>
      </div>
    </Grid2>
  );
};

export default Login;
