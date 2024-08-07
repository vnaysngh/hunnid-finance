import styled from "styled-components";

const Container = styled.div`
  font-family: Poppins;
  width: 100%;
  max-width: 800px;
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

const DetailSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
`;

const DetailGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  font-weight: 600;
  color: #b3b3b3;
  margin-bottom: 0.5rem;
  font-size: 1rem;
`;

const Value = styled.div`
  font-size: 1.25rem;
  color: #ffffff;
  background-color: #2c2d30;
  padding: 1rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
`;

const TokenIcon = styled.img`
  width: 24px;
  height: 24px;
  margin-right: 0.5rem;
`;

const StatusBadge = styled.span`
  background-color: #4a4b4e;
  color: #ffffff;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
`;

const ActionButton = styled.button`
  font-family: Poppins;
  padding: 1rem 2rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  font-size: 1.25rem;
  width: 100%;
  margin-top: 2rem;
  transition: background-color 0.3s;
  background-color: #3a3b3e;
  color: #ffffff;

  &:hover {
    background-color: #4a4b4e;
  }
`;

const LoanDetailsPage = () => {
  return (
    <Container>
      <Title>Loan Details</Title>
      <DetailSection>
        <DetailGroup>
          <Label>Borrowed Amount</Label>
          <Value>
            <TokenIcon src="/usdc.png" alt="USDC" />
            {/* {loanDetails.borrowedAmount} USDC */}
          </Value>
        </DetailGroup>
        <DetailGroup>
          <Label>Collateral Amount</Label>
          <Value>
            <TokenIcon src="/ethereum.png" alt="ETH" />
            {/* {loanDetails.collateralAmount} ETH */}
          </Value>
        </DetailGroup>
      </DetailSection>
      <DetailSection>
        <DetailGroup>
          <Label>Interest Rate</Label>
          <Value>{/* {loanDetails.interestRate}% */}</Value>
        </DetailGroup>
        <DetailGroup>
          <Label>Loan Term</Label>
          <Value>{/* {loanDetails.loanTerm} */}</Value>
        </DetailGroup>
      </DetailSection>
      <DetailSection>
        <DetailGroup>
          <Label>Start Date</Label>
          <Value>{/* {loanDetails.startDate} */}</Value>
        </DetailGroup>
        <DetailGroup>
          <Label>End Date</Label>
          <Value>{/* {loanDetails.endDate} */}</Value>
        </DetailGroup>
      </DetailSection>
      <DetailGroup>
        <Label>Loan Status</Label>
        <Value>
          <StatusBadge>{/* {loanDetails.status} */}</StatusBadge>
        </Value>
      </DetailGroup>
      <ActionButton>Repay Loan</ActionButton>
    </Container>
  );
};

export default LoanDetailsPage;
