import { client } from "./client";
import { ConnectButton as ConnectWallet } from "thirdweb/react";

const Wallet = () => {
  return <ConnectWallet client={client} />;
};

export default Wallet;
