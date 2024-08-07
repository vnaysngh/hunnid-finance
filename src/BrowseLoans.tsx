import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { Loan, useStateContext } from "./context";
import { useReadContract } from "thirdweb/react";
import { ethers } from "ethers";

const Container = styled.div`
  font-family: Poppins;
  width: 100%;
  max-width: 90%;
  margin: 0 auto;
  padding: 1rem;
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

const FilterSection = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
`;

const SearchInput = styled.input`
  font-family: Poppins;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 8px;
  background-color: #2c2d30;
  color: #ffffff;
  font-size: 1rem;
  width: 300px;
`;

const FilterSelect = styled.select`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 8px;
  background-color: #2c2d30;
  color: #ffffff;
  font-size: 1rem;
`;

const LoanCard = styled.div`
  background-color: #2c2d30;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
  gap: 0.2rem;
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

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 2rem;
`;

const PageButton = styled.button`
  font-family: Poppins;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  font-size: 0.875rem;
  background-color: #3a3b3e;
  color: #ffffff;
  margin: 0 0.5rem;
  transition: background-color 0.3s;

  &:hover {
    background-color: #4a4b4e;
  }
`;

// Sample data (you would typically fetch this from your backend or blockchain)
const allLoans = [
  {
    borrower: "0x123456789abcdef...",
    borrowedAmount: "5000",
    collateralAmount: "2.5",
    interestRate: "5.5",
    status: "Active"
  },
  {
    borrower: "0x123456789abcdef...",
    borrowedAmount: "10000",
    collateralAmount: "5",
    interestRate: "6",
    status: "Pending"
  },
  {
    borrower: "0x123456789abcdef...",
    borrowedAmount: "10000",
    collateralAmount: "5",
    interestRate: "6",
    status: "Pending"
  },
  {
    borrower: "0x123456789abcdef...",
    borrowedAmount: "10000",
    collateralAmount: "5",
    interestRate: "6",
    status: "Pending"
  },
  {
    borrower: "0x123456789abcdef...",
    borrowedAmount: "10000",
    collateralAmount: "5",
    interestRate: "6",
    status: "Pending"
  },
  {
    borrower: "0x123456789abcdef...",
    borrowedAmount: "10000",
    collateralAmount: "5",
    interestRate: "6",
    status: "Pending"
  }
  // ... more loans ...
];

const BrowseLoansPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  // const [filter, setFilter] = useState("all");
  // const [currentPage, setCurrentPage] = useState(1);
  // const loansPerPage = 10;

  // const filteredLoans = allLoans.filter((loan) => {
  //   const matchesSearch = loan.borrower
  //     .toLowerCase()
  //     .includes(searchTerm.toLowerCase());
  //   const matchesFilter =
  //     filter === "all" || loan.status.toLowerCase() === filter;
  //   return matchesSearch && matchesFilter;
  // });

  // const indexOfLastLoan = currentPage * loansPerPage;
  // const indexOfFirstLoan = indexOfLastLoan - loansPerPage;
  // const currentLoans = filteredLoans.slice(indexOfFirstLoan, indexOfLastLoan);

  // const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const { loans } = useStateContext();

  return (
    <Container>
      <Title>Browse Active Loans</Title>
      <FilterSection>
        <SearchInput
          type="text"
          placeholder="Search by borrower address"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {/*    <FilterSelect
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </FilterSelect> */}
      </FilterSection>
      {loans.map((loan: Loan, index: number) => (
        <LoanCard key={index}>
          <LoanDetail>
            <Label>Borrower</Label>
            <Value>{`${loan.owner.slice(0, 6)}...`}</Value>
          </LoanDetail>
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
              {loan.collateralAmount} ETH
            </Value>
          </LoanDetail>
          <LoanDetail>
            <Label>Interest Rate</Label>
            <Value>{loan.rate}%</Value>
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
      {/* <Pagination>
        {Array.from({
          length: Math.ceil(filteredLoans.length / loansPerPage)
        }).map((_, index) => (
          <PageButton key={index} onClick={() => paginate(index + 1)}>
            {index + 1}
          </PageButton>
        ))}
      </Pagination> */}
    </Container>
  );
};

export default BrowseLoansPage;
