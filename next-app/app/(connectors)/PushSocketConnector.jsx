"use client";

import { useStore } from "@/store";
import { useEffect } from "react";
import { EVENTS } from "@pushprotocol/socket";
import { env } from "./Constants";
import { createSocketConnection } from "@pushprotocol/socket";

export const PushSocketConnector = () => {
	const {
		pushSocket,
		setPushSocket,
		isPushSocketConnected,
		setIsPushSocketConnected,
		latestFeedItem,
		setLatestFeedItem,
		userSigner,
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
			setLatestFeedItem(feed);
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
		if (userSigner !== null) {
			const connectionObject = createSocketConnection({
				user: userSigner.address,
				env,
				socketOptions: { autoConnect: true, reconnectionAttempts: 3 },
			});

			setPushSocket(connectionObject);
		}
	}, [userSigner]);
};
