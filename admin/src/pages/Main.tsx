import Sidebar from '../components/Sidebar';
import { Navigate, Route, Routes } from 'react-router-dom';
import Manage from '../components/tabs/Manage';
import Profile from '../components/tabs/Profile';
import Logs from '../components/tabs/Logs';

const Main = () => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 10fr' }}>
      <Sidebar />
      <div
        className="content"
        style={{
          padding: '20px',
          background: '#212121',
          color: '#fff',
          fontFamily: "'Jersey 20', serif",
          fontSize: 22,
          maxHeight: '100vh',
        }}
      >
        <Routes>
          <Route path="/manage" element={<Manage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/logs" element={<Logs />} />
          <Route path="*" element={<Navigate to="/manage" />} />
        </Routes>
      </div>
    </div>
  );
};

export default Main;
