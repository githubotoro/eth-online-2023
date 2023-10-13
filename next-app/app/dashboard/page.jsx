"use client";

import { FetchContacts } from "../(contacts)";
import React, { useState, useEffect } from "react";
import { useStore } from "@/store";
import Link from "next/link";

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
	const minutes = date.getMinutes();
	const ampm = date.getHours() >= 12 ? "PM" : "AM";

	// Format the output string
	const dateString = `${dayNames[dayOfWeek]}, ${monthNames[month]} ${day}`;
	const timeString = `${hours}:${minutes} ${ampm}`;

	return {
		dateString,
		timeString,
	};
};

const acceptRequest = async ({
	currUser,
	contactAddress,
	trigger,
	setTrigger,
}) => {
	try {
		await currUser.chat.accept(contactAddress);
		setTrigger(!trigger);
	} catch (err) {
		console.log(err);
	}
};

const rejectRequest = async ({
	currUser,
	contactAddress,
	trigger,
	setTrigger,
}) => {
	try {
		await currUser.chat.accept(contactAddress);
		setTrigger(!trigger);
	} catch (err) {
		console.log(err);
	}
};

const GetContacts = ({
	homeTab,
	chats,
	requests,
	currUser,
	setTrigger,
	trigger,
}) => {
	if (homeTab === "CHATS") {
		return (
			<div className="flex flex-col w-full">
				{chats.map((chat, idx) => {
					const timestamp = formatTimestamp(chat?.msg?.timestamp);

					return (
						<Link
							href={`/connect/${chat?.msg?.fromDID.slice(7)}`}
							key={chat?.chatId}
							className="w-full flex flex-col"
						>
							{idx === 0 ? (
								<div>{timestamp.dateString}</div>
							) : (
								<div>{timestamp.dateString}</div>
							)}
							<div className="flex flex-row w-full">
								From -- {chat?.msg?.fromDID.slice(7)}
							</div>
							<div className="w-full flex flex-row">
								Message -- {chat?.msg?.messageContent}
							</div>
							<div className="flex flex-row w-full">
								At -- {timestamp.timeString}
							</div>
							{/* <div className="flex flex-row w-full">
								<button
									onClick={acceptRequest({
										currUser,
										contactAddress:
											chat?.msg?.fromDID.slice(7),
										setTrigger,
										trigger,
									})}
								>
									Accept
								</button>
								<button
									onClick={rejectRequest({
										currUser,
										contactAddress:
											chat?.msg?.fromDID.slice(7),
										setTrigger,
										trigger,
									})}
								>
									Reject
								</button>
							</div> */}
							<hr />
						</Link>
					);
				})}
			</div>
		);
	} else {
		return (
			<div className="flex flex-col w-full">
				{requests.map((chat, idx) => {
					const timestamp = formatTimestamp(chat?.msg?.timestamp);

					return (
						<div
							key={chat?.chatId}
							className="w-full flex flex-col"
						>
							{idx === 0 ? (
								<div>{timestamp.dateString}</div>
							) : (
								<div>{timestamp.dateString}</div>
							)}
							<div className="flex flex-row w-full">
								From -- {chat?.msg?.fromDID.slice(7)}
							</div>
							<div className="w-full flex flex-row">
								Message -- {chat?.msg?.messageContent}
							</div>
							<div className="flex flex-row w-full">
								At -- {timestamp.timeString}
							</div>
							<div className="flex flex-row w-full">
								<button
									onClick={() => {
										acceptRequest({
											currUser,
											contactAddress:
												chat?.msg?.fromDID.slice(7),
											setTrigger,
											trigger,
										});
									}}
								>
									Accept
								</button>
								<button
									onClick={() => {
										rejectRequest({
											currUser,
											contactAddress:
												chat?.msg?.fromDID.slice(7),
											setTrigger,
											trigger,
										});
									}}
								>
									Reject
								</button>
							</div>
							<hr />
						</div>
					);
				})}
			</div>
		);
	}
};

const DashboardPage = () => {
	const {
		currUser,
		chats,
		requests,
		setChats,
		setRequests,
		homeTab,
		setHomeTab,
		trigger,
		setTrigger,
	} = useStore();

	useEffect(() => {
		const getChatsAndRequests = async () => {
			try {
				if (currUser === null) return;

				const newChats = await currUser.chat.list("CHATS");
				const newRequests = await currUser.chat.list("REQUESTS");

				console.log("chats are ", newChats);
				console.log("requests are ", newRequests);

				setChats(newChats);
				setRequests(newRequests);
			} catch (err) {
				console.log(err);
			}
		};

		getChatsAndRequests();
	}, [currUser, trigger]);

	return (
		<div className="flex flex-col w-full">
			<div>Dashboard Page</div>
			<hr />
			<div className="w-full flex flex-row">
				<button
					onClick={() => {
						setHomeTab("CHATS");
					}}
				>
					Recent
				</button>
				|
				<button
					onClick={() => {
						setHomeTab("REQUESTS");
					}}
				>
					Requests
				</button>
			</div>
			<hr />
			<GetContacts
				chats={chats}
				requests={requests}
				homeTab={homeTab}
				currUser={currUser}
				trigger={trigger}
				setTrigger={setTrigger}
			/>
		</div>
	);
};

export default DashboardPage;
