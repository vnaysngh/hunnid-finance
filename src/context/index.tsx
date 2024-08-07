import { useContext, createContext, useMemo } from "react";
import { useActiveAccount, useReadContract } from "thirdweb/react";
import { defineChain, getContract, prepareContractCall } from "thirdweb";
import { useSendTransaction } from "thirdweb/react";
import { ethers } from "ethers";
import { client } from "../client";
import { FormDetails } from "../LoanRequestForm";

enum LoanStatus {
  Pending,
  Active,
  Repaid
}
console.log(LoanStatus[0]);

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
  const { mutateAsync: sendTransaction } = useSendTransaction();
  // connect to your contract
  const contract = getContract({
    client,
    chain: defineChain(84532),
    address: "0x5968B982f0f3bA0a1fDF423A81cdF76488096B82"
  });
  const activeAccount = useActiveAccount();

  const publishLoan = async (form: FormDetails) => {
    if (!activeAccount?.address) {
      console.log("invalid address");
      return;
    }
    const startDate = Math.round(new Date().getTime() / 1000);
    const endDate = startDate + form.duration * 86400;

    const transaction = prepareContractCall({
      contract,
      method:
        "function createLoan(address _owner, address _borrowToken, address _collateralToken, uint256 _borrowAmount, uint256 _collateralAmount, uint256 _rate, uint256 _duration, uint256 _startDate, uint256 _endDate) returns (uint256)",
      params: [
        activeAccount?.address,
        form.borrowToken,
        form.collateralToken,
        ethers.toBigInt(form.borrowAmount),
        ethers.toBigInt(form.collateralAmount),
        ethers.toBigInt(form.rate),
        ethers.toBigInt(form.duration),
        ethers.toBigInt(startDate),
        ethers.toBigInt(endDate)
      ]
    });
    sendTransaction(transaction)
      .then((res) => console.log("success", res))
      .catch((e) => console.log(e));
  };

  const { data: loans } = useReadContract({
    contract,
    method:
      "function getLoans() view returns ((uint256 id, address owner, address borrowToken, address collateralToken, uint256 borrowAmount, uint256 collateralAmount, uint256 rate, uint256 duration, uint256 startDate, uint256 endDate, uint8 status)[])"
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
