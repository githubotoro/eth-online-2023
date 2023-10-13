"use client";

import { useStore } from "@/store";

export const UserChats = async ({ contactAddress }) => {
	try {
		const { currUser } = useStore();
		if (!currUser) return;

		const chats = await currUser.chat.latest(contactAddress);
		console.log(chats);

		return <div>Chats</div>;
	} catch (err) {
		console.log(err);
		return <div></div>;
	}

	// const chats = await currUser.chat.latest(contactAddress);

	// console.log(chats);
};
