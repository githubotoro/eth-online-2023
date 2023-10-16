"use client";

import { useStore } from "@/store";
import React, { useEffect } from "react";
import { NotificationList } from "./NotificationList";

const NotificationsPage = () => {
	const { userSigner, latestFeedItem, latestNotification } = useStore();

	if (userSigner === null) {
		return <React.Fragment></React.Fragment>;
	}

	return (
		<React.Fragment>
			<NotificationList />
		</React.Fragment>
	);
};

export default NotificationsPage;
