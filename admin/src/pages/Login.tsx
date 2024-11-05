import { useContext } from 'react';
import { Alert, Button, Col, Form, Row, Stack } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const { loginInfo, updateLoginInfo, loginError, loginUser, isLoginLoading } =
    useContext(AuthContext);

  return (
    <>
      <Form onSubmit={loginUser}>
        <Row style={{ height: '100vh', justifyContent: 'center', paddingTop: '20%' }}>
          <Col xs={6}>
            <Stack gap={3}>
              <h2>Login</h2>
              <Form.Control
                type="email"
                placeholder="Email"
                onChange={e => updateLoginInfo({ ...loginInfo, email: e.target.value })}
              />
              <Form.Control
                type="password"
                placeholder="Password"
                onChange={e => updateLoginInfo({ ...loginInfo, password: e.target.value })}
              />
              <Button variant="primary" type="submit">
                {isLoginLoading ? 'Logging...' : 'Login'}
              </Button>

              {loginError && <Alert variant="danger">{loginError}</Alert>}
            </Stack>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default Login;
