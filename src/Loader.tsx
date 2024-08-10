import styled, { keyframes } from "styled-components";

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
  background-color: #1a1b1e; // Match your theme color
`;

const Logo = styled.img`
  width: 100px; // Adjust the size as needed
  height: 100px;
  animation: ${spin} 2s linear infinite;
`;

const Loader = () => {
  return (
    <LoaderContainer>
      <Logo src={"/favicon.png"} alt="Loading..." />
    </LoaderContainer>
  );
};

export default Loader;
