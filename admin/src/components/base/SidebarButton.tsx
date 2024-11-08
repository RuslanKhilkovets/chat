import React from 'react';
import styled from 'styled-components';

interface ISidebarButton {
  onClick: () => void;
  activeTab: boolean;
}

const StyledButton = styled.button<{ activeTab: boolean }>`
  text-align: left;
  background-color: ${({ activeTab }) => (activeTab ? '#E1FF00' : 'transparent')};
  color: ${({ activeTab }) => (activeTab ? 'black' : 'white')};
  transition: 0.3s;
  border: none;
  padding: 8px;
  cursor: pointer;
  font-size: 1.2rem;
  &:hover {
    background-color: ${({ activeTab }) => (activeTab ? '#D4E600' : '#333')};
    color: ${({ activeTab }) => (activeTab ? 'black' : '#E1FF00')};
  }
`;

const SidebarButton: React.FC<ISidebarButton & React.PropsWithChildren> = ({
  children,
  onClick,
  activeTab,
}) => {
  return (
    <StyledButton onClick={onClick} activeTab={activeTab}>
      {children}
    </StyledButton>
  );
};

export default SidebarButton;
