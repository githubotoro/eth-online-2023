"use client";

import {
	ComethWallet,
	ConnectAdaptor,
	SupportedNetworks,
} from "@cometh/connect-sdk";

export const createWallet = async () => {
	try {
		const walletAdaptor = new ConnectAdaptor({
			chainId: SupportedNetworks.MUMBAI,
			apiKey: process.env.COMETH_API_KEY,
		});

		const instance = new ComethWallet({
			authAdapter: walletAdaptor,
			apiKey: process.env.COMETH_API_KEY,
			rpcUrl: process.env.POLYGON_MUMBAI_RPC,
		});

		console.log(instance);

		await instance.connect();

		const walletAddress = await instance.getAddress();

		console.log(walletAddress);
	} catch (err) {
		console.log(err);
	}
};

export const ComethConnector = async () => {
	return (
		<button
			onClick={() => {
				createWallet();
			}}
		>
			Create Account
		</button>
	);
};
