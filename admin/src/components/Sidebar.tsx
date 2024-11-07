import styled from 'styled-components';
import SidebarButton from './base/SidebarButton';
import Logo from './base/Logo';
import { useAuth } from '../context/Auth/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';

const SidebarContainer = styled.div`
  width: 200px;
  height: 100vh;
  background-color: #000;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  padding: 20px;
`;

interface ISidebarProps {}

const Sidebar: React.FC<ISidebarProps> = () => {
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <SidebarContainer>
      <div style={{ marginBottom: 40 }}>
        <Logo />
      </div>
      <SidebarButton
        onClick={() => navigate('/manage')}
        activeTab={location.pathname === '/manage'}
      >
        Manage
      </SidebarButton>
      <SidebarButton
        onClick={() => navigate('/profile')}
        activeTab={location.pathname === '/profile'}
      >
        Profile
      </SidebarButton>
      <SidebarButton onClick={() => navigate('/logs')} activeTab={location.pathname === '/logs'}>
        Logs
      </SidebarButton>
      <button
        style={{
          width: 'min-content',
          position: 'absolute',
          bottom: 20,
          left: 20,
        }}
        onClick={logout}
      >
        LOGOUT
      </button>
    </SidebarContainer>
  );
};

export default Sidebar;
