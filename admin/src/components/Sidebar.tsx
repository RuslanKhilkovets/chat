import styled from 'styled-components';
import { Link } from 'react-router-dom';

// Define the styled components
const SidebarContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 200px; // Adjust the width as needed
  height: 100vh;
  background-color: #f8f9fa; // Light background color
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1); // Optional shadow for aesthetics
  display: flex;
  flex-direction: column;
  padding: 20px; // Add some padding
`;

const Sidebar = () => {
  return (
    <SidebarContainer>
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>
    </SidebarContainer>
  );
};

export default Sidebar;
