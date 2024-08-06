import React, { useContext, createContext } from "react";
import { useReadContract, useActiveAccount } from "thirdweb/react";
import { defineChain, getContract, prepareContractCall } from "thirdweb";
import { useSendTransaction } from "thirdweb/react";
import { ethers } from "ethers";
import { client } from "../client";

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

  return (
    <StateContext.Provider
      value={{
        address: activeAccount?.address,
        createLoan: publishLoan
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
