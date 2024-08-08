import React, { useState, useEffect, useMemo } from "react";
import styled from "styled-components";
import {
  useActiveAccount,
  useActiveWalletChain,
  useWalletBalance
} from "thirdweb/react";
import { client } from "./client";
import axios from "axios";
import { useStateContext } from "./context";
import { ethers } from "ethers";
import TransactionConfirmationPopup from "./components/TransactionPopup";

const Container = styled.div`
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
  font-family: Poppins;
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

const AdditionalInfoContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
  padding: 1rem;
  background-color: #2c2d30;
  border-radius: 8px;
`;

const InfoItem = styled.div`
  text-align: center;
`;

const InfoLabel = styled.div`
  color: #b3b3b3;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
`;

const InfoValue = styled.div`
  color: #ffffff;
  font-size: 1.25rem;
  font-weight: 600;
`;

export type FormDetails = {
  borrowAmount: string;
  borrowToken: string;
  collateralAmount: string;
  collateralToken: string;
  rate: string;
  duration: number;
};

const LoanRequestForm = () => {
  const [price, setPrice] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const activeAccount = useActiveAccount();
  const activeChain = useActiveWalletChain();
  const { publishLoan } = useStateContext();

  const borrowToken = "0xD4fA4dE9D8F8DB39EAf4de9A19bF6910F6B5bD60";
  const collateralToken = "0x4200000000000000000000000000000000000006";

  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState<FormDetails>({
    borrowAmount: "",
    borrowToken,
    collateralAmount: "",
    collateralToken,
    rate: "5",
    duration: 7
  });

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

        setPrice(response.data?.tokens[0].price);
      } catch (e) {
        console.error(e);
      }
    };

    if (eth_walletBalance?.displayValue) getUSDBalance();
  }, [eth_walletBalance]);

  const handleCloseModal = () => {
    setError(null);
    setTxHash(null);
    setIsModalOpen(false);
  };

  const handleFormFieldsChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsModalOpen(true);
    setIsLoading(true);
    //86,400 total seconds in a day multiplied by chosen duration
    const response = await publishLoan({
      ...form,
      borrowAmount: ethers.parseUnits(form.borrowAmount, 18),
      collateralAmount: ethers.parseUnits(form.collateralAmount, 18)
    });

    if (response.transactionHash) setTxHash(response.transactionHash);
    else setError(response.message);
    setIsLoading(false);
  };

  useEffect(() => {
    if (!price) return;
    const collateralAmountInUSDC = Number(form.borrowAmount) / 0.6;
    const collateralAmountInETH = collateralAmountInUSDC / price;
    setForm({ ...form, collateralAmount: collateralAmountInETH.toString() });
  }, [
    form.borrowAmount,
    form.collateralAmount,
    form.rate,
    form.duration,
    eth_walletBalance
  ]);

  const collateralAmountInUSD = useMemo(() => {
    if (!price || !eth_walletBalance?.displayValue) return 0;
    else return Number(price) * Number(eth_walletBalance?.displayValue);
  }, [eth_walletBalance, price]);

  const totalInterestAmount = useMemo(() => {
    if (!form.borrowAmount || !form.rate || !form.collateralAmount) return 0;
    else return (Number(form.borrowAmount) * Number(form.rate)) / 100;
  }, [
    collateralAmountInUSD,
    form.borrowAmount,
    form.collateralAmount,
    form.rate
  ]);

  const totalRepaymentAmount = useMemo(() => {
    if (!totalInterestAmount) return 0;
    return Number(form.borrowAmount) + totalInterestAmount;
  }, [totalInterestAmount]);

  const liqiuidationPrice = useMemo(() => {
    if (!totalRepaymentAmount || !form.collateralAmount) return 0;
    const collateralRequired = totalRepaymentAmount / 0.75;
    return collateralRequired / Number(form.collateralAmount);
  }, [totalRepaymentAmount, form.collateralAmount]);

  const isError =
    Number(form.collateralAmount) > Number(eth_walletBalance?.displayValue);

  return (
    <Container>
      <FormSection>
        <InputGroup>
          <Label>I want to borrow</Label>
          <InputWrapper>
            <Input
              type="number"
              name="borrowAmount"
              placeholder="100"
              value={form.borrowAmount}
              onChange={handleFormFieldsChange}
            />
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
            <Input
              type="number"
              name="collateralAmount"
              placeholder="0.25"
              value={form.collateralAmount}
              onChange={handleFormFieldsChange}
            />
            <TokenSelect>
              <TokenIcon src="/ethereum.png" alt="ETH" />
              ETH
            </TokenSelect>
          </InputWrapper>
          {isError && (
            <Label style={{ color: "red", marginTop: 5 }}>
              Insufficient Balance
            </Label>
          )}
          <Balance>
            Balance:{" "}
            {eth_walletBalance
              ? `${Number(eth_walletBalance.displayValue).toFixed(6)} ETH ${
                  collateralAmountInUSD
                    ? `(~$${collateralAmountInUSD.toFixed(2)})`
                    : ""
                }`
              : "N/A"}
          </Balance>
        </InputGroup>
      </FormSection>

      <InputGroup>
        <Label>Interest Rate (%)</Label>
        <InputWrapper>
          <Input
            type="number"
            name="rate"
            defaultValue="5"
            step="0.1"
            min="0"
            max="100"
            value={form.rate}
            onChange={handleFormFieldsChange}
          />
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
          {[7, 14, 30].map((t) => (
            <TermButton
              key={t}
              active={form.duration === t}
              onClick={() => setForm({ ...form, duration: t })}
            >
              {t} Days
            </TermButton>
          ))}
        </TermButtons>
      </InputGroup>

      <AdditionalInfoContainer>
        <InfoItem>
          <InfoLabel>Initial LTV (Loan-to-value Ratio)</InfoLabel>
          <InfoValue style={{ color: "#318d46" }}>60%</InfoValue>
        </InfoItem>
        <InfoItem>
          <InfoLabel>Liquidation Price (ETH/USDC)</InfoLabel>
          <InfoValue style={{ color: "red" }}>
            {liqiuidationPrice.toFixed(4)}
          </InfoValue>
        </InfoItem>
        <InfoItem>
          <InfoLabel>Total Interest Amount</InfoLabel>
          <InfoValue>{totalInterestAmount} USDC</InfoValue>
        </InfoItem>
        <InfoItem>
          <InfoLabel>Total Repayment Amount</InfoLabel>
          <InfoValue>{totalRepaymentAmount} USDC</InfoValue>
        </InfoItem>
      </AdditionalInfoContainer>

      <StartButton onClick={handleSubmit} disabled={isError}>
        Start Borrowing Now
      </StartButton>

      <TransactionConfirmationPopup
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        txHash={txHash}
        error={error}
      />
    </Container>
  );
};

export default LoanRequestForm;
