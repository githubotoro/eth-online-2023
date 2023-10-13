"use client";

import { useParams } from "next/navigation";
import { useStore } from "@/store";
import { useState, useEffect } from "react";

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

const GetChats = ({ chats }) => {
	return (
		<div className="w-full flex flex-col">
			{chats?.toReversed().map((chat, idx) => {
				const timestamp = formatTimestamp(chat?.timestamp);

				return (
					<div key={chat?.cid} className="w-full flex flex-col">
						{idx === 0 ? (
							<div>{timestamp.dateString}</div>
						) : timestamp["dateString"] ===
						  formatTimestamp(chats[-1 * idx]?.timestamp)
								.dateString ? (
							<></>
						) : <div>{timestamp?.dateString}</div> ? (
							<></>
						) : (
							<></>
						)}
						<div className="flex flex-row w-full">
							From -- {chat?.fromDID.slice(7)}
						</div>
						<div className="w-full flex flex-row">
							Message -- {chat?.messageContent}
						</div>
						<div className="flex flex-row w-full">
							At -- {timestamp.timeString}
						</div>

						<hr />
					</div>
				);
			})}
		</div>
	);
};

const ConnectPage = () => {
	const { userSigner, currUser, trigger, setTrigger, latestFeedItem } =
		useStore();
	const params = useParams();

	const [chats, setChats] = useState([]);
	const [message, setMessage] = useState("");

	console.log(chats);

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
			console.log("loading more chats");
			console.log(chats[chats.length - 1]);
			await fetchChats({ reference: chats[chats.length - 1].cid });
		} catch (err) {
			console.log(err);
		}
	};

	const sendMessage = async () => {
		try {
			await currUser.chat.send(params.user, {
				type: "Text",
				content: message,
			});
			setMessage("");
			setTrigger(!trigger);
		} catch (err) {
			console.log(err);
		}
	};

	useEffect(() => {
		fetchChats({ reference: null });
	}, [currUser, trigger, latestFeedItem]);

	if (userSigner === null) {
		return <div>Please register first</div>;
	} else {
		return (
			<div className="flex flex-col">
				<div>Connect Page</div>

				<hr />

				<div>Chats</div>

				<button
					onClick={() => {
						loadMore();
					}}
				>
					Load more
				</button>

				<hr />

				<GetChats chats={chats} />

				<hr />
				<div className="flex flex-row w-full">
					<input
						value={message}
						placeholder="Text Message"
						type="text"
						onChange={(e) => {
							e.preventDefault();
							setMessage(e.target.value);
						}}
					/>
					<button
						onClick={() => {
							sendMessage();
						}}
					>
						Send
					</button>
				</div>
			</div>
		);
	}
};

export default ConnectPage;
