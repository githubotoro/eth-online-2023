"use client";

import { useParams } from "next/navigation";
import {
	useCanMessage,
	useSendMessage,
	useStartConversation,
	useStreamConversations,
	useStreamMessages,
	useConversations,
	useMessages,
} from "@xmtp/react-sdk";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { Spinner, Checker } from "@/components/Loaders";
import { FormatTimestamp } from "@/components/Helpers";
import { ChatBubble } from "@/components/Chat";
import { useStore } from "@/store";
import { ArrowUpCircle } from "@/icons";
import clsx from "clsx";
import { Client } from "@xmtp/xmtp-js";

const GetXmtpChat = ({
	currConversation,
	connection,
	xmtpTrigger,
	xmtpMessageIncoming,
	setXmtpMessageIncoming,
	latestNotification,
}) => {
	if (currConversation === null) {
		return (
			<React.Fragment>
				<div className="grow bg-isSystemLightSecondary"></div>
			</React.Fragment>
		);
	}

	const [messages, setMessages] = useState([]);
	const [fetchingChat, setFetchingChat] = useState(false);
	const [incomingMessage, setIncomingMessage] = useState(false);

	// console.log("messages are ", messages);

	const fetchMessages = async () => {
		try {
			setFetchingChat(true);
			const messagesInConversation = await currConversation.messages();
			setMessages(messagesInConversation);
			setFetchingChat(false);
		} catch (err) {
			console.log(err);
		}
	};

	const fetchIncomingMessages = async () => {
		try {
			const title = latestNotification.payload.data.asub;
			const containsBoth = new RegExp(`${connection}.*XMTP`).test(title);

			if (containsBoth) {
				setIncomingMessage(true);
				const messagesInConversation =
					await currConversation.messages();
				setMessages(messagesInConversation);
				setIncomingMessage(false);
			}
		} catch (err) {
			console.log(err);
		}
	};

	const containerRef = useRef();

	useEffect(() => {
		fetchMessages();
	}, [xmtpTrigger]);

	useEffect(() => {
		fetchIncomingMessages();
	}, [latestNotification]);

	const scrollToBottom = () => {
		containerRef.current.scrollTop = containerRef.current.scrollHeight;
	};

	useEffect(() => {
		scrollToBottom();
	}, [messages, fetchingChat]);

	return (
		<div
			ref={containerRef}
			className="grow w-full flex-1 overflow-y-scroll p-1 space-y-1 mt-2 bg-isSystemLightSecondary overflow-x-hidden"
		>
			{messages?.map((chat, idx) => {
				const timestamp = FormatTimestamp(chat?.sent);
				const sender = chat?.senderAddress;
				const message = chat?.content;
				const at = timestamp.timeString;

				return (
					<div
						key={chat?.uuid}
						className="w-full text-[0.8rem] text-isSystemDarkPrimary font-500 align-bottom"
					>
						{idx === 0 ? (
							<div className="w-full flex flex-col items-center py-1">
								<div className="text-center bg-isOrangeLight drop-shadow-sm rounded-md text-xs px-2 py-[0.05rem] text-isWhite font-600">
									{timestamp.dateString}
								</div>
							</div>
						) : timestamp["dateString"] ===
						  FormatTimestamp(messages[-1 * idx]?.timestamp)
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
	);
};

const XmtpConnectPage = () => {
	const textareaRef = useRef();
	const params = useParams();
	const { canMessage } = useCanMessage();

	const {
		currUser,
		trigger,
		setTrigger,
		userSigner,
		xmtpClient,
		xmtpTrigger,
		setXmtpTrigger,
		xmtpMessageIncoming,
		setXmtpMessageIncoming,
		latestNotification,
	} = useStore();

	const [exists, setExists] = useState("LOADING");
	const [message, setMessage] = useState("");
	const [sendingMessage, setSendingMessage] = useState(false);
	const [currConversation, setCurrConversation] = useState(null);

	const checkUserXmtp = async () => {
		try {
			const exists = await canMessage(params.user);
			setExists(exists);

			if (exists === true) {
				const newConversation =
					await xmtpClient.conversations.newConversation(params.user);
				setCurrConversation(newConversation);
			}
		} catch (err) {
			console.log(err);
			return false;
		}
	};

	const sendMessageToUser = async () => {
		try {
			setSendingMessage(true);

			// Make both API calls concurrently using async/await
			const sendMessagePromise = currConversation.send(message);

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
						} sent a message via XMTP at ${new Date().getTime()}`,
						body: `Check out your chats to see the message.`,
					},
					payload: {
						title: `${
							userSigner.address
						} sent a message via XMTP at ${new Date().getTime()}`,
						body: `Check out your chats to see the message.`,
						cta: `/connect/${userSigner.address}/xmtp`,
						img: "",
					},
				}),
			});

			// Use Promise.all to await both promises concurrently
			await Promise.allSettled([sendMessagePromise, notifyApiPromise]);

			// await currConversation.send(message);

			// await fetch("/api/notify", {
			// 	method: "POST",
			// 	headers: {
			// 		"Content-Type": "application/json",
			// 	},
			// 	body: JSON.stringify({
			// 		recipient: params.user,
			// 		notification: {
			// 			title: `${userSigner.address} sent a message via XMTP`,
			// 			body: `Check out your chats to see the message.`,
			// 		},
			// 		payload: {
			// 			title: `${userSigner.address} sent a message via XMTP`,
			// 			body: `Check out your chats to see the message.`,
			// 			cta: `/connect/${userSigner.address}/xmtp`,
			// 			img: "",
			// 		},
			// 	}),
			// });

			setXmtpTrigger(!xmtpTrigger);
			setSendingMessage(false);
			setMessage("");
			textareaRef.current.style.height = "auto";
		} catch (err) {
			console.log(err);
		}
	};

	useEffect(() => {
		if (params.user !== undefined && currUser !== null) {
			checkUserXmtp();
		}
	}, [currUser]);

	if (exists === "LOADING") {
		return (
			<Checker
				cta="Fetching Chats"
				classes="h-6 w-6 fill-isGreenLight"
				ring="fill-isSystemLightTertiary"
				container="grow"
			/>
		);
	} else if (exists === true) {
		return (
			<React.Fragment>
				<GetXmtpChat
					currConversation={currConversation}
					connection={params.user}
					xmtpTrigger={xmtpTrigger}
					latestNotification={latestNotification}
				/>

				<div className="shrink-0 flex flex-row w-full bottom-0 bg-isSystemLightSecondary py-1 px-2 text-md justify-between space-x-2 font-500 items-end text-isSystemDarkSecondary">
					{/* <button>Camera</button> */}
					<textarea
						ref={textareaRef}
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
								sendMessageToUser();
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
				</div>
				<div className="h-9 w-full p-1 shrink-0"></div>
			</React.Fragment>
		);
	} else {
		return <div>User doesn't have XMTP</div>;
	}
};

export default XmtpConnectPage;
