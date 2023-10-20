"use client";

import { useParams } from "next/navigation";
import { useStore } from "@/store";
import { redirect } from "next/navigation";
import { Checker } from "@/components/Loaders";
import React, { useEffect, useState } from "react";
import { FormatTimestamp } from "@/components/Helpers";
import Link from "next/link";
import clsx from "clsx";
import { ANIMATE } from "@/components/Constants";

const ConnectPage = () => {
	const { chatNetwork, latestNotification, currUser, trigger, setTrigger } =
		useStore();

	const [pushChats, setPushChats] = useState([]);
	const [pushRequests, setPushRequests] = useState([]);

	const acceptRequest = async ({ contactAddress }) => {
		try {
			await currUser.chat.accept(contactAddress);
			setTrigger(!trigger);
		} catch (err) {
			console.log(err);
		}
	};

	const rejectRequest = async ({ contactAddress }) => {
		try {
			await currUser.chat.reject(contactAddress);
			setTrigger(!trigger);
		} catch (err) {
			console.log(err);
		}
	};

	const getChatsAndRequests = async () => {
		try {
			if (currUser === null) return;

			const newChats = await currUser.chat.list("CHATS");
			const newRequests = await currUser.chat.list("REQUESTS");

			setPushChats(newChats);
			setPushRequests(newRequests);
		} catch (err) {
			console.log(err);
		}
	};

	useEffect(() => {
		getChatsAndRequests();
	}, [currUser, latestNotification, trigger]);

	const GetChatBlock = ({
		timestamp,
		sender,
		message,
		id,
		flag,
		platform,
	}) => {
		return (
			<Link
				href={`/connect/${sender}/${platform}`}
				key={id}
				className={clsx("w-full flex flex-col p-2", ANIMATE)}
			>
				<div className="w-full text-center font-600 text-isLabelLightSecondary truncate text-ellipsis pb-1">
					{timestamp.dateString}, {timestamp.timeString}
				</div>
				<div className="w-full rounded-xl p-2 bg-isWhite hover:bg-isSystemLightTertiary">
					<div className="flex flex-row items-center space-x-3  drop-shadow-sm  ">
						<div className="w-8 h-8 rounded-full bg-gradient-to-br from-isSystemLightTertiary to-isSystemDarkTertiary shadow-sm shrink-0" />
						<div className="grid grid-rows-2 gap-[0.1rem] flex-1">
							<div className="truncate text-ellipsis font-700 text-isSystemDarkSecondary">
								{sender}
							</div>
							<div className="text-isSystemDarkTertiary truncate text-ellipsis font-400">
								{message}
							</div>
						</div>
					</div>
				</div>

				{flag === "request" ? (
					<div className="flex flex-row space-x-1 mt-1 shrink-0 w-full place-content-center">
						<button
							onClick={() => {
								acceptRequest({ contactAddress: sender });
							}}
							className={clsx(
								"truncate text-ellipsis font-700 text-isWhite bg-isGreenLight px-[0.5rem] py-[0.05rem] flex flex-col items-center place-content-center rounded-sm shadow-sm hover:bg-isGreenLightEmphasis",
								ANIMATE
							)}
						>
							Accept
						</button>
						<button
							onClick={() => {
								rejectRequest({ contactAddress: sender });
							}}
							className={clsx(
								"truncate text-ellipsis font-700 text-isWhite bg-isRedLight px-[0.5rem] py-[0.05rem] flex flex-col items-center place-content-center rounded-sm shadow-sm hover:bg-isRedLightEmphasis",
								ANIMATE
							)}
						>
							Reject
						</button>
					</div>
				) : (
					<></>
				)}

				<hr className="bg-isSeparatorDark my-2" />
			</Link>
		);
	};

	return (
		<React.Fragment>
			<hr className="bg-isSeparatorLight m-2" />
			<div className="w-full shrink-0 rounded-lg p-2">
				<div></div>
			</div>
			<div className="grow bg-isSystemLightSecondary overflow-y-auto ">
				{pushRequests.map((chat, idx) => {
					const message = chat?.msg?.messageObj?.content;
					const rawTimestamp = chat?.msg?.timestamp;
					const timestamp = FormatTimestamp(rawTimestamp);
					const sender = chat?.msg?.fromDID?.slice(7);

					return (
						<GetChatBlock
							id={chat?.chatId}
							message={message}
							timestamp={timestamp}
							sender={sender}
							flag="request"
							platform="push"
						/>
					);
				})}
				{pushChats.map((chat, idx) => {
					const message = chat?.msg?.messageObj?.content;
					const rawTimestamp = chat?.msg?.timestamp;
					const timestamp = FormatTimestamp(rawTimestamp);
					const sender = chat?.msg?.fromDID?.slice(7);

					return (
						<GetChatBlock
							id={chat?.chatId}
							message={message}
							timestamp={timestamp}
							sender={sender}
							flag="chat"
							platform="push"
						/>
					);
				})}
			</div>
		</React.Fragment>
	);
};

export default ConnectPage;
