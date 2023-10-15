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
	} = useStore();

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
			const currUsername = window.localStorage.getItem("username");

			if (localStorageAddress) {
				// if local address exists, connect the user
				await instance.connect(localStorageAddress);
				setUsername(currUsername);

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

			// confirming identity
			setConfirmingIdentity(true);

			// creating instance provider
			const instanceProvider = new ComethProvider(instance);

			// signing message
			const signature = await instanceProvider
				.getSigner()
				.signMessage("authentication");

			// signing message
			const userSigner = new ethers.Wallet(signature.slice(0, 66));
			// console.log(userSigner.address);
			setUserSigner(userSigner);

			// fetching details for user via push protocol
			const currUser = await PushAPI.initialize(userSigner, { env });
			// console.log(currUser);

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
						id: userSigner.address,
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
	const RING = "fill-isGrayLightEmphasis6";

	if (isConnecting === true) {
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