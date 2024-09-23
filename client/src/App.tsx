import { Navigate, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Chat from './pages/Chat';
import Register from './pages/Register';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'react-bootstrap';
import Navbar from './components/Navbar';

function App() {
  return (
    <>
      <Navbar />
      <Container className="text-secondary">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Chat />} />
          <Route path="*" element={<Navigate to={'/'} />} />
        </Routes>
      </Container>
    </>
  );
}

export default App;
