import { Grid2, Paper, Typography } from '@mui/material';
import './Login.css';
import Button from '../components/base/Button';
import Input from '../components/base/Input';
import { useAuth } from '../context/Auth/AuthContext';
import { Link } from 'react-router-dom';
import Logo from '../components/base/Logo';

const Login = () => {
  const { isLoginLoading, loginInfo, updateLoginInfo, loginError, loginUser } = useAuth();

  const handleSubmit = e => {
    e.preventDefault();
    loginUser();
  };

  return (
    <Paper sx={{ bgcolor: '#000' }}>
      <div style={{ position: 'absolute', top: 20, left: 20 }}>
        <Logo />
      </div>
      <Grid2
        container
        justifyContent="center"
        alignItems="center"
        style={{ height: '100vh', width: '100vw' }}
      >
        <div className="login-container">
          <p
            style={{
              marginBottom: 20,
              color: '#E1FF00',
              fontFamily: "'Jersey 20', serif",
              fontSize: 80,
            }}
          >
            Login
          </p>
          <form onSubmit={handleSubmit} className="login-form">
            <Input
              placeholder="Email"
              value={loginInfo.login}
              onChange={e => updateLoginInfo({ ...loginInfo, login: e.target.value })}
              required
            />
            <Input
              secureTextEntry
              placeholder="Password"
              value={loginInfo.password}
              onChange={e => updateLoginInfo({ ...loginInfo, password: e.target.value })}
              required
            />
            {/* <Link
              to={'/register'}
              style={{
                marginBottom: 20,
                color: '#E1FF00',
                fontFamily: "'Jersey 20', serif",
                fontSize: 20,
              }}
            >
              Have not account yet? Register
            </Link> */}
            <Button disabled={isLoginLoading} onClick={handleSubmit}>
              {isLoginLoading ? 'Logging...' : 'Login'}
            </Button>
            {loginError && <div className="alert alert-danger">{loginError}</div>}
          </form>
        </div>
      </Grid2>
    </Paper>
  );
};

export default Login;
