import React, { useState, useEffect, useMemo } from "react";
import styled from "styled-components";
import {
  useActiveAccount,
  useActiveWalletChain,
  useWalletBalance
} from "thirdweb/react";
import { client } from "./client";
import axios from "axios";
import { useStateContext, web3 } from "./context";
import { ethers } from "ethers";
import TransactionConfirmationPopup from "./components/TransactionPopup";
import ABI from "./abi.json";
import TokenSelectionPopup from "./TokenSelectPopup";

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
  cursor: pointer;
  background: rgba(0, 0, 0, 0.2);
  margin-right: 0.5rem;
  border-radius: 8px;
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
  collateralAmount: string;
  rate: string;
  duration: number;
  selectedTokenA: any;
  selectedTokenB: any;
};

const LoanRequestForm = () => {
  const [price, setPrice] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTokenSelect, setIsTokenSelect] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [selectedType, setSelectedType] = useState("");
  const activeAccount = useActiveAccount();
  const activeChain = useActiveWalletChain();
  const { publishLoan, portfolioTokens } = useStateContext();

  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState<FormDetails>({
    borrowAmount: "",
    collateralAmount: "",
    rate: "5",
    duration: 7,
    selectedTokenA: {},
    selectedTokenB: {}
  });

  useEffect(() => {
    const setSelectedTokens = () => {
      const borrowToken = portfolioTokens.find(
        (token: any) => token.symbol === "USDC"
      );
      const collateralToken = portfolioTokens.find(
        (token: any) => token.symbol === "ETH"
      );

      setForm({
        ...form,
        selectedTokenA: borrowToken,
        selectedTokenB: collateralToken
      });
    };
    if (portfolioTokens?.length) setSelectedTokens();
  }, [portfolioTokens]);

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
          "https://api.portals.fi/v2/tokens?ids=base:0x940181a94A35A4569E4529A3CDfB74e38FD98631",
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
    const response = await publishLoan({
      ...form,
      borrowAmount: ethers.parseUnits(form.borrowAmount, 18),
      collateralAmount: ethers.parseUnits(form.collateralAmount, 18)
    });

    if (response?.transactionHash) setTxHash(response?.transactionHash);
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

  const handleTokenSelectPopup = (type: string) => {
    setIsTokenSelect(true);
    setSelectedType(type);
  };

  const handleTokenSelect = (token: any) => {
    setForm({
      ...form,
      [selectedType]: token
    });
    setIsTokenSelect(false);
  };

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
            <TokenSelect
              onClick={() => handleTokenSelectPopup("selectedTokenA")}
            >
              <TokenIcon src={form.selectedTokenA.image} alt="USDC" />
              {form.selectedTokenA?.symbol}
            </TokenSelect>
          </InputWrapper>
          <Balance>
            Balance:{" "}
            {form.selectedTokenA.name
              ? `${form.selectedTokenA.balance.toFixed(3)}   ${
                  form.selectedTokenA?.symbol
                } 
                ${
                  form.selectedTokenA.balanceUSD
                    ? `(~$${form.selectedTokenA.balanceUSD.toFixed(2)})`
                    : ""
                }`
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
            <TokenSelect
              onClick={() => handleTokenSelectPopup("selectedTokenB")}
            >
              <TokenIcon src={form.selectedTokenB.image} alt="ETH" />
              {form.selectedTokenB?.symbol}
            </TokenSelect>
          </InputWrapper>
          {isError && (
            <Label style={{ color: "red", marginTop: 5 }}>
              Insufficient Balance
            </Label>
          )}
          <Balance>
            Balance:{" "}
            {form.selectedTokenB.name
              ? `${form.selectedTokenB.balance.toFixed(3)}   ${
                  form.selectedTokenB?.symbol
                } 
                ${
                  form.selectedTokenB.balanceUSD
                    ? `(~$${form.selectedTokenB.balanceUSD.toFixed(2)})`
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

      <TokenSelectionPopup
        isOpen={isTokenSelect}
        onClose={() => setIsTokenSelect(false)}
        onSelect={handleTokenSelect}
        tokens={portfolioTokens}
        selectedTokenA={form.selectedTokenA.address}
        selectedTokenB={form.selectedTokenB.address}
        type={selectedType}
      />
    </Container>
  );
};

export default LoanRequestForm;
