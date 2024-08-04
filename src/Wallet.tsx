import { createWallet } from "thirdweb/wallets";
import { client } from "./client";
import { ConnectButton } from "thirdweb/react";
import { base } from "thirdweb/chains";

const Wallet = () => {
  return (
    <ConnectButton
      wallets={[createWallet("io.metamask")]}
      theme="light"
      chain={base}
      client={client}
    />
  );
};

export default Wallet;
