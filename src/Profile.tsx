import styled from "styled-components";

const Container = styled.div`
  font-family: Poppins;
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #1a1b1e;
  color: #ffffff;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #ffffff;
  margin-bottom: 2rem;
  text-align: center;
  font-weight: 700;
`;

const ProfileSection = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
`;

const Avatar = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-right: 2rem;
`;

const UserInfo = styled.div``;

const UserName = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
`;

const UserAddress = styled.p`
  font-size: 1rem;
  color: #b3b3b3;
`;

const LoansSection = styled.div`
  margin-top: 2rem;
`;

const LoanCard = styled.div`
  background-color: #2c2d30;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 1rem;
  align-items: center;
`;

const LoanDetail = styled.div`
  font-size: 0.875rem;
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
  width: 16px;
  height: 16px;
  margin-right: 0.25rem;
`;

const StatusBadge = styled.span`
  background-color: #4a4b4e;
  color: #ffffff;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
`;

const ActionButton = styled.button`
  font-family: Poppins;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  font-size: 0.875rem;
  background-color: #3a3b3e;
  color: #ffffff;
  transition: background-color 0.3s;

  &:hover {
    background-color: #4a4b4e;
  }
`;

// Sample user profile data
const userProfile = {
  name: "Ethan Blockchain",
  address: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
  avatarUrl: "https://i.pravatar.cc/300"
};

// Sample active loans data
const activeLoans = [
  {
    id: "loan1",
    borrowedAmount: "5000",
    collateralAmount: "2.5",
    startDate: "2023-07-15",
    endDate: "2023-08-15",
    interestRate: "5.5",
    status: "Active"
  },
  {
    id: "loan2",
    borrowedAmount: "10000",
    collateralAmount: "5",
    startDate: "2023-07-20",
    endDate: "2023-08-20",
    interestRate: "6",
    status: "Active"
  },
  {
    id: "loan3",
    borrowedAmount: "2500",
    collateralAmount: "1.25",
    startDate: "2023-07-25",
    endDate: "2023-08-25",
    interestRate: "5",
    status: "Active"
  },
  {
    id: "loan4",
    borrowedAmount: "7500",
    collateralAmount: "3.75",
    startDate: "2023-07-30",
    endDate: "2023-08-30",
    interestRate: "5.75",
    status: "Active"
  }
];

export { userProfile, activeLoans };

const UserProfilePage = () => {
  return (
    <Container>
      <Title>User Profile</Title>
      <ProfileSection>
        <Avatar src={userProfile.avatarUrl} alt={userProfile.name} />
        <UserInfo>
          <UserName>{userProfile.name}</UserName>
          <UserAddress>{userProfile.address}</UserAddress>
        </UserInfo>
      </ProfileSection>
      <LoansSection>
        <h2>Active Loans</h2>
        {activeLoans.map((loan, index) => (
          <LoanCard key={index}>
            <LoanDetail>
              <Label>Borrowed</Label>
              <Value>
                <TokenIcon src="/usdc.png" alt="USDC" />
                {loan.borrowedAmount} USDC
              </Value>
            </LoanDetail>
            <LoanDetail>
              <Label>Collateral</Label>
              <Value>
                <TokenIcon src="/ethereum.png" alt="ETH" />
                {loan.collateralAmount} ETH
              </Value>
            </LoanDetail>
            <LoanDetail>
              <Label>End Date</Label>
              <Value>{loan.endDate}</Value>
            </LoanDetail>
            <LoanDetail>
              <Label>Status</Label>
              <Value>
                <StatusBadge>{loan.status}</StatusBadge>
              </Value>
            </LoanDetail>
            <ActionButton onClick={() => console.log(`View loan ${index}`)}>
              View Details
            </ActionButton>
          </LoanCard>
        ))}
      </LoansSection>
    </Container>
  );
};

export default UserProfilePage;
