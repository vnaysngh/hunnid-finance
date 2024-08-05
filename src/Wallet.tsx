import { createWallet, inAppWallet } from "thirdweb/wallets";
import { client } from "./client";
import { ConnectButton } from "thirdweb/react";
import { base, baseSepolia } from "thirdweb/chains";

const wallets = [
  createWallet("io.metamask"),
  inAppWallet({
    auth: {
      options: ["email", "google", "apple", "facebook", "phone"]
    }
  })
];

const Wallet = () => {
  return (
    <ConnectButton
      wallets={wallets}
      theme="light"
      chains={[base, baseSepolia]}
      client={client}
    />
  );
};

export default Wallet;
