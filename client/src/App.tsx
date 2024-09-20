import { Navigate, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Chat from './pages/Chat';
import Register from './pages/Register';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Chat />} />
      <Route path="*" element={<Navigate to={'/'} />} />
    </Routes>
  );
}

export default App;
