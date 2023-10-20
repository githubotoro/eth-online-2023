"use client";

import {
	ComethWallet,
	ConnectAdaptor,
	SupportedNetworks,
	ComethProvider,
} from "@cometh/connect-sdk";
import React, { useEffect, useState } from "react";
import { PushAPI } from "@pushprotocol/restapi";
import { useStore } from "@/store";
import { env, ANIMATE } from "@/components/Constants";
import { ethers } from "ethers";
import { toast } from "react-hot-toast";
import { Checker } from "@/components/Loaders/Checker";
import { StaticBar } from "./StaticBar";
import * as PushAPIRest from "@pushprotocol/restapi";
// import { Client } from "@xmtp/xmtp-js";
import { Client, useClient } from "@xmtp/react-sdk";

export const MainConnector = () => {
	// fetching store
	const {
		setInstanceProvider,
		setCurrUser,
		username,
		setUsername,
		isConnecting,
		setIsConnecting,
		userSigner,
		userFound,
		setUserFound,
		setUserSigner,
		confirmingIdentity,
		setConfirmingIdentity,
		isRegistering,
		setIsRegistering,
		inviteCode,
		setInviteCode,
		setXmtpClient,
		setOgAddress,
		onCall,
	} = useStore();

	// fetching xmtp client creators
	const { initialize } = useClient();

	const ENCODING = "binary";

	const buildLocalStorageKey = (walletAddress) =>
		walletAddress ? `xmtp:production:keys:${walletAddress}` : "";

	const loadKeys = (walletAddress) => {
		const val = localStorage.getItem(buildLocalStorageKey(walletAddress));
		return val ? Buffer.from(val, ENCODING) : null;
	};

	const storeKeys = (walletAddress, keys) => {
		localStorage.setItem(
			buildLocalStorageKey(walletAddress),
			Buffer.from(keys).toString(ENCODING)
		);
	};

	const wipeKeys = (walletAddress) => {
		localStorage.removeItem(buildLocalStorageKey(walletAddress));
	};

	const createXmtpClient = async ({ signer }) => {
		try {
			const address = await signer.address;
			let keys = loadKeys(address);

			const options = {
				env: "production",
			};

			if (!keys) {
				keys = await Client.getKeys(signer, {
					...options,
					skipContactPublishing: true,
					persistConversations: false,
				});
				storeKeys(address, keys);
			}

			await initialize({ keys, options, signer });
		} catch (err) {
			console.log("XMTP client creation error ", err);
		}
	};

	const connectUser = async ({ registerCall }) => {
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

				// user already exists
				setUserFound(true);
			} else {
				// check for registration call
				if (registerCall === false) {
					// connection established
					setIsConnecting(false);
					return;
				}

				// else create new wallet for user
				await instance.connect();
				const walletAddress = await instance.getAddress();
				window.localStorage.setItem("walletAddress", walletAddress);
				window.localStorage.setItem("username", username);
			}

			// finding username
			const currUsername = window.localStorage.getItem("username");
			setUsername(currUsername);

			// finding og address
			const currOgAddress = window.localStorage.getItem("ogAddress");
			setOgAddress(currOgAddress);

			// if(!currUsername) {
			// 	const res = await fetch('/api/username')
			// 	const data = await res.json()
			// 	setUsername(data.username)
			// }

			// confirming identity
			setConfirmingIdentity(true);

			// creating instance provider
			const instanceProvider = new ComethProvider(instance);

			// signing message
			const signature = await instanceProvider
				.getSigner()
				.signMessage("authentication");

			const newUserSigner = new ethers.Wallet(signature.slice(0, 66));

			// creating xmtp client
			// await createXmtpClient({ signer: newUserSigner });

			// const xmtpClient = await Client.create(newUserSigner, {
			// 	env: "production",
			// });
			// setXmtpClient(xmtpClient);

			// check push subscription
			const pushSubscription =
				window.localStorage.getItem("pushSubscription");

			if (!pushSubscription) {
				await PushAPIRest.channels.subscribe({
					signer: newUserSigner,
					channelAddress: `eip155:5:0xaC7cD662FD84C8D14a18c65ADE38326fF95521e7`,
					userAddress: `eip155:5:${newUserSigner.address}`,
					env: "staging",
				});

				window.localStorage.setItem("pushSubscription", true);
			}

			// console.log(userSigner.address);
			setUserSigner(newUserSigner);

			// fetching details for user via push protocol
			const currUser = await PushAPI.initialize(newUserSigner, { env });

			// setting current user
			setCurrUser(currUser);

			// setting instance provider
			setInstanceProvider(instanceProvider);

			// established connection
			setIsConnecting(false);

			if (registerCall === true) {
				// store user address in database
				const res = await fetch("/api/users", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						id: newUserSigner.address,
						username,
						inviteCode,
					}),
				});

				const data = await res.json();

				if (data.code === 201) {
					toast.success("Successfully registered!");
				} else if (data.code === 401) {
					setUserSigner(null);
					toast.error("invalid invite code");
				} else {
					toast.success("Successfully registered!");
				}
			}

			// identity confirmed
			setConfirmingIdentity(false);
		} catch (err) {
			console.log("Connecting user error ", err);
		}
	};

	useEffect(() => {
		connectUser({ registerCall: false });
	}, []);

	const GREEN_SPINNER = "fill-isGreenLight h-6 w-6";
	const RING = "fill-isSystemLightTertiary";

	if (onCall === true) {
		return <React.Fragment></React.Fragment>;
	} else if (isConnecting === true) {
		return (
			<React.Fragment>
				<Checker cta="Signing In" classes={GREEN_SPINNER} ring={RING} />
			</React.Fragment>
		);
	} else if (confirmingIdentity === true) {
		return (
			<React.Fragment>
				<Checker
					cta="Confirming Identity"
					classes={GREEN_SPINNER}
					ring={RING}
				/>
			</React.Fragment>
		);
	} else if (isRegistering === true) {
		return (
			<React.Fragment>
				<Checker
					cta="Registering Identity"
					classes={GREEN_SPINNER}
					ring={RING}
				/>
			</React.Fragment>
		);
	} else if (userSigner === null) {
		return (
			<React.Fragment>
				<div className="flex flex-row">
					<input
						value={username}
						placeholder="username"
						type="text"
						onChange={(e) => {
							setUsername(e.target.value);
						}}
					/>

					<input
						value={inviteCode}
						placeholder="invite code"
						type="text"
						onChange={(e) => {
							setInviteCode(e.target.value);
						}}
					/>

					<button
						disabled={username === "" || inviteCode === ""}
						onClick={async () => {
							setIsRegistering(true);
							await connectUser({ registerCall: true });
							setIsRegistering(false);
						}}
					>
						Register
					</button>
				</div>
			</React.Fragment>
		);
	} else {
		return <StaticBar address={userSigner?.address} username={username} />;
	}
};
