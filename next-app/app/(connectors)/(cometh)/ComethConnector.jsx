"use client";

import {
	ComethWallet,
	ConnectAdaptor,
	SupportedNetworks,
	ComethProvider,
} from "@cometh/connect-sdk";
import { useEffect } from "react";
import { useStore } from "@/store";

export const ComethConnector = () => {
	const { setInstanceProvider } = useStore();

	const createWallet = async () => {
		try {
			// setting wallet adaptor
			const walletAdaptor = new ConnectAdaptor({
				chainId: SupportedNetworks.MUMBAI,
				apiKey: process.env.NEXT_PUBLIC_COMETH_API_KEY,
			});

			// creating instance
			const instance = new ComethWallet({
				authAdapter: walletAdaptor,
				apiKey: process.env.NEXT_PUBLIC_COMETH_API_KEY,
			});

			// fetching local address
			const localStorageAddress =
				window.localStorage.getItem("walletAddress");

			if (localStorageAddress) {
				// if local address exists, connect the user
				await instance.connect(localStorageAddress);
			} else {
				// else create new wallet for user
				await instance.connect();
				const walletAddress = await instance.getAddress();
				window.localStorage.setItem("walletAddress", walletAddress);
			}

			// creating instance provider
			const instanceProvider = new ComethProvider(instance);

			// getting user address
			const userAddress = await instanceProvider.getSigner().getAddress();
			console.log(userAddress);

			// setting instance provider
			setInstanceProvider(instanceProvider);
		} catch (err) {
			console.log("Wallet connection error ", err);
		}
	};

	useEffect(() => {
		createWallet();
	}, []);
};
