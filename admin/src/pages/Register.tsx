import { Grid2, Paper, Typography } from '@mui/material';
import './Login.css';
import Button from '../components/base/Button';
import Input from '../components/base/Input';
import { useAuth } from '../context/Auth/AuthContext';
import { Link } from 'react-router-dom';
import Logo from '../components/base/Logo';

const Register = () => {
  const { isRegisterLoading, registerInfo, updateRegisterInfo, registerError, registerUser } =
    useAuth();

  const handleSubmit = e => {
    e.preventDefault();
    registerUser();
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
            Register
          </p>
          <form onSubmit={handleSubmit} className="login-form">
            {/* <Input
              placeholder="Name"
              value={registerInfo.name}
              onChange={e => updateRegisterInfo({ ...registerInfo, name: e.target.value })}
              required
            /> */}
            <Input
              placeholder="Email"
              value={registerInfo.login}
              onChange={e => updateRegisterInfo({ ...registerInfo, login: e.target.value })}
              required
            />
            <Input
              secureTextEntry
              placeholder="Password"
              value={registerInfo.password}
              onChange={e => updateRegisterInfo({ ...registerInfo, password: e.target.value })}
              required
            />

            <Link
              to={'/login'}
              style={{
                marginBottom: 20,
                color: '#E1FF00',
                fontFamily: "'Jersey 20', serif",
                fontSize: 20,
              }}
            >
              Have not account yet? Register
            </Link>
            <Button disabled={isRegisterLoading} onClick={handleSubmit}>
              {isRegisterLoading ? 'Registering...' : 'Register'}
            </Button>
            {registerError && <div className="alert alert-danger">{registerError}</div>}
          </form>
        </div>
      </Grid2>
    </Paper>
  );
};

export default Register;
