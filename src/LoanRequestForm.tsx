import { Alchemy, Network, Utils } from "alchemy-sdk";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { useActiveAccount, useActiveWalletChain } from "thirdweb/react";
import ethereum from "./assets/ethereum.png";
import { useWalletBalance } from "thirdweb/react";
import { client } from "./client";
import axios from "axios";

const config = {
  apiKey: import.meta.env.VITE_ALCHEMY_ACCESS_KEY,
  network: Network.BASE_MAINNET
};
const alchemy = new Alchemy(config);

const Container = styled.div`
  width: 50vw;
  height: 80vh;
  margin: 0 auto;
  padding: 2vh 2vw;
  background-color: #fff;
  display: flex;
  flex-direction: column;
`;

const Title = styled.h1`
  font-size: 3.5vh;
  color: #333;
  margin-bottom: 3vh;
  text-align: center;
`;

const ContentWrapper = styled.div`
  display: flex;
  gap: 2vw;
  flex: 1;
  overflow-y: auto;
`;

const InputSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const InputGroup = styled.div`
  margin-bottom: 2vh;
`;

const Label = styled.label`
  display: block;
  font-weight: bold;
  color: #333;
  margin-bottom: 1vh;
  font-size: 2.2vh;
`;

const InputSelectWrapper = styled.div`
  display: flex;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
  height: 5vh;
`;

const Input = styled.input`
  flex: 1;
  padding: 1vh 1vw;
  border: none;
  outline: none;
  font-size: 2vh;
`;

const Select = styled.div`
  padding: 1vh;
  border: none;
  border-left: 1px solid #ddd;
  background-color: #fff;
  outline: none;
  font-family: "Poppins";
  font-size: 2vh;
  appearance: none;
  display: flex;
  justify-content: space-between;
`;

const TermButtons = styled.div`
  display: flex;
  gap: 1vw;
  margin-top: 2vh;
`;

const TermButton = styled.button<{ active?: boolean }>`
  padding: 1vh 1.5vw;
  background-color: ${(props) => (props.active ? "#e0e0e0" : "white")};
  color: #333;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1.8vh;
  transition: background-color 0.3s;

  &:hover {
    background-color: ${(props) => (props.active ? "#d0d0d0" : "#f0f0f0")};
  }
`;

const StartButton = styled.button`
  background-color: #4a90e2;
  color: white;
  padding: 1.5vh 2vw;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  margin-top: 2vh;
  width: 100%;
  font-size: 2.5vh;
  transition: background-color 0.3s;

  &:hover {
    background-color: #3a7bc8;
  }
`;

const CoinIcon = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 0.5vw;
`;

const TokenBalance = styled.div`
  display: flex;
  justify-content: end;
  margin-top: 0.5vh;
`;

const LoanBorrowingInterface = () => {
  const [term, setTerm] = useState("7 Days");
  const [USDPrice, setUSDPrice] = useState<number | null>(null);
  const activeAccount = useActiveAccount();
  const activeChain = useActiveWalletChain();

  const { data: eth_walletBalance } = useWalletBalance({
    chain: activeChain,
    address: activeAccount?.address,
    client: client
  });

  const { data: usdc_walletBalance } = useWalletBalance({
    chain: activeChain,
    address: activeAccount?.address,
    client: client,
    tokenAddress: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"
  });

  useEffect(() => {
    const getUSDBalance = async () => {
      try {
        const response = await axios.get(
          "https://api.portals.fi/v2/tokens?search=eth&platforms=native&networks=base",
          {
            headers: {
              authorization: import.meta.env.VITE_PORTALS_API_KEY
            }
          }
        );

        const eth_usd_price =
          response.data?.tokens[0].price *
          Number(eth_walletBalance?.displayValue);
        setUSDPrice(eth_usd_price);
      } catch (e) {
        console.log(e);
      }
    };

    if (eth_walletBalance?.displayValue) getUSDBalance();
  }, [eth_walletBalance]);

  return (
    <Container>
      <Title>Create a Loan Request</Title>
      <ContentWrapper>
        <InputSection>
          <InputGroup>
            <Label>I want to borrow</Label>

            <InputSelectWrapper>
              <Input type="number" defaultValue="0.24789545" />
              <Select>
                <CoinIcon>
                  {" "}
                  <img src="/usdc.png" width={32} height={32} />
                </CoinIcon>
                USDC
              </Select>
            </InputSelectWrapper>
            <TokenBalance>
              {usdc_walletBalance
                ? `Balance: ${usdc_walletBalance?.displayValue} USDC`
                : "N/A"}
            </TokenBalance>
          </InputGroup>

          <InputGroup>
            <Label>Collateral Amount</Label>
            <InputSelectWrapper>
              <Input type="number" defaultValue="100" />
              <Select>
                <CoinIcon>
                  <img src="/ethereum.png" width={32} height={32} />
                </CoinIcon>
                ETH
              </Select>
            </InputSelectWrapper>
            <TokenBalance>
              {eth_walletBalance
                ? `Balance: ${Number(eth_walletBalance?.displayValue).toFixed(
                    6
                  )} ETH  ${USDPrice ? `(~$${USDPrice.toFixed(6)})` : ""}`
                : "N/A"}
            </TokenBalance>
          </InputGroup>

          <InputGroup>
            <Label>Interest Rate (%)</Label>
            <InputSelectWrapper>
              <Input
                type="number"
                defaultValue="5"
                step="0.1"
                min="0"
                max="100"
              />
            </InputSelectWrapper>
          </InputGroup>

          <InputGroup>
            <Label>Loan Term</Label>
            <span style={{ color: "#666", fontSize: "1.8vh" }}>
              No interest penalty for early repayment
            </span>
          </InputGroup>

          <TermButtons>
            {["7 Days", "14 Days", "30 Days"].map((t) => (
              <TermButton
                key={t}
                active={term === t}
                onClick={() => setTerm(t)}
              >
                {t}
              </TermButton>
            ))}
          </TermButtons>

          <StartButton>Start Borrowing Now</StartButton>
        </InputSection>

        {/* <InfoBox></InfoBox> */}
      </ContentWrapper>
    </Container>
  );
};

export default LoanBorrowingInterface;
