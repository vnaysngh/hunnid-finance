import { useMemo } from "react";
import styled from "styled-components";
import { Loan, useStateContext } from "../context"; // Assuming you have a similar context setup
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";

const Container = styled.div`
  font-family: "Poppins", sans-serif;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #1a1b1e;
  color: #ffffff;
  border-radius: 24px;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.15);
`;

const ProfileInfo = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
`;

const UserName = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
`;

const UserAddress = styled.p`
  font-size: 1rem;
  color: #b3b3b3;
`;

const StatisticsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-bottom: 2.5rem;
`;

const StatBox = styled.div`
  background-color: #2c2d30;
  border-radius: 16px;
  padding: 1rem;
  text-align: center;
`;

const StatLabel = styled.span`
  display: block;
  font-size: 1rem;
  font-weight: 600;
  color: #b3b3b3;
  margin-bottom: 0.5rem;
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: 500;
  color: #ffffff;
`;

const LoansSection = styled.div`
  margin-top: 2rem;
`;

const LoanCard = styled.div`
  background-color: #2c2d30;
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const LoanDetail = styled.div`
  font-size: 1rem;
`;

const Label = styled.span`
  color: #b3b3b3;
  display: block;
  margin-bottom: 0.25rem;
`;

const Value = styled.span`
  font-weight: 600;
  display: flex;
  align-items: center;
`;

const TokenIcon = styled.img`
  width: 20px;
  height: 20px;
  margin-right: 0.5rem;
`;

const StatusBadge = styled.span<{ status: string }>`
  background-color: ${(props) =>
    props.status === "Active"
      ? "#4caf50"
      : props.status === "Pending"
      ? "#ff9800"
      : "#f44336"};
  color: #ffffff;
  padding: 0.5rem 0.75rem;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
`;

const ActionButton = styled.button`
  font-family: "Poppins", sans-serif;
  background-color: #3a3b3e;
  color: #ffffff;
  padding: 0.75rem 1.25rem;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #4a4b4e;
  }
`;

const UserProfilePage = () => {
  const navigate = useNavigate();
  const { parsedLoans } = useStateContext(); // Assuming you have this in your context

  const userProfile = {
    name: "Ethan Blockchain",
    address: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    avatarUrl: "https://i.pravatar.cc/300"
  };

  const statistics = useMemo(() => {
    const activeLoans = parsedLoans.filter(
      (loan: Loan) => loan.status === "Active"
    ).length;
    const pendingLoans = parsedLoans.filter(
      (loan: Loan) => loan.status === "Pending"
    ).length;
    const closedLoans = parsedLoans.filter(
      (loan: Loan) => loan.status === "Closed"
    ).length;

    return { activeLoans, pendingLoans, closedLoans };
  }, [parsedLoans]);

  const handleLoanClick = (loanId: string) => {
    navigate(`/loan/${loanId}`);
  };

  return (
    <>
      {!parsedLoans.length ? (
        <Loader />
      ) : (
        <Container>
          <ProfileInfo>
            <div>
              <UserName>{userProfile.name}</UserName>
              <UserAddress>{userProfile.address}</UserAddress>
            </div>
          </ProfileInfo>
          <StatisticsContainer>
            <StatBox>
              <StatLabel>Active Loans</StatLabel>
              <StatValue>{statistics.activeLoans}</StatValue>
            </StatBox>
            <StatBox>
              <StatLabel>Pending Loans</StatLabel>
              <StatValue>{statistics.pendingLoans}</StatValue>
            </StatBox>
            <StatBox>
              <StatLabel>Closed Loans</StatLabel>
              <StatValue>{statistics.closedLoans}</StatValue>
            </StatBox>
          </StatisticsContainer>
          <LoansSection>
            <h2>Loans</h2>
            {parsedLoans.map((loan: Loan, index: number) => (
              <LoanCard key={index}>
                <LoanDetail>
                  <Label>Borrowed</Label>
                  <Value>
                    <TokenIcon src="/usdc.png" alt="USDC" />
                    {loan.borrowAmount} USDC
                  </Value>
                </LoanDetail>
                <LoanDetail>
                  <Label>Collateral</Label>
                  <Value>
                    <TokenIcon src="/ethereum.png" alt="ETH" />
                    {loan.collateralAmount.toFixed(6)} ETH
                  </Value>
                </LoanDetail>
                <LoanDetail>
                  <Label>End Date</Label>
                  <Value>{loan.endDate}</Value>
                </LoanDetail>
                <StatusBadge status={loan.status}>{loan.status}</StatusBadge>
                <ActionButton onClick={() => handleLoanClick(loan.id)}>
                  View Details
                </ActionButton>
              </LoanCard>
            ))}
          </LoansSection>
        </Container>
      )}
    </>
  );
};

export default UserProfilePage;
