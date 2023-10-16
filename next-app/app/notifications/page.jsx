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
			<div className="mt-4 pb-1 px-2 shrink-0 text-xl text-center font-700 text-isSystemDarkPrimary">
				Recent Notifications
			</div>
			<NotificationList />
		</React.Fragment>
	);
};

export default NotificationsPage;
