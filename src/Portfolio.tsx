import styled from "styled-components";
import { useStateContext } from "./context";
import Loader from "./Loader";

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
  color: #fff;
  margin: 0;
`;

const TokensContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1rem;
`;

const TokenItem = styled.div`
  background-color: #2c2d30;
  border-radius: 16px;
  padding: 1rem;
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 1rem;
`;

const TokenInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const TokenIcon = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 50%;
`;

const TokenDetails = styled.div``;

const TokenName = styled.div`
  font-weight: 600;
  color: #ffffff;
  font-size: 1.1rem;
`;

const TokenSymbol = styled.div`
  color: #b3b3b3;
  font-size: 0.9rem;
`;

const TokenBalance = styled.div`
  text-align: right;
`;

const TokenAmount = styled.div`
  font-size: 1.1rem;
  font-weight: 500;
  color: #ffffff;
`;

const TokenValue = styled.div`
  font-size: 0.9rem;
  color: #b3b3b3;
`;

const TotalBalanceCard = styled.div`
  background-color: #2c2d30;
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const BalanceLabel = styled.div`
  font-size: 1.2rem;
  color: #b3b3b3;
  margin-right: 0.5rem;
`;

const TotalValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: #4caf50;
`;

const PortfolioDashboard = () => {
  const { portfolioTokens, totalValue, address } = useStateContext();

  return (
    <>
      {!portfolioTokens.length ? (
        <Loader />
      ) : (
        <Container>
          <Header>
            <Title>
              Base: {address?.slice(0, 6)}...
              {address?.slice(-4)}
            </Title>
            <TotalBalanceCard>
              <BalanceLabel>Total Balance: </BalanceLabel>
              <TotalValue>${totalValue.toFixed(2)}</TotalValue>
            </TotalBalanceCard>
          </Header>
          <TokensContainer>
            {portfolioTokens &&
              portfolioTokens.map((token: any, index: number) => (
                <TokenItem key={index}>
                  <TokenInfo>
                    <TokenIcon src={token.image} alt={token.name} />
                    <TokenDetails>
                      <TokenName>{token.name}</TokenName>
                      <TokenSymbol>{token.symbol}</TokenSymbol>
                    </TokenDetails>
                  </TokenInfo>
                  <div /> {/* Spacer */}
                  <TokenBalance>
                    <TokenAmount>
                      {parseFloat(token.balance).toFixed(6)} {token.symbol}
                    </TokenAmount>
                    <TokenValue>
                      ${parseFloat(token.balanceUSD).toFixed(2)}
                    </TokenValue>
                  </TokenBalance>
                </TokenItem>
              ))}
          </TokensContainer>
        </Container>
      )}
    </>
  );
};

export default PortfolioDashboard;
