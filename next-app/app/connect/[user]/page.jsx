"use client";

import { useParams } from "next/navigation";
import { useStore } from "@/store";
import { useState, useEffect } from "react";

const ConnectPage = () => {
	const { userSigner, currUser } = useStore();
	const params = useParams();

	const [chats, setChats] = useState([]);
	const [message, setMessage] = useState("");

	const fetchChats = async () => {
		try {
			const newChats = await currUser.chat.latest(params.user);
			setChats(newChats);
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
		} catch (err) {
			console.log(err);
		}
	};

	useEffect(() => {
		fetchChats();
	}, []);

	if (userSigner === null) {
		return <div>Please register first</div>;
	} else {
		return (
			<div className="flex flex-col">
				<div>Connect Page</div>

				<hr />

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
					<button onClick={sendMessage}>Send</button>
				</div>
			</div>
		);
	}
};

export default ConnectPage;
