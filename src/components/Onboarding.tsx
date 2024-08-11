import styled from "styled-components";
import { useLocalStorage } from "react-use"; // Or any other custom hook or method to persist data

const PopupContainer = styled.div<{ show?: boolean }>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 78%;
  max-width: 80%;
  background-color: #fff;
  color: #402d2d;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  display: ${({ show }) => (show ? "block" : "none")};
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
`;

const Content = styled.div`
  font-size: 1.2rem;
  line-height: 1.6;
  margin-bottom: 1.2rem;
`;

const Disclaimer = styled.div`
  border-radius: 8px;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  font-weight: 500;
  color: #d72953;
`;

const Button = styled.button`
  font-family: Poppins;
  background-color: #ff9800;
  color: #ffffff;
  border: none;
  border-radius: 12px;
  padding: 0.75rem 1.25rem;
  font-size: 1.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
  cursor: pointer;

  &:hover {
    background-color: #f57c00;
  }
`;

const OnboardingPopup = () => {
  const [showPopup, setShowPopup] = useLocalStorage(
    "showOnboardingPopup",
    true
  ); // Persistent state for first-time users

  const handleClose = () => {
    setShowPopup(false);
  };

  return (
    <PopupContainer show={showPopup}>
      <Title>Welcome to Our Crypto Lending Platform!</Title>
      <Content>
        <p>
          <strong>Peer-to-Peer Crypto-Based Micro Lending</strong> allows users
          to lend and borrow small amounts of cryptocurrency with ease.
        </p>
        <p>
          <strong>Borrow Loans:</strong> Request loans from other users on the
          platform. Specify the amount, collateral, and interest rate.
        </p>
        <p>
          <strong>Browse Loans:</strong> Explore available loans, view details
          and choose to lend funds to the ones you find suitable.
        </p>
        <p>
          <strong>Loan Details:</strong> Get detailed information about each
          loan including the borrower's address, collateral, and status.
        </p>
        <p>
          <strong>Profile:</strong> Manage and view your ongoing and completed
          loans in your personal portfolio.
        </p>
        <p>
          <strong>Portfolio Page:</strong> View all your token balances on the
          Base blockchain, monitor your investments, and track your assets in
          one place.
        </p>
        <Disclaimer>
          <strong>Disclaimer:</strong> This platform is still in development.
          It's only available on Base and Optimism Mainnet. Please use it at
          your own risk and only with small amounts of funds.
        </Disclaimer>
      </Content>
      <Button onClick={handleClose}>Got It!</Button>
    </PopupContainer>
  );
};

export default OnboardingPopup;
