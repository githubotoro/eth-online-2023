"use client";

import { useParams } from "next/navigation";
import { useStore } from "@/store";
import React, { useState, useEffect, useRef } from "react";
import PushVideoConnector from "./PushVideoConnector";
import { Send, ArrowUpCircle } from "@/icons";
import clsx from "clsx";
import { SendingSpinner, ChatBubble } from "./ui";

const formatTimestamp = (timestamp) => {
	// Create a Date object from the input string
	const localTimestamp = new Date(timestamp).toLocaleString();
	const date = new Date(localTimestamp);

	// Define arrays for month names and day names
	const monthNames = [
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"June",
		"July",
		"Aug",
		"Sept",
		"Oct",
		"Nov",
		"Dec",
	];
	const dayNames = [
		"Sunday",
		"Monday",
		"Tuesday",
		"Wednesday",
		"Thursday",
		"Friday",
		"Saturday",
	];

	// Get day, month, and day-of-week indexes
	const day = date.getDate();
	const month = date.getMonth();
	const dayOfWeek = date.getDay();

	// Get hours, minutes, and AM/PM
	const hours = date.getHours() % 12 || 12; // Convert to 12-hour format
	const minutes = String(date.getMinutes()).padStart(2, "0");
	const ampm = date.getHours() >= 12 ? "PM" : "AM";

	// Format the output string
	const dateString = `${dayNames[dayOfWeek]}, ${monthNames[month]} ${day}`;
	const timeString = `${hours}:${minutes} ${ampm}`;

	return {
		dateString,
		timeString,
	};
};

const GetChats = ({ chats, connection, user, fetchingChat }) => {
	const containerRef = useRef();

	const scrollToBottom = () => {
		containerRef.current.scrollTop = containerRef.current.scrollHeight;
	};

	// useEffect(() => {
	// 	scrollToBottom();
	// }, [chats]);

	return (
		<div
			ref={containerRef}
			className="w-full flex-1 overflow-y-scroll p-1 space-y-1 bg-isSystemLightSecondary overflow-x-hidden"
		>
			{chats?.toReversed().map((chat, idx) => {
				const timestamp = formatTimestamp(chat?.timestamp);
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
						  formatTimestamp(chats[-1 * idx]?.timestamp)
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
				<div className="w-full flex flex-col items-end ">
					<div role="status">
						<svg
							aria-hidden="true"
							class="inline w-4 h-4 animate-spin  fill-isGreenLight"
							viewBox="0 0 100 101"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
								fill="currentColor"
								className="fill-isWhite"
							/>
							<path
								d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
								fill="currentFill"
							/>
						</svg>
						<span class="sr-only">Loading...</span>
					</div>
				</div>
			) : (
				<></>
			)}
		</div>
	);
};

const ConnectPage = () => {
	const textareaRef = useRef();

	const { userSigner, currUser, trigger, setTrigger, latestFeedItem } =
		useStore();
	const params = useParams();

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
			await currUser.chat.send(params.user, {
				type: "Text",
				content: message,
			});
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
					<div className="grow flex flex-col items-center bg-isSystemLightSecondary place-content-center space-y-1">
						<div className="font-600 text-isSystemDarkTertiary text-lg">
							Fetching Chats
						</div>
						<div role="status">
							<svg
								aria-hidden="true"
								className="inline w-6 h-6 mr-2 animate-spin  fill-isOrangeLight"
								viewBox="0 0 100 101"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
									fill="currentColor"
									className="fill-isWhite"
								/>
								<path
									d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
									fill="currentFill"
								/>
							</svg>
							<span className="sr-only">Loading...</span>
						</div>
					</div>
				) : (
					<GetChats
						chats={chats}
						connection={params.user}
						user={userSigner.address}
						fetchingChat={fetchingChat}
					/>
				)}

				<div className="shrink-0 flex flex-row w-full bottom-0 bg-isGrayLightEmphasis5 py-1 px-2 text-md justify-between space-x-2 font-500 items-end text-isSystemDarkSecondary">
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
						<SendingSpinner />
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
				</div>
			</React.Fragment>
		);
	}
};

export default ConnectPage;
