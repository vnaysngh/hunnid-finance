import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {
  useActiveAccount,
  useActiveWalletChain,
  useWalletBalance
} from "thirdweb/react";
import { client } from "./client";
import axios from "axios";

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

const FormSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
`;

const InputGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  font-weight: 600;
  color: #b3b3b3;
  margin-bottom: 0.5rem;
  font-size: 1rem;
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  background-color: #2c2d30;
  border-radius: 8px;
  overflow: hidden;
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem;
  border: none;
  background-color: transparent;
  color: #ffffff;
  font-size: 1rem;
  outline: none;

  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

const TokenSelect = styled.div`
  padding: 0.5rem 1rem;
  color: #ffffff;
  font-weight: 600;
  display: flex;
  align-items: center;
`;

const TokenIcon = styled.img`
  width: 24px;
  height: 24px;
  margin-right: 0.5rem;
`;

const Balance = styled.div`
  color: #b3b3b3;
  font-size: 0.875rem;
  margin-top: 0.5rem;
`;

const TermButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const TermButton = styled.button<{ active: boolean }>`
  font-family: Poppins;
  padding: 0.75rem 1.5rem;
  background-color: ${(props) => (props.active ? "#4a4b4e" : "#2c2d30")};
  color: #ffffff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;

  &:hover {
    background-color: #4a4b4e;
  }
`;

const StartButton = styled.button`
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
`;

const LoanRequestForm = () => {
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
        console.error(e);
      }
    };

    if (eth_walletBalance?.displayValue) getUSDBalance();
  }, [eth_walletBalance]);

  return (
    <Container>
      <Title>Create a Loan Request</Title>
      <FormSection>
        <InputGroup>
          <Label>I want to borrow</Label>
          <InputWrapper>
            <Input type="number" defaultValue="0.24789545" />
            <TokenSelect>
              <TokenIcon src="/usdc.png" alt="USDC" />
              USDC
            </TokenSelect>
          </InputWrapper>
          <Balance>
            Balance:{" "}
            {usdc_walletBalance
              ? `${usdc_walletBalance.displayValue} USDC`
              : "N/A"}
          </Balance>
        </InputGroup>

        <InputGroup>
          <Label>Collateral Amount</Label>
          <InputWrapper>
            <Input type="number" defaultValue="100" />
            <TokenSelect>
              <TokenIcon src="/ethereum.png" alt="ETH" />
              ETH
            </TokenSelect>
          </InputWrapper>
          <Balance>
            Balance:{" "}
            {eth_walletBalance
              ? `${Number(eth_walletBalance.displayValue).toFixed(6)} ETH ${
                  USDPrice ? `(~$${USDPrice.toFixed(2)})` : ""
                }`
              : "N/A"}
          </Balance>
        </InputGroup>
      </FormSection>

      <InputGroup>
        <Label>Interest Rate (%)</Label>
        <InputWrapper>
          <Input type="number" defaultValue="5" step="0.1" min="0" max="100" />
        </InputWrapper>
      </InputGroup>

      <InputGroup>
        <Label>Loan Term</Label>
        <div
          style={{
            color: "#b3b3b3",
            fontSize: "0.875rem",
            marginBottom: "0.5rem"
          }}
        >
          No interest penalty for early repayment
        </div>
        <TermButtons>
          {["7 Days", "14 Days", "30 Days"].map((t) => (
            <TermButton key={t} active={term === t} onClick={() => setTerm(t)}>
              {t}
            </TermButton>
          ))}
        </TermButtons>
      </InputGroup>

      <StartButton>Start Borrowing Now</StartButton>
    </Container>
  );
};

export default LoanRequestForm;
