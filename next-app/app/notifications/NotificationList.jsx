"use client";

import * as PushAPI from "@pushprotocol/restapi";
import React, { useEffect, useState } from "react";
import { useStore } from "@/store";
import { ANIMATE } from "@/components/Constants";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { Checker } from "@/components/Loaders";

export const NotificationList = () => {
	const { userSigner, latestFeedItem, latestNotification } = useStore();

	const [notifications, setNotifications] = useState([]);
	const [fetchingNotification, setFetchingNotifications] = useState(true);

	const FormatTimestamp = (timestamp) => {
		const now = new Date();
		const timestampDate = new Date(timestamp);
		const timeDifference = now - timestampDate;
		const seconds = Math.floor(timeDifference / 1000);
		const minutes = Math.floor(seconds / 60);
		const hours = Math.floor(minutes / 60);
		const days = Math.floor(hours / 24);

		if (seconds < 10) {
			return "now";
		} else if (seconds < 60) {
			return `${seconds} secs ago`;
		} else if (minutes < 60) {
			return `${minutes} mins ago`;
		} else if (hours < 24) {
			return `${hours} hours ago`;
		} else if (days < 7) {
			return `${days} days ago`;
		} else {
			return timestampDate.toDateString();
		}
	};

	const fetchNotifications = async () => {
		try {
			setFetchingNotifications(true);
			const newNotifications = await PushAPI.user.getFeeds({
				user: `eip155:5:${userSigner.address}`, // user address in CAIP
				env: "staging",
			});

			setNotifications(newNotifications);
			setFetchingNotifications(false);
		} catch (err) {
			console.log(err);
		}
	};

	useEffect(() => {
		fetchNotifications();
	}, [latestFeedItem, latestNotification]);

	const GetNetworkLogo = (network) => {
		if (network === "PUSH") {
			return (
				<div className="absolute w-4 h-4 -right-1 -bottom-1 rounded-md drop-shadow-sm overflow-hidden">
					<Image
						src="/assets/push-logo.jpeg "
						alt="Push Protocol's logo"
						fill
						className="object-cover"
					/>
				</div>
			);
		} else if (network === "XMTP") {
			<div className="absolute w-4 h-4 -right-1 -bottom-1 rounded-md drop-shadow-sm overflow-hidden">
				<Image
					src="/assets/xmtp-logo.png "
					alt="Push Protocol's logo"
					fill
					className="object-cover"
				/>
			</div>;
		} else {
			return <></>;
		}
	};

	if (fetchNotifications === true) {
		return (
			<Checker
				cta="Fetching Notifications"
				container="grow fill-isSystemLightSecondary"
				classes="fill-isBlueLight h-6 w-6"
				ring="fill-isWhite"
			/>
		);
	} else {
		return (
			<React.Fragment>
				<div className="w-full flex-1 overflow-y-auto p-2 space-y-2 bg-isSystemLightSecondary overflow-x-hidden pt-2">
					{notifications.map((notification, idx) => {
						const words = notification.title.split(" ");
						const sender = words[0];
						const network = words[words.length - 3];
						const timestamp = words[words.length - 1] + "000";
						const message = notification.message;

						const formattedTimestamp = FormatTimestamp(
							parseInt(timestamp)
						);

						let href = "#";

						if (notification.cta !== undefined) {
							href = notification.cta;
						}

						return (
							<Link
								href={href}
								key={notification.sid}
								className={clsx(
									"border border-isSeparatorLight/20 bg-isWhite w-full rounded-xl flex flex-row items-center space-x-3 py-1 px-3 drop-shadow-sm  hover:bg-isGrayLight5 cursor-pointer",
									ANIMATE
								)}
							>
								<div className="shrink-0 h-6 w-6 rounded-full bg-gradient-to-br from-isOrangeLight to-isRedLight drop-shadow-sm relative">
									{GetNetworkLogo(network)}
								</div>
								<div className="grid grid-rows-2 gap-[0.1rem] flex-1">
									<div className="truncate text-ellipsis font-700 text-isSystemDarkSecondary">
										{sender}
									</div>
									<div className="text-isSystemDarkTertiary truncate text-ellipsis font-400">
										{message}
									</div>
								</div>
								{formattedTimestamp !== "Invalid Date" ? (
									<div className="shrink-0 w-[3.5rem] ">
										<div className="text-[0.6rem] font-700   text-isLabelLightSecondary absolute top-0 right-0 text-right pt-[0.1rem] pr-[0.4rem]">
											{formattedTimestamp}
										</div>
									</div>
								) : (
									<></>
								)}
							</Link>
						);
					})}
				</div>
			</React.Fragment>
		);
	}
};
