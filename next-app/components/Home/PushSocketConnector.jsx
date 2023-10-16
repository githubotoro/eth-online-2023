"use client";

import { useStore } from "@/store";
import { useEffect } from "react";
import { EVENTS } from "@pushprotocol/socket";
import { env } from "@/components/Constants";
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
		pushNotificationSocket,
		setPushNotificationSocket,
		notificationFeed,
		setNotificationFeed,
		xmtpMessageIncoming,
		setXmtpMessageIncoming,
		latestNotification,
		setLatestNotification,
	} = useStore();

	const addSocketEvents = () => {
		pushSocket?.on(EVENTS.CONNECT, () => {
			// setIsPushSocketConnected(true);
		});

		pushSocket?.on(EVENTS.DISCONNECT, () => {
			// setIsPushSocketConnected(false);
		});

		pushSocket?.on(EVENTS.USER_FEEDS, (feed) => {
			console.log("feed received");
			console.log(feed);
			setLatestFeedItem(feed);
		});
	};

	const addNotificationSocketEvents = () => {
		pushNotificationSocket?.on(EVENTS.CONNECT, () => {
			// setIsPushSocketConnected(true);
		});

		pushNotificationSocket?.on(EVENTS.DISCONNECT, () => {
			// setIsPushSocketConnected(false);
		});

		pushNotificationSocket?.on(EVENTS.USER_FEEDS, (feed) => {
			console.log("notification received");
			console.log(feed);
			setLatestNotification(feed);
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
		if (pushNotificationSocket) {
			addNotificationSocketEvents();

			if (!pushNotificationSocket?.connected) {
				pushNotificationSocket.connect();
			}
		}
	}, [pushNotificationSocket]);

	useEffect(() => {
		if (userSigner !== null) {
			const connectionObject = createSocketConnection({
				user: `eip155:${userSigner.address}`,
				socketType: "chat",
				env,
				socketOptions: { autoConnect: true, reconnectionAttempts: 3 },
			});

			const notificationConnectionObject = createSocketConnection({
				user: `eip155:5:${userSigner.address}`, // CAIP-10 format
				env: "staging",
				socketOptions: { autoConnect: true, reconnectionAttempts: 3 },
			});

			setPushNotificationSocket(notificationConnectionObject);
			setPushSocket(connectionObject);
		}
	}, [userSigner]);
};
