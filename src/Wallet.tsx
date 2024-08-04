import { useSDK } from "@metamask/sdk-react";
import styled from "styled-components";

const AccountInfo = styled.div`
  color: #ffffff;
  font-size: 14px;
  text-align: right;
`;

const ConnectButton = styled.button`
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #45a049;
  }
`;

type WalletProps = {
  connected: boolean;
  account: string | undefined;
};

const Wallet = ({ connected, account }: WalletProps) => {
  const { sdk } = useSDK();

  const connect = async () => {
    try {
      await sdk?.connect();
    } catch (err) {
      console.warn("failed to connect..", err);
    }
  };

  const disconnect = async () => {
    try {
      await sdk?.disconnect();
    } catch (err) {
      console.warn("failed to connect..", err);
    }
  };
  return (
    <div className="App">
      {connected && account ? (
        <AccountInfo>
          <div onClick={disconnect}>{`Connected account: ${account?.slice(
            0,
            6
          )}...${account?.slice(-4)}`}</div>
        </AccountInfo>
      ) : (
        <ConnectButton onClick={connect}>Connect Wallet</ConnectButton>
      )}
    </div>
  );
};

export default Wallet;
