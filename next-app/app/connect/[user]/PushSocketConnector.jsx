"use client";

import { useStore } from "@/store";
import { useEffect } from "react";
import { EVENTS } from "@pushprotocol/socket";
import { env } from "./Constants";
import { createSocketConnection } from "@pushprotocol/socket";

export const PushSocketConnector = ({ wallet_address }) => {
	const {
		pushSocket,
		setPushSocket,
		isPushSocketConnected,
		setIsPushSocketConnected,
		latestFeedItem,
		setLatestFeedItem,
	} = useStore();

	const addSocketEvents = () => {
		pushSocket?.on(EVENTS.CONNECT, () => {
			setIsPushSocketConnected(true);
		});

		pushSocket?.on(EVENTS.DISCONNECT, () => {
			setIsPushSocketConnected(false);
		});

		pushSocket?.on(EVENTS.USER_FEEDS, (feed) => {
			console.log("feed received");
			console.log(feed);
		});
	};

	useEffect(() => {
		if (pushSocket) {
			addSocketEvents();

			if (!pushSocket?.connected) {
				pushSocket.connect();
			}
		}
	}, [pushSocket]);

	useEffect(() => {
		const connectionObject = createSocketConnection({
			user: wallet_address,
			env,
			socketOptions: { autoConnect: true, reconnectionAttempts: 3 },
		});

		setPushSocket(connectionObject);
	}, []);

	return (
		<div>Connection Status : {JSON.stringify(isPushSocketConnected)}</div>
	);
};
