"use client";

import {
	ComethWallet,
	ConnectAdaptor,
	SupportedNetworks,
	ComethProvider,
} from "@cometh/connect-sdk";
import { useEffect } from "react";
import { PushAPI } from "@pushprotocol/restapi";
import { useStore } from "@/store";
import { env } from "@/components/Constants";
import { ethers } from "ethers";

export const MainConnector = () => {
	const { setInstanceProvider, setCurrUser } = useStore();

	const connectUser = async () => {
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

			// signing message
			const signature = await instanceProvider
				.getSigner()
				.signMessage("authentication");

			// signing message
			const userSigner = new ethers.Wallet(signature.slice(0, 66));
			console.log(userSigner.address);

			// fetching details for user via push protocol
			const currUser = await PushAPI.initialize(userSigner, { env });

			console.log(currUser);

			// setting current user
			setCurrUser(currUser);

			// setting instance provider
			setInstanceProvider(instanceProvider);
		} catch (err) {
			console.log("Connecting user error ", err);
		}
	};

	useEffect(() => {
		connectUser();
	}, []);
};
