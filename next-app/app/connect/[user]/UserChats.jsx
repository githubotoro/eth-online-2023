"use client";

import { useStore } from "@/store";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export const UserChats = ({ contactAddress }) => {
	const { currUser } = useStore();
	if (!currUser) return;

	const [chats, setChats] = useState([]);
	const [message, setMessage] = useState("");

	const fetchChats = async () => {
		try {
			const newChats = await currUser.chat.latest(contactAddress);
			setChats(newChats);
		} catch (err) {
			console.log(err);
		}
	};

	useEffect(() => {
		fetchChats();
	}, []);

	return (
		<React.Fragment>
			<div>Chats</div>
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
				<button>Send</button>
			</div>
		</React.Fragment>
	);

	// const chats = await currUser.chat.latest(contactAddress);

	// console.log(chats);
};
