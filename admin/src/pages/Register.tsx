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
      <Logo />
      <Grid2
        container
        justifyContent="center"
        alignItems="center"
        style={{ height: '100vh', width: '100vw' }}
      >
        <div className="login-container">
          <Typography variant="h3" sx={{ mb: 2, color: '#E1FF00' }}>
            Register
          </Typography>
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

            <Link to={'/'} style={{ color: '#E1FF00' }}>
              Already have an account? Login !
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
