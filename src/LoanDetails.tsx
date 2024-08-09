import { useParams } from "react-router-dom";
import styled from "styled-components";
import { Loan, useStateContext } from "./context";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";

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

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: #ffffff;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const StatusBadge = styled.span<{ status: string }>`
  background-color: ${(props) =>
    props.status === "Pending" ? "#ff9800" : "#4caf50"};
  color: #ffffff;
  padding: 0.75rem 1.25rem;
  border-radius: 24px;
  font-size: 1rem;
  font-weight: 600;
`;

const DetailsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2.5rem;
`;

const DetailGroup = styled.div`
  background-color: #2c2d30;
  border-radius: 16px;
  padding: 1rem;
`;

const Label = styled.span`
  display: block;
  font-size: 1rem;
  font-weight: 600;
  color: #b3b3b3;
  margin-bottom: 0.75rem;
`;

const Value = styled.div`
  font-size: 1.5rem;
  font-weight: 500;
  color: #ffffff;
  display: flex;
  align-items: center;
`;

const TokenIcon = styled.img`
  width: 24px;
  height: 24px;
  margin-right: 0.75rem;
`;

const ActionButton = styled.button`
  font-family: "Poppins", sans-serif;
  background-color: #4caf50;
  color: #ffffff;
  padding: 1.25rem 2.5rem;
  border: none;
  border-radius: 12px;
  font-size: 1.25rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 2.5rem;

  &:hover {
    background-color: #43a047;
  }
`;

const LoanDetailsPage = () => {
  const { loanId } = useParams();
  const { parsedLoans, loans, approveAndPayLoan, address } = useStateContext();
  const [price, setPrice] = useState<number | null>(null);

  useEffect(() => {
    const getUSDPrice = async () => {
      try {
        const response = await axios.get(
          "https://api.portals.fi/v2/tokens?search=eth&platforms=native&networks=base",
          {
            headers: {
              authorization: import.meta.env.VITE_PORTALS_API_KEY
            }
          }
        );

        setPrice(response.data?.tokens[0].price);
      } catch (e) {
        console.error(e);
      }
    };

    getUSDPrice();
  }, []);

  const loanDetails: Loan = useMemo(() => {
    if (parsedLoans?.length && loanId) {
      return parsedLoans.filter((loan: Loan) => loan.id == loanId)?.[0];
    }
  }, [loanId, parsedLoans]);

  const currentLTV = useMemo(() => {
    if (loanDetails?.borrowAmount && loanDetails?.collateralAmount && price) {
      return (
        (loanDetails.borrowAmount /
          (loanDetails.collateralAmount * Number(price))) *
        100
      );
    }
  }, [loanDetails, price]);

  const openExplorer = () => {
    window.open(
      `https://base.blockscout.com/address/${loanDetails.owner}`,
      "_blank"
    );
  };

  const handlePayLoan = async () => {
    const rawLoan: Loan = loans.filter((loan: Loan) => loan.id == loanId)?.[0];
    approveAndPayLoan(rawLoan);
  };

  return (
    <Container>
      <Header>
        <Title onClick={openExplorer}>
          Created by:{" "}
          {`${loanDetails?.owner.slice(0, 4)}...${loanDetails?.owner.slice(
            -4
          )}`}
        </Title>
        <StatusBadge status={loanDetails?.status}>
          {loanDetails?.status}
        </StatusBadge>
      </Header>
      <DetailsContainer>
        <DetailGroup>
          <Label>Borrowed Amount</Label>
          <Value>
            <TokenIcon src="/usdc.png" alt="USDC" />
            {loanDetails?.borrowAmount} USDC
          </Value>
        </DetailGroup>
        <DetailGroup>
          <Label>Collateral Amount</Label>
          <Value>
            <TokenIcon src="/ethereum.png" alt="ETH" />
            {loanDetails?.collateralAmount.toFixed(6)} ETH
          </Value>
        </DetailGroup>
        <DetailGroup>
          <Label>Interest Rate</Label>
          <Value>{loanDetails?.rate}%</Value>
        </DetailGroup>
        <DetailGroup>
          <Label>Loan Term</Label>
          <Value>{loanDetails?.duration} days</Value>
        </DetailGroup>
        <DetailGroup>
          <Label>Start Date</Label>
          <Value>{loanDetails?.startDate}</Value>
        </DetailGroup>
        <DetailGroup>
          <Label>End Date</Label>
          <Value>{loanDetails?.endDate}</Value>
        </DetailGroup>
        <DetailGroup>
          <Label>Current LTV</Label>
          <Value>{currentLTV?.toFixed(4) ?? "-"}</Value>
        </DetailGroup>
        {/*  <DetailGroup>
          <Label>End Date</Label>
          <Value>{loanDetails?.endDate}</Value>
        </DetailGroup> */}
      </DetailsContainer>
      {loanDetails.owner !== address && (
        <ActionButton onClick={handlePayLoan}>Transfer</ActionButton>
      )}
    </Container>
  );
};

export default LoanDetailsPage;
