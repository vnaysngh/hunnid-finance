import styled from "styled-components";
import Wallet from "./Wallet";

const DashboardContainer = styled.div`
  min-height: 100vh;
  background: #f5f7fa;
  position: relative;
  padding: 30px;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: radial-gradient(
        circle at 25px 25px,
        rgba(0, 0, 0, 0.05) 2%,
        transparent 0%
      ),
      radial-gradient(
        circle at 75px 75px,
        rgba(0, 0, 0, 0.05) 2%,
        transparent 0%
      );
    background-size: 100px 100px;
    opacity: 0.3;
    pointer-events: none;
  }
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Logo = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: #333333;
`;

const AccountValue = styled.div`
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #333333;
`;

const AccountChange = styled.span<{ negative?: string }>`
  color: ${(props) => (props?.negative ? "#d32f2f" : "#388e3c")};
  font-size: 16px;
`;

const TokenInfo = styled.div`
  display: flex;
  align-items: center;
`;

const TokenIcon = styled.img`
  width: 30px;
  height: 30px;
  margin-right: 10px;
  border-radius: 50%;
`;

const TokenName = styled.div`
  font-weight: bold;
  color: #333333;
`;

const TokenSymbol = styled.div`
  color: #666666;
  font-size: 14px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 10px;
`;

const TableHeader = styled.th`
  text-align: left;
  padding: 10px;
  color: #666666;
  font-weight: 600;
`;

const TableCell = styled.td`
  padding: 10px;
  color: #333333;

  &:first-child {
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
  }

  &:last-child {
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
  }
`;

const LendButton = styled.button`
  background-color: #2196f3;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 5px 10px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #1976d2;
  }
`;

const TokenItem = styled.tr`
  background-color: #ffffff;
  transition: background-color 0.3s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: #f0f4f8;
  }

  td {
    background-color: inherit;
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
      <Header>
        <Logo>Portfolio Dashboard</Logo>
        <Wallet />
      </Header>

      <AccountValue>
        $308.68
        <AccountChange negative="true">-$30.65 (-9.93%)</AccountChange>
      </AccountValue>

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
                    src={`https://via.placeholder.com/30?text=${token.symbol[0]}`}
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
