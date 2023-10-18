"use client";

import { useParams } from "next/navigation";
import { useStore } from "@/store";
import React, { useState, useEffect, useRef } from "react";
// import PushVideoConnector from "../PushVideoConnector";
import { ArrowUpCircle } from "@/icons";
import clsx from "clsx";
import { ChatBubble } from "@/components/Chat";
import { Spinner, Checker } from "@/components/Loaders";
import { FormatTimestamp } from "@/components/Helpers";

const GetPushChats = ({ chats, connection, user, fetchingChat }) => {
	const containerRef = useRef();

	const scrollToBottom = () => {
		containerRef.current.scrollTop = containerRef.current.scrollHeight;
	};

	useEffect(() => {
		scrollToBottom();
	}, [chats]);

	return (
		<div
			ref={containerRef}
			className="w-full flex-1 overflow-y-scroll p-1 space-y-1 bg-isSystemLightSecondary overflow-x-hidden mt-2"
		>
			{chats?.toReversed().map((chat, idx) => {
				const timestamp = FormatTimestamp(chat?.timestamp);
				const sender = chat?.fromDID.slice(7);
				const message = chat?.messageContent;
				const at = timestamp.timeString;

				return (
					<div
						key={chat?.cid}
						className="w-full text-[0.8rem] text-isSystemDarkPrimary font-500 align-bottom"
					>
						{idx === 0 ? (
							<div className="w-full flex flex-col items-center py-1">
								<div className="text-center bg-isOrangeLight drop-shadow-sm rounded-md text-xs px-2 py-[0.05rem] text-isWhite font-600">
									{timestamp.dateString}
								</div>
							</div>
						) : timestamp["dateString"] ===
						  FormatTimestamp(chats[-1 * idx]?.timestamp)
								.dateString ? (
							<></>
						) : <div>{timestamp?.dateString}</div> ? (
							<></>
						) : (
							<></>
						)}

						<ChatBubble
							message={message}
							at={at}
							isConnection={sender === connection ? true : false}
						/>
					</div>
				);
			})}

			{fetchingChat === true ? (
				<div className="w-full flex flex-col items-end">
					<Spinner
						classes="w-4 h-4 fill-isGreenLight"
						ring="fill-isWhite"
					/>
				</div>
			) : (
				<></>
			)}
		</div>
	);
};

