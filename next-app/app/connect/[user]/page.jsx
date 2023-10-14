"use client";

import { useParams } from "next/navigation";
import { useStore } from "@/store";
import { useState, useEffect, useRef } from "react";
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

const GetChats = ({ chats, connection, user }) => {
	const containerRef = useRef();

	const scrollToBottom = () => {
		containerRef.current.scrollTop = containerRef.current.scrollHeight;
	};

	// useEffect(() => {
	// 	// Scroll to the bottom when the component mounts or when new content is added
	// 	scrollToBottom();
	// }, [chats]);

	return (
		<div
			ref={containerRef}
			className=" w-full flex flex-col h-fit overflow-y-scroll p-1 justify-end space-y-1 bg-isSystemLightSecondary overflow-x-hidden overflow-auto"
		>
			{chats?.toReversed().map((chat, idx) => {
				const timestamp = formatTimestamp(chat?.timestamp);
				const sender = chat?.fromDID.slice(7);
				const message = chat?.messageContent;
				const at = timestamp.timeString;

				return (
					<div
						key={chat?.cid}
						className="w-full flex flex-col text-[0.8rem] text-isSystemDarkPrimary font-500 align-bottom"
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

	const fetchChats = async ({ reference = null }) => {
		try {
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
			<div className="flex flex-col w-full h-full justify-end bg-isOrangeDark relative">
				<button
					className="flex flex-col"
					onClick={() => {
						loadMore();
					}}
				>
					Load more
				</button>

				{/* <PushVideoConnector recipientAddress={params?.user} /> */}

				<GetChats
					chats={chats}
					connection={params.user}
					user={userSigner.address}
				/>

				<div className="align-bottom w-full h-9 bg-isRedDark shrink-0"></div>

				<div className="absolute flex flex-row w-full bottom-0 bg-isGrayLightEmphasis5 py-1 px-2 text-md justify-between space-x-2 font-500 items-end text-isSystemDarkSecondary">
					<button>Camera</button>
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
			</div>
		);
	}
};

export default ConnectPage;
