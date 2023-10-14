"use client";

import { FetchContacts } from "./(contacts)";
import React, { useState, useEffect } from "react";
import { useStore } from "@/store";
import { ConnectButton } from "@rainbow-me/rainbowkit";

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
		<div className="">
			<ConnectButton />

			{/* <div className="flex flex-col w-full max-w-xl bg-isWhite h-full rounded-2xl drop-shadow-sm overflow-hidden relative">
				<div className="flex w-full flex-row justify-between px-2 pt-1 relative">
					<div>{timestamp?.timeString}</div>

					<div>{timestamp?.dateString}</div>
				</div>

				<div className="absolute top-0 w-full flex flex-row items-center">
					<div className="bg-isWhite flex-grow text-isWhite rounded-md -z-10 text-center">
						h
					</div>
					<div className="z-10 bg-isSystemDarkTertiary text-isWhite w-full max-w-[9rem] text-center rounded-b-lg font-600 drop-shadow-sm">
						ETH-Line
					</div>
					<div className="bg-isWhite flex-grow text-isWhite rounded-md -z-10 text-center">
						h
					</div>
				</div>
				<div className="absolute top-0 w-full h-2 bg-isSystemDarkTertiary -z-20"></div>
			</div> */}
			{/* <FetchContacts
				currUser={currUser}
				chats={chats}
				requests={requests}
				homeTab={homeTab}
				setHomeTab={setHomeTab}
			/> */}
		</div>
	);
};

export default Home;