const PushConnectPage = () => {
	const textareaRef = useRef();

	const {
		userSigner,
		currUser,
		trigger,
		setTrigger,
		latestFeedItem,
		chatNetwork,
		setChatNetwork,
		latestNotification,
	} = useStore();
	const params = useParams();

	const [incomingMessage, setIncomingMessage] = useState(false);
	const [chats, setChats] = useState([]);
	const [message, setMessage] = useState("");
	const [sendingMessage, setSendingMessage] = useState(false);
	const [fetchingChats, setFetchingChats] = useState(true);
	const [fetchingChat, setFetchingChat] = useState(true);

	const fetchChats = async ({ reference = null }) => {
		try {
			setFetchingChat(true);
			const newChats = await currUser?.chat?.history(params.user, {
				reference,
			});

			// Filter out chats that are already in the state
			const uniqueChats = newChats.filter((newChat) => {
				return !chats.some(
					(existingChat) => existingChat.cid === newChat.cid
				);
			});

			if (reference === null) {
				// Update the state by adding the unique chats
				setChats((prevChats) => [...uniqueChats, ...prevChats]);
			} else {
				// Update the state by adding the unique chats
				setChats((prevChats) => [...prevChats, ...uniqueChats]);
			}
			setFetchingChats(false);
			setFetchingChat(false);
		} catch (err) {
			console.log(err);
		}
	};

	const fetchIncomingChats = async ({ reference = null }) => {
		try {
			setIncomingMessage(true);
			const newChats = await currUser?.chat?.history(params.user, {
				reference,
			});

			// Filter out chats that are already in the state
			const uniqueChats = newChats.filter((newChat) => {
				return !chats.some(
					(existingChat) => existingChat.cid === newChat.cid
				);
			});

			if (reference === null) {
				// Update the state by adding the unique chats
				setChats((prevChats) => [...uniqueChats, ...prevChats]);
			} else {
				// Update the state by adding the unique chats
				setChats((prevChats) => [...prevChats, ...uniqueChats]);
			}
			setIncomingMessage(false);
		} catch (err) {
			console.log(err);
		}
	};

	const loadMore = async () => {
		try {
			// console.log("loading more chats");
			// console.log(chats[chats.length - 1]);
			await fetchChats({ reference: chats[chats.length - 1].cid });
		} catch (err) {
			console.log(err);
		}
	};

	const sendMessage = async () => {
		try {
			setSendingMessage(true);

			const sendMessagePromise = currUser.chat.send(params.user, {
				type: "Text",
				content: message,
			});

			const notifyApiPromise = fetch("/api/notify", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					recipient: params.user,
					notification: {
						title: `${
							userSigner.address
						} sent a message via PUSH at ${new Date().getTime()}`,
						body: message,
					},
					payload: {
						title: `${
							userSigner.address
						} sent a message via PUSH at ${new Date().getTime()}`,
						body: message,
						cta: `/connect/${userSigner.address}/push`,
						img: "",
					},
				}),
			});

			// Use Promise.all to await both promises concurrently
			await Promise.allSettled([sendMessagePromise, notifyApiPromise]);

			// await currUser.chat.send(params.user, {
			// 	type: "Text",
			// 	content: message,
			// });

			// await fetch("/api/notify", {
			// 	method: "POST",
			// 	headers: {
			// 		"Content-Type": "application/json",
			// 	},
			// 	body: JSON.stringify({
			// 		recipient: params.user,
			// 		notification: {
			// 			title: `${userSigner.address} sent a message via PUSH`,
			// 			body: `Check out your chats to see the message.`,
			// 		},
			// 		payload: {
			// 			title: `${userSigner.address} sent a message via PUSH`,
			// 			body: `Check out your chats to see the message.`,
			// 			cta: `/connect/${userSigner.address}/push`,
			// 			img: "",
			// 		},
			// 	}),
			// });

			setTrigger(!trigger);
			setSendingMessage(false);
			setMessage("");
			textareaRef.current.style.height = "auto";
		} catch (err) {
			console.log(err);
		}
	};

	useEffect(() => {
		fetchChats({ reference: null });
	}, [currUser, trigger, latestFeedItem]);

	const fetchIncomingMessages = async () => {
		try {
			const title = latestNotification.payload.data.asub;
			const containsBoth = new RegExp(`${params.user}.*PUSH`).test(title);

			if (containsBoth) {
				setIncomingMessage(true);
				fetchIncomingChats({ reference: null });
				setIncomingMessage(false);
			}
		} catch (err) {
			console.log(err);
		}
	};

	useEffect(() => {
		fetchIncomingMessages();
	}, [latestNotification]);

	if (userSigner === null) {
		return <div></div>;
	} else {
		return (
			<React.Fragment>
				{/* <button
					className="flex flex-col"
					onClick={() => {
						loadMore();
					}}
				>
					Load more
				</button> */}

				{/* <PushVideoConnector recipientAddress={params?.user} /> */}

				{fetchingChats === true ? (
					<Checker
						container={clsx("grow")}
						cta="Fetching Chats"
						classes="w-6 h-6 fill-isOrangeLight"
						ring="fill-isWhite"
					/>
				) : (
					<GetPushChats
						chats={chats}
						connection={params.user}
						user={userSigner.address}
						fetchingChat={fetchingChat}
					/>
				)}

				<div className="shrink-0 flex flex-row w-full bottom-0 bg-isSystemLightSecondary py-1 px-2 text-md justify-between space-x-2 font-500 items-end text-isSystemDarkSecondary">
					{/* <button>Camera</button> */}
					<textarea
						disabled={sendingMessage === true}
						id="message"
						rows="1"
						className="disabled:bg-isWhite appearance-none grow rounded-lg focus:outline-none py-1 px-2 drop-shadow-sm caret-isBlueLight caret-2 h-auto m-0 max-h-96 resize-none selection:bg-isBlueLight selection:text-isWhite"
						value={message}
						placeholder="Text Message"
						type="text"
						onChange={(e) => {
							e.preventDefault();
							setMessage(e.target.value);
							e.target.style.height = "auto";
							e.target.style.height =
								e.target.scrollHeight + "px";
						}}
					/>

					{sendingMessage === true ? (
						<Spinner
							classes={clsx("w-5 h-5 fill-isGreenLight")}
							ring="fill-isWhite"
						/>
					) : (
						<button
							disabled={message === ""}
							onClick={() => {
								sendMessage();
							}}
						>
							<ArrowUpCircle
								classes={clsx(
									"stroke-isWhite drop-shadow-sm",
									message === ""
										? "fill-isBlueLight"
										: "fill-isGreenLight"
								)}
							/>
						</button>
					)}

					{incomingMessage === true ? (
						<div className="w-full flex flex-col items-start">
							<Spinner
								classes="w-4 h-4 fill-isBlueLight"
								ring="fill-isWhite"
							/>
						</div>
					) : (
						<></>
					)}
				</div>
			</React.Fragment>
		);
	}
};

export default PushConnectPage;
