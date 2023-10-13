"use client";

import { FetchContacts } from "../(contacts)";
import React, { useState, useEffect } from "react";
import { useStore } from "@/store";

const GetContacts = ({ homeTab, chats, requests }) => {
	if (homeTab === "CHATS") {
		return (
			<div className="flex flex-col w-full">
				{chats.map((chat) => {
					return (
						<div className="w-full flex flex-row">
							<div>{chat?.msg?.messageContent}</div>
						</div>
					);
				})}
			</div>
		);
	} else {
		return (
			<div className="flex flex-col w-full">
				{requests.map((request) => {
					return (
						<div className="w-full flex flex-row">
							<div>{request?.msg?.messageContent}</div>
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
	} = useStore();

	useEffect(() => {
		const getChatsAndRequests = async () => {
			try {
				if (currUser === null) return;

				const newChats = await currUser.chat.list("CHATS");
				const newRequests = await currUser.chat.list("REQUESTS");

				console.log(newChats);
				console.log(newRequests);

				setChats(newChats);
				setRequests(newRequests);
			} catch (err) {
				console.log(err);
			}
		};

		getChatsAndRequests();
	}, [currUser]);

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
					Contacts
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
			<GetContacts chats={chats} requests={requests} homeTab={homeTab} />
		</div>
	);
};

export default DashboardPage;
