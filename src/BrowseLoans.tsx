import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Loan, useStateContext } from "./context";

const Container = styled.div`
  font-family: "Poppins", sans-serif;
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  padding: 3rem;
  background-color: #1a1b1e;
  color: #ffffff;
  border-radius: 24px;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.15);

  @media only screen and (min-width: 1600px) {
    max-width: 1200px;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2.5rem;
`;

const FilterContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

const SearchInput = styled.input`
  font-family: "Poppins", sans-serif;
  padding: 0.75rem 1.25rem;
  border: none;
  border-radius: 12px;
  background-color: #2c2d30;
  color: #ffffff;
  font-size: 1rem;
  width: 300px;
`;

const LoanList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`;

const LoanCard = styled.div`
  background-color: #2c2d30;
  border-radius: 16px;
  padding: 2rem;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 16px 32px rgba(0, 0, 0, 0.2);
  }
`;

const LoanDetails = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const Borrower = styled.span`
  font-size: 1.25rem;
  font-weight: 600;
`;

const Collateral = styled.div`
  display: flex;
  align-items: center;
`;

const TokenIcon = styled.img`
  width: 24px;
  height: 24px;
  margin-right: 0.5rem;
`;

const CollateralAmount = styled.span`
  font-size: 1.25rem;
  font-weight: 500;
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

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 2.5rem;
`;

const PageButton = styled.button`
  font-family: "Poppins", sans-serif;
  background-color: #3a3b3e;
  color: #ffffff;
  padding: 0.75rem 1.25rem;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  margin: 0 0.5rem;
  transition: background-color 0.3s;

  &:hover {
    background-color: #4a4b4e;
  }
`;

const BrowseLoansPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  // const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const loansPerPage = 8;
  const { parsedLoans: loans } = useStateContext();

  const filteredLoans = loans.filter((loan: Loan) => {
    const matchesSearch = loan.owner
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    // const matchesFilter =
    //   filter === "all" || loan.status.toLowerCase() === filter;
    return matchesSearch;
  });

  const indexOfLastLoan = currentPage * loansPerPage;
  const indexOfFirstLoan = indexOfLastLoan - loansPerPage;
  const currentLoans = filteredLoans.slice(indexOfFirstLoan, indexOfLastLoan);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleLoanClick = (loanId: string) => {
    navigate(`/loan/${loanId}`);
  };

  return (
    <Container>
      <Header>
        <SearchInput
          type="text"
          placeholder="Search by borrower address"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <FilterContainer>
          {/*   <FilterSelect
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </FilterSelect> */}
        </FilterContainer>
      </Header>
      <LoanList>
        {currentLoans.map((loan: Loan) => (
          <LoanCard key={loan.id} onClick={() => handleLoanClick(loan.id)}>
            <LoanDetails>
              <Borrower>
                Borrower:{" "}
                {`${loan.owner.slice(0, 4)}...${loan.owner.slice(-4)}`}
              </Borrower>
              <StatusBadge status={loan.status}>{loan.status}</StatusBadge>
            </LoanDetails>
            <LoanDetails>
              <Collateral>
                <TokenIcon src="/ethereum.png" alt="ETH" />
                <CollateralAmount>
                  {loan.collateralAmount.toFixed(6)} ETH
                </CollateralAmount>
              </Collateral>
              <Collateral>
                <TokenIcon src="/usdc.png" alt="USDC" />
                <CollateralAmount>{loan.borrowAmount} USDC</CollateralAmount>
              </Collateral>
            </LoanDetails>
            <LoanDetails>
              <span>Interest Rate: {loan.rate}%</span>
              <span>Loan Term: {loan.duration} days</span>
            </LoanDetails>
          </LoanCard>
        ))}
      </LoanList>
      <Pagination>
        {Array.from({
          length: Math.ceil(filteredLoans.length / loansPerPage)
        }).map((_, index) => (
          <PageButton key={index} onClick={() => paginate(index + 1)}>
            {index + 1}
          </PageButton>
        ))}
      </Pagination>
    </Container>
  );
};

export default BrowseLoansPage;
