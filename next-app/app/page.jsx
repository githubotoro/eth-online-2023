"use client";

import { FetchContacts } from "./(contacts)";
import React, { useState, useEffect } from "react";
import { useStore } from "@/store";

const Home = () => {
	const {
		currUser,
		chats,
		requests,
		setChats,
		setRequests,
		homeTab,
		setHomeTab,
	} = useStore();

	// useEffect(() => {
	// 	const getChatsAndRequests = async () => {
	// 		try {
	// 			const newChats = await currUser.chat.list("CHATS");
	// 			const newRequests = await currUser.chat.list("REQUESTS");

	// 			setChats(newChats);
	// 			setRequests(newRequests);
	// 		} catch (err) {
	// 			console.log(err);
	// 		}
	// 	};

	// 	getChatsAndRequests();
	// }, []);

	return (
		<main className="flex flex-col w-full">
			{/* <FetchContacts
				currUser={currUser}
				chats={chats}
				requests={requests}
				homeTab={homeTab}
				setHomeTab={setHomeTab}
			/> */}
		</main>
	);
};

export default Home;
