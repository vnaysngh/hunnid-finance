import styled from "styled-components";

const DashboardContainer = styled.div`
  font-family: Poppins;
  width: 100%;
  max-width: 80%;
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

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 10px;
`;

const TableHeader = styled.th`
  text-align: left;
  padding: 1rem;
  color: #b3b3b3;
  font-weight: 600;
  font-size: 1rem;
`;

const TokenItem = styled.tr`
  background-color: #2c2d30;
  transition: background-color 0.3s;

  &:hover {
    background-color: #3a3b3e;
  }
`;

const TableCell = styled.td`
  padding: 1rem;
  color: #ffffff;
  font-size: 0.875rem;

  &:first-child {
    border-top-left-radius: 8px;
    border-bottom-left-radius: 8px;
  }

  &:last-child {
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;
  }
`;

const TokenInfo = styled.div`
  display: flex;
  align-items: center;
`;

const TokenIcon = styled.img`
  width: 30px;
  height: 30px;
  margin-right: 1rem;
  border-radius: 50%;
`;

const TokenName = styled.div`
  font-weight: bold;
  color: #ffffff;
`;

const TokenSymbol = styled.div`
  color: #b3b3b3;
  font-size: 0.75rem;
`;

const LendButton = styled.button`
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

const PortfolioDashboard = () => {
  const tokens = [
    {
      name: "BRETT",
      symbol: "Brett",
      percentage: 23.43,
      price: 0.11,
      priceChange: -9.75,
      balance: 72.31,
      amount: "687.8444 BRETT"
    },
    {
      name: "WELL",
      symbol: "WELL",
      percentage: 18.38,
      price: 0.04,
      priceChange: -13.43,
      balance: 56.74,
      amount: "1,531.1195 WELL"
    },
    {
      name: "AERO",
      symbol: "Aerodrome",
      percentage: 17.95,
      price: 0.73,
      priceChange: -8.9,
      balance: 55.41,
      amount: "76.3126 AERO"
    },
    {
      name: "VIRTUAL",
      symbol: "Virtual Protocol",
      percentage: 10.65,
      price: 0.04,
      priceChange: -3.14,
      balance: 32.88,
      amount: "741.7971 VIRTUAL"
    }
  ];

  return (
    <DashboardContainer>
      <Title>Portfolio Dashboard</Title>
      <Table>
        <thead>
          <tr>
            <TableHeader>Token</TableHeader>
            <TableHeader>Amount (USD)</TableHeader>
            <TableHeader>Balance</TableHeader>
            <TableHeader>Portfolio %</TableHeader>
            <TableHeader>Action</TableHeader>
          </tr>
        </thead>
        <tbody>
          {tokens.map((token, index) => (
            <TokenItem key={index}>
              <TableCell>
                <TokenInfo>
                  <TokenIcon
                    src={`/api/placeholder/30?text=${token.symbol[0]}`}
                    alt={token.name}
                  />
                  <div>
                    <TokenName>{token.name}</TokenName>
                    <TokenSymbol>{token.symbol}</TokenSymbol>
                  </div>
                </TokenInfo>
              </TableCell>
              <TableCell>${token.balance.toFixed(2)}</TableCell>
              <TableCell>{token.amount}</TableCell>
              <TableCell>{token.percentage.toFixed(2)}%</TableCell>
              <TableCell>
                <LendButton>Lend</LendButton>
              </TableCell>
            </TokenItem>
          ))}
        </tbody>
      </Table>
    </DashboardContainer>
  );
};

export default PortfolioDashboard;
