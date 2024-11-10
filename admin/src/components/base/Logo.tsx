import styled from 'styled-components';

export const Logo = () => {
  const StyledText = styled.p`
    font-size: 40px;
    font-family: 'Jersey 20', serif;
    color: #e1ff00;
    margin: 0;
  `;

  return (
    <>
      <StyledText>Mchat</StyledText>
      <StyledText>Admin dashboard</StyledText>
    </>
  );
};

export default Logo;
