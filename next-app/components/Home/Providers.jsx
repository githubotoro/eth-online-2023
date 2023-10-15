"use client";

import * as React from "react";
import {
	RainbowKitProvider,
	getDefaultWallets,
	connectorsForWallets,
} from "@rainbow-me/rainbowkit";
import {
	argentWallet,
	trustWallet,
	ledgerWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { mainnet } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { XMTPProvider } from "@xmtp/react-sdk";

const { chains, publicClient, webSocketPublicClient } = configureChains(
	[mainnet],
	[publicProvider()]
);

const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_ID;

const { wallets } = getDefaultWallets({
	appName: "ETH-Line",
	projectId,
	chains,
});

const appInfo = {
	appName: "ETH-Line",
};

const connectors = connectorsForWallets([
	...wallets,
	{
		groupName: "Other",
		wallets: [
			argentWallet({ projectId, chains }),
			trustWallet({ projectId, chains }),
			ledgerWallet({ projectId, chains }),
		],
	},
]);

const wagmiConfig = createConfig({
	autoConnect: true,
	connectors,
	publicClient,
	webSocketPublicClient,
});

export function Providers({ children }) {
	const [mounted, setMounted] = React.useState(false);
	React.useEffect(() => setMounted(true), []);
	return (
		<WagmiConfig config={wagmiConfig}>
			<RainbowKitProvider chains={chains} appInfo={appInfo}>
				<XMTPProvider>{mounted && children}</XMTPProvider>
			</RainbowKitProvider>
		</WagmiConfig>
	);
}
