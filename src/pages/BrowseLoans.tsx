import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Loan, useStateContext } from "../context";
import Loader from "../components/Loader";
import { TokenList } from "../utils/Tokenlist";

interface Token {
  address: string;
}

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
    props.status === "Pending"
      ? "#ff9800"
      : props.status === "Active"
      ? "#4caf50"
      : "#3498db"};
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

const StatsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 2.5rem;
`;

const StatBox = styled.div`
  background-color: #2c2d30;
  border-radius: 16px;
  padding: 1.5rem;
  flex: 1;
  margin: 0 1rem;
  text-align: center;
  transition: transform 0.3s, box-shadow 0.3s;

  &:first-child {
    margin-left: 0;
  }

  &:last-child {
    margin-right: 0;
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  }
`;

const StatTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #a0a0a0;
`;

const StatValue = styled.p<{ color: string }>`
  font-size: 2rem;
  font-weight: 700;
  color: ${(props) => props.color};
  text-shadow: 0 0 10px ${(props) => props.color}40;
  transition: color 0.3s;

  ${StatBox}:hover & {
    color: ${(props) => props.color}CC;
  }
`;

const RadioSwitchContainer = styled.div`
  display: flex;
  background-color: #2c2d30;
  border-radius: 30px;
  overflow: hidden;
  margin-bottom: 2rem;
`;

const RadioButton = styled.label<{ checked: boolean }>`
  flex: 1;
  padding: 0.75rem 1.25rem;
  text-align: center;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
  font-weight: 600;
  color: ${(props) => (props.checked ? "#ffffff" : "#a0a0a0")};
  background-color: ${(props) => (props.checked ? "#3a3b3e" : "transparent")};

  &:hover {
    background-color: ${(props) => (props.checked ? "#3a3b3e" : "#343537")};
  }
`;

const HiddenRadio = styled.input.attrs({ type: "radio" })`
  display: none;
`;

const CreateLoanButton = styled.button`
  font-family: "Poppins", sans-serif;
  background-color: #4caf50;
  color: #ffffff;
  padding: 1rem 2rem;
  border: none;
  border-radius: 12px;
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s;
  margin: 2rem auto;
  display: block;

  &:hover {
    background-color: #45a049;
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(1px);
  }
`;

const EmptyStateContainer = styled.div`
  text-align: center;
  margin-top: 2rem;
`;

const EmptyStateText = styled.p`
  font-size: 1.2rem;
  color: #a0a0a0;
  margin-bottom: 1rem;
`;

const BrowseLoansPage = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");
  const [filteredLoanList, setFilteredLoanList] = useState([]);
  const { parsedLoans: loans, address } = useStateContext(); // Add address to get the current user's address
  const [stats, setStats] = useState({
    active: 0,
    pending: 0,
    closed: 0
  });
  const loansPerPage = 8;

  useEffect(() => {
    const getFilteredLoans = () => {
      setLoading(true);
      const tokenListMap: Record<string, Token> = {};

      // Normalize addresses to lowercase and build the map
      TokenList.forEach((token) => {
        tokenListMap[token.address.toLowerCase()] = token;
      });

      const mappedLoans = loans.map((loan: Loan) => {
        const normalizedBorrowToken = loan.borrowToken.toLowerCase();
        const normalizedCollateralToken = loan.collateralToken.toLowerCase();

        return {
          ...loan,
          tokenA: tokenListMap[normalizedBorrowToken] || null,
          tokenB: tokenListMap[normalizedCollateralToken] || null
        };
      });

      // Apply the filter
      const filteredLoans =
        filter === "all"
          ? mappedLoans
          : mappedLoans.filter(
              (loan: Loan) => loan.owner.toLowerCase() === address.toLowerCase()
            );

      setFilteredLoanList(filteredLoans);

      // Calculate stats based on filtered loans
      const newStats = filteredLoans.reduce(
        (acc: any, loan: Loan) => {
          if (loan.status === "Active") acc.active++;
          else if (loan.status === "Pending") acc.pending++;
          else if (loan.status === "Repaid") acc.closed++;
          return acc;
        },
        { active: 0, pending: 0, closed: 0 }
      );

      setStats(newStats);
      setLoading(false);
    };

    if (loans.length) getFilteredLoans();
  }, [loans, filter, address]); // Add filter and address to the dependency array

  const indexOfLastLoan = currentPage * loansPerPage;
  const indexOfFirstLoan = indexOfLastLoan - loansPerPage;
  const currentLoans = filteredLoanList.slice(
    indexOfFirstLoan,
    indexOfLastLoan
  );

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleLoanClick = (loanId: string) => {
    navigate(`/loan/${loanId}`);
  };

  const handleCreateLoan = () => {
    navigate(`/create`);
  };

  if (loading) return <Loader />;

  return (
    <>
      <Container>
        <StatsContainer>
          <StatBox>
            <StatTitle>Active Loans</StatTitle>
            <StatValue color="#4caf50">{stats.active}</StatValue>
          </StatBox>
          <StatBox>
            <StatTitle>Pending Loans</StatTitle>
            <StatValue color="#ff9800">{stats.pending}</StatValue>
          </StatBox>
          <StatBox>
            <StatTitle>Repiad Loans</StatTitle>
            <StatValue color="#3498db">{stats.closed}</StatValue>
          </StatBox>
        </StatsContainer>

        <RadioSwitchContainer>
          <RadioButton checked={filter === "all"}>
            <HiddenRadio
              name="loanFilter"
              value="all"
              checked={filter === "all"}
              onChange={() => setFilter("all")}
            />
            All Loans
          </RadioButton>
          <RadioButton checked={filter === "my"}>
            <HiddenRadio
              name="loanFilter"
              value="my"
              checked={filter === "my"}
              onChange={() => setFilter("my")}
            />
            My Loans
          </RadioButton>
        </RadioSwitchContainer>
        {!loading && !currentLoans.length ? (
          <EmptyStateContainer>
            <EmptyStateText>
              {filter === "all"
                ? "No loans available at the moment."
                : "You haven't created any loans yet."}
            </EmptyStateText>
            <CreateLoanButton onClick={handleCreateLoan}>
              Create New Loan
            </CreateLoanButton>
          </EmptyStateContainer>
        ) : (
          <>
            <LoanList>
              {currentLoans.map((loan: any) => (
                <LoanCard
                  key={loan.id}
                  onClick={() => handleLoanClick(loan.id)}
                >
                  <LoanDetails>
                    <Borrower>
                      Borrower:{" "}
                      {`${loan.owner.slice(0, 4)}...${loan.owner.slice(-4)}`}
                    </Borrower>
                    <StatusBadge status={loan.status}>
                      {loan.status}
                    </StatusBadge>
                  </LoanDetails>
                  <LoanDetails>
                    <Collateral>
                      <TokenIcon src={loan.tokenB.image} alt="ETH" />
                      <CollateralAmount>
                        {loan.collateralAmount.toFixed(6)} {loan.tokenB.symbol}
                      </CollateralAmount>
                    </Collateral>
                    <Collateral>
                      <TokenIcon src={loan.tokenA.image} alt="USDC" />
                      <CollateralAmount>
                        {loan.borrowAmount} {loan.tokenA.symbol}
                      </CollateralAmount>
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
                length: Math.ceil(filteredLoanList.length / loansPerPage)
              }).map((_, index) => (
                <PageButton key={index} onClick={() => paginate(index + 1)}>
                  {index + 1}
                </PageButton>
              ))}
            </Pagination>
          </>
        )}
      </Container>
    </>
  );
};

export default BrowseLoansPage;
