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

const GetXmtpChat = ({ currConversation, connection }) => {
	if (currConversation === null) {
		return (
			<React.Fragment>
				<div className="grow bg-isSystemLightSecondary"></div>
			</React.Fragment>
		);
	}

	const containerRef = useRef();
	const { messages } = useMessages(currConversation);

	console.log("messages are ", messages);

	const scrollToBottom = () => {
		containerRef.current.scrollTop = containerRef.current.scrollHeight;
	};

	// console.log(streamedMessages);

	// useEffect(() => {
	// 	setStreamedMessages([]);
	// }, [currConversation]);

	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	return (
		<div
			ref={containerRef}
			className="grow w-full flex-1 overflow-y-scroll p-1 space-y-1 bg-isSystemLightSecondary overflow-x-hidden"
		>
			{messages?.map((chat, idx) => {
				const timestamp = FormatTimestamp(chat?.sentAt);
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
			{/* 
			{fetchingChat === true ? (
				<div className="w-full flex flex-col items-end">
					<Spinner
						classes="w-4 h-4 fill-isGreenLight"
						ring="fill-isWhite"
					/>
				</div>
			) : (
				<></>
			)} */}
		</div>
	);
};

const XmtpConnectPage = () => {
	const textareaRef = useRef();
	const params = useParams();
	const { canMessage } = useCanMessage();
	const { sendMessage } = useSendMessage();
	const { currUser, trigger, setTrigger, userSigner, xmtpClient } =
		useStore();

	const [exists, setExists] = useState("LOADING");
	const [message, setMessage] = useState("");
	const [sendingMessage, setSendingMessage] = useState(false);
	const [currConversation, setCurrConversation] = useState(null);

	const { conversations } = useConversations();

	console.log("conversations are ", conversations);

	const { startConversation } = useStartConversation();

	const startNewConversation = async () => {
		try {
			const conversation = await startConversation(params.user, message);
			setCurrConversation(conversation);
		} catch (err) {
			console.log(err);
		}
	};

	const checkUserXmtp = async () => {
		try {
			const exists = await canMessage(params.user);
			console.log(exists);
			setExists(exists);
		} catch (err) {
			console.log(err);
			return false;
		}
	};

	const sendMessageToConversation = async () => {
		try {
			await sendMessage(currConversation, message);
		} catch (err) {
			console.log(err);
		}
	};

	const sendMessageToUser = async () => {
		try {
			setSendingMessage(true);
			if (currConversation === null) {
				await startNewConversation();
			} else {
				await sendMessageToConversation();
			}
			setTrigger(!trigger);
			setSendingMessage(false);
			setMessage("");
			textareaRef.current.style.height = "auto";
		} catch (err) {
			console.log(err);
		}
	};

	const fetchConversation = async () => {
		try {
			for (let i = 0; i < conversations.length; i++) {
				if (conversations[i].peerAddress === params.user) {
					setCurrConversation(conversations[i]);
				}
			}
		} catch (err) {
			console.log(err);
		}
	};

	const ListMessages = async () => {
		try {
			const xmtp = await Client.create(userSigner, { env: "production" });

			for (const conversation of await xmtp.conversations.list()) {
				console.log("conversation is ", conversation);
				// All parameters are optional and can be omitted
				const opts = {
					// Only show messages from last 24 hours
					startTime: new Date(
						new Date().setDate(new Date().getDate() - 1)
					),
					endTime: new Date(),
				};
				const messagesInConversation = await conversation.messages(
					opts
				);
				console.log(
					"messages in conversation are ",
					messagesInConversation
				);
			}

			// const xmtp = await Client.create(userSigner, { env: "production" });

			// const conversation = await xmtp.conversations.newConversation(
			// 	params.user
			// );
			// const res = await conversation.send("Hello world");

			// console.log(res);
		} catch (err) {
			console.log("List messages error ", err);
		}
	};

	useEffect(() => {
		if (currUser !== null) {
			fetchConversation();
		}
	}, [currUser]);

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
				ring="fill-isSystemLightSecondary"
				container="grow"
			/>
		);
	} else if (exists === true) {
		return (
			<React.Fragment>
				<button
					onClick={() => {
						ListMessages();
					}}
				>
					List messages
				</button>
				<GetXmtpChat
					currConversation={currConversation}
					connection={params.user}
				/>

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
