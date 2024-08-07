import { useContext, createContext, useMemo } from "react";
import { useActiveAccount, useReadContract } from "thirdweb/react";
import { defineChain, getContract, prepareContractCall } from "thirdweb";
import { useSendTransaction } from "thirdweb/react";
import { ethers } from "ethers";
import { client } from "../client";

export type Loan = {
  borrowAmount: number;
  borrowToken: string;
  collateralAmount: number;
  collateralToken: string;
  deadline: number;
  duration: number;
  owner: string;
  rate: number;
  status: string;
};

const StateContext = createContext<any>({});

export const StateContextProvider = ({ children }: { children: any }) => {
  const { mutateAsync: sendTransaction } = useSendTransaction();
  // connect to your contract
  const contract = getContract({
    client,
    chain: defineChain(84532),
    address: "0xE2839896dAc48d41231396961e470d70E2EC2396"
  });
  const activeAccount = useActiveAccount();

  const publishLoan = async (formDetails: any) => {
    if (!activeAccount?.address) {
      console.log("invalid address");
      return;
    }
    const transaction = prepareContractCall({
      contract,
      method:
        "function createLoan(address _owner, address _borrowToken, address _collateralToken, uint256 _borrowAmount, uint256 _collateralAmount, uint256 _rate, uint256 _duration, uint256 _deadline) returns (uint256)",
      params: [
        activeAccount?.address,
        "0xD4fA4dE9D8F8DB39EAf4de9A19bF6910F6B5bD60",
        "0x4200000000000000000000000000000000000006",
        ethers.toBigInt("1000000000000000000"),
        ethers.toBigInt("2000000000000000000"),
        ethers.toBigInt("5"),
        ethers.toBigInt("30"),
        ethers.toBigInt("1722972809")
      ]
    });
    sendTransaction(transaction)
      .then((res) => console.log("success", res))
      .catch((e) => console.log(e));
  };

  const { data: loans } = useReadContract({
    contract,
    method:
      "function getLoans() view returns ((address owner, address borrowToken, address collateralToken, uint256 borrowAmount, uint256 collateralAmount, uint256 rate, uint256 duration, uint256 deadline)[])"
  });

  const parsedLoans: Loan[] | [] = useMemo(() => {
    if (loans?.length) {
      return loans.map((loan) => ({
        borrowAmount: Number(ethers.formatEther(loan.borrowAmount)),
        borrowToken: loan.borrowToken,
        collateralAmount: Number(ethers.formatEther(loan.collateralAmount)),
        collateralToken: loan.collateralToken,
        deadline: Number(loan.deadline),
        duration: Number(loan.duration),
        owner: loan.owner,
        rate: Number(loan.rate),
        status: "pending"
      }));
    } else return [];
  }, [loans]);

  return (
    <StateContext.Provider
      value={{
        contract,
        address: activeAccount?.address,
        loans: parsedLoans,
        publishLoan
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
