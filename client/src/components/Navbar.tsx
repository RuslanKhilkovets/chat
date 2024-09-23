import { Navbar as BootstrapNavbar, Container, Nav, Stack } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export const Navbar = () => {
  return (
    <BootstrapNavbar bg="dark" className="mb-4" style={{ height: '3.75rem' }}>
      <Container>
        <h2>
          <Link to="/" className="link-light text-decoration-none">
            ChatApp
          </Link>
        </h2>
        <span className="text-warning">Logged as Charles</span>
        <Nav>
          <Stack direction="horizontal" gap={3}>
            <Link to="/login" className="link-light text-decoration-none">
              Login
            </Link>
            <Link to="/register" className="link-light text-decoration-none">
              Register
            </Link>
          </Stack>
        </Nav>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;
