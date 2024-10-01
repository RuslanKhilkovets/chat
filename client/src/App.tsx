import { Navigate, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Chat from './pages/Chat';
import Register from './pages/Register';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'react-bootstrap';
import Navbar from './components/Navbar';
import { AuthContext } from './context/AuthContext';
import { useContext } from 'react';
import { ChatContextProvider } from './context/ChatContext';

function App() {
  const { user } = useContext(AuthContext);
  console.log(user ? '<Chat />' : '<Login />');

  return (
    <ChatContextProvider user={user}>
      <Navbar />
      <Container className="text-secondary">
        <Routes>
          <Route path="/login" element={user ? <Chat /> : <Login />} />
          <Route path="/register" element={user ? <Chat /> : <Register />} />
          <Route path="/" element={user ? <Chat /> : <Login />} />
          <Route path="*" element={<Navigate to={'/'} />} />
        </Routes>
      </Container>
    </ChatContextProvider>
  );
}

export default App;
