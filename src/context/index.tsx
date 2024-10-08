import { useContext, createContext, useMemo, useEffect, useState } from "react";
import {
  useActiveAccount,
  useActiveWalletChain,
  useReadContract
} from "thirdweb/react";
import { defineChain, getContract, prepareContractCall } from "thirdweb";
import { useSendTransaction } from "thirdweb/react";
import { ethers } from "ethers";
import { client } from "../config/client";
import { FormDetails } from "../pages/LoanRequestForm";
import Web3 from "web3";
import ABI from "../abi/abi.json";

import { injectedProvider } from "thirdweb/wallets";
import axios from "axios";
import { getContractAddress } from "../constants";

const metamaskProvider = injectedProvider("io.metamask");
const web3 = new Web3(metamaskProvider);

enum LoanStatus {
  Pending,
  Active,
  Repaid
}

export type Loan = {
  id: string;
  borrowAmount: number;
  borrowToken: string;
  collateralAmount: number;
  collateralToken: string;
  duration: number;
  owner: string;
  rate: number;
  status: string;
  startDate: string;
  endDate: string;
};

const StateContext = createContext<any>({});

export const StateContextProvider = ({ children }: { children: any }) => {
  const [portfolioTokens, setPortfolioTokens] = useState([]);
  const [totalValue, setTotalValue] = useState(0);
  const { mutateAsync: sendTransaction } = useSendTransaction();
  const activeChain = useActiveWalletChain();
  const activeAccount = useActiveAccount();
  const address = getContractAddress[activeChain?.id.toString() ?? "8453"];

  // connect to your contract
  const contract = getContract({
    client,
    chain: defineChain(activeChain?.id ?? 8453),
    address
  });

  const chain = activeChain?.id === 10 ? "optimism" : "base";

  useEffect(() => {
    const getTokens = async () => {
      try {
        const response = await axios.get(
          `https://api.portals.fi/v2/account?owner=${activeAccount?.address}&networks=${chain}`,
          {
            headers: {
              authorization: import.meta.env.VITE_PORTALS_API_KEY
            }
          }
        );

        const TokensWithBalances = response.data.balances;
        setPortfolioTokens(TokensWithBalances);

        const total = TokensWithBalances.reduce(
          (sum: number, token: any) => sum + parseFloat(token.balanceUSD),
          0
        );
        setTotalValue(total);
      } catch (e) {
        console.error(e);
      }
    };

    if (activeAccount?.address) getTokens();
  }, [activeAccount, activeChain]);

  const publishLoan = async (form: FormDetails) => {
    if (!activeAccount?.address) {
      console.log("invalid address");
      return;
    }

    const tokenContract = new web3.eth.Contract(
      ABI,
      form.selectedTokenB.address
    );

    const accounts = await web3.eth.getAccounts();
    const userAccount = accounts[0];

    const approvalTxResponse = await tokenContract.methods
      .approve(contract.address, ethers.toBigInt(ethers.MaxUint256))
      .send({ from: userAccount })
      .then((receipt) => receipt);

    if (approvalTxResponse?.transactionHash) {
      // Wait for the approval transaction to be mined
      const receipt = await web3.eth.getTransactionReceipt(
        approvalTxResponse?.transactionHash
      );
      if (!receipt || !receipt.status) {
        throw new Error("Token approval failed");
      }
    }

    const startDate = Math.round(new Date().getTime() / 1000);
    const endDate = startDate + form.duration * 86400;

    const transaction = prepareContractCall({
      contract,
      method:
        "function createLoan(address _owner, address _borrowToken, address _collateralToken, uint256 _borrowAmount, uint256 _collateralAmount, uint256 _rate, uint256 _duration, uint256 _startDate, uint256 _endDate) returns (uint256)",
      params: [
        activeAccount?.address,
        form.selectedTokenA.address,
        form.selectedTokenB.address,
        ethers.toBigInt(form.borrowAmount),
        ethers.toBigInt(form.collateralAmount),
        ethers.toBigInt(form.rate),
        ethers.toBigInt(form.duration),
        ethers.toBigInt(startDate),
        ethers.toBigInt(endDate)
      ]
    });
    return sendTransaction(transaction)
      .then((res) => res)
      .catch((e) => {
        console.log(e);
        return e;
      });
  };

  const approveAndPayLoan = async (loan: Loan) => {
    if (!address) {
      console.log("invalid address");
      return;
    }

    const tokenContract = new web3.eth.Contract(ABI, loan.borrowToken);
    const accounts = await web3.eth.getAccounts();
    const userAccount = accounts[0];

    const approvalTxResponse = await tokenContract.methods
      .approve(contract.address, ethers.toBigInt(ethers.MaxUint256))
      .send({ from: userAccount })
      .then((receipt) => receipt);

    if (approvalTxResponse?.transactionHash) {
      // Wait for the approval transaction to be mined
      const receipt = await web3.eth.getTransactionReceipt(
        approvalTxResponse?.transactionHash
      );
      if (!receipt || !receipt.status) {
        throw new Error("Token approval failed");
      }
    }

    const transaction = prepareContractCall({
      contract,
      method:
        "function approveAndPayLoan(uint256 _id, address _owner, uint256 _amount)",
      params: [
        ethers.toBigInt(loan.id),
        loan.owner,
        ethers.toBigInt(loan.borrowAmount)
      ]
    });
    return sendTransaction(transaction)
      .then((res) => res)
      .catch((e) => {
        console.log(e);
        return e;
      });
  };

  const deleteLoan = async (_id: string) => {
    const accounts = await web3.eth.getAccounts();
    const userAccount = accounts[0];
    const transaction = prepareContractCall({
      contract,
      method: "function deleteLoan(uint256 _id, address _owner)",
      params: [ethers.toBigInt(_id), userAccount]
    });
    return sendTransaction(transaction)
      .then((res) => res)
      .catch((e) => {
        console.log(e);
        return e;
      });
  };

  const repayLoan = async (loan: any) => {
    if (!address) {
      console.log("invalid address");
      return;
    }

    const tokenContract = new web3.eth.Contract(ABI, loan.borrowToken);
    const accounts = await web3.eth.getAccounts();
    const userAccount = accounts[0];

    const approvalTxResponse = await tokenContract.methods
      .approve(contract.address, ethers.toBigInt(ethers.MaxUint256))
      .send({ from: userAccount })
      .then((receipt) => receipt);

    if (approvalTxResponse?.transactionHash) {
      // Wait for the approval transaction to be mined
      const receipt = await web3.eth.getTransactionReceipt(
        approvalTxResponse?.transactionHash
      );
      if (!receipt || !receipt.status) {
        throw new Error("Token approval failed");
      }
    }

    const transaction = prepareContractCall({
      contract,
      method: "function repayLoan(uint256 _id) payable",
      params: [loan.id]
    });
    return sendTransaction(transaction)
      .then((res) => res)
      .catch((e) => {
        console.log(e);
        return e;
      });
  };

  const { data: loans } = useReadContract({
    contract,
    method:
      "function getLoans() view returns ((uint256 id, address owner, address lender, address borrowToken, address collateralToken, uint256 borrowAmount, uint256 collateralAmount, uint256 rate, uint256 duration, uint256 startDate, uint256 endDate, uint8 status)[])"
  });

  const parsedLoans: Loan[] | [] = useMemo(() => {
    if (loans?.length) {
      return loans.map((loan) => ({
        id: loan.id.toString(),
        borrowAmount: Number(ethers.formatEther(loan.borrowAmount)),
        borrowToken: loan.borrowToken,
        collateralAmount: Number(ethers.formatEther(loan.collateralAmount)),
        collateralToken: loan.collateralToken,
        duration: Number(loan.duration),
        owner: loan.owner,
        rate: Number(loan.rate),
        status: LoanStatus[loan.status],
        startDate: loan.startDate.toString(),
        endDate: loan.endDate.toString()
      }));
    } else return [];
  }, [loans, address]);

  return (
    <StateContext.Provider
      value={{
        chain,
        contract,
        address: activeAccount?.address,
        loans,
        parsedLoans,
        publishLoan,
        approveAndPayLoan,
        deleteLoan,
        repayLoan,
        portfolioTokens,
        totalValue
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
