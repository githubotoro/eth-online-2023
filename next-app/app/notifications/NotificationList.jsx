"use client";

import * as PushAPI from "@pushprotocol/restapi";
import React, { useEffect } from "react";
import { useStore } from "@/store";

export const NotificationList = () => {
	const { userSigner, latestFeedItem, latestNotification } = useStore();

	const fetchNotifications = async () => {
		try {
			const notifications = await PushAPI.user.getFeeds({
				user: `eip155:5:${userSigner.address}`, // user address in CAIP
				env: "staging",
			});

			console.log(notifications);
		} catch (err) {
			console.log(err);
		}
	};

	useEffect(() => {
		fetchNotifications();
	}, [latestFeedItem, latestNotification]);

	return <React.Fragment></React.Fragment>;
};
