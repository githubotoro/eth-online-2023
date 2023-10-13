"use client";

import { db } from "@/firebase/config";
import {
	collection,
	getFirestore,
	doc,
	getDoc,
	getDocs,
} from "firebase/firestore";
import React from "react";

export const Test = () => {
	const makeCall = async () => {
		try {
			const res = await fetch("/api/users");
			const data = await res.json();
			console.log(data);

			// const docRef = doc(
			// 	db,
			// 	"users",
			// 	`0x95222290DD7278Aa3Ddd389Cc1E1d165CC4BAfe5`
			// );

			// const docRef = doc(db, "users");
			// const user = await getDoc(docRef);

			// const querySnapshot = await getDocs(collection(db, "users"));

			// querySnapshot.forEach((doc) => {
			// 	console.log(doc.id, " => ", doc.data());
			// });
		} catch (err) {
			console.log(err);
		}
	};

	const addUser = async () => {
		try {
			const res = await fetch("/api/users", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					id: "0xaC7cD662FD84C8D14a18c65ADE38326fF95521e7",
					username: "alex",
				}),
			});
			const data = await res.json();
			console.log(data);

			// const docRef = doc(
			// 	db,
			// 	"users",
			// 	`0x95222290DD7278Aa3Ddd389Cc1E1d165CC4BAfe5`
			// );

			// const docRef = doc(db, "users");
			// const user = await getDoc(docRef);

			// const querySnapshot = await getDocs(collection(db, "users"));

			// querySnapshot.forEach((doc) => {
			// 	console.log(doc.id, " => ", doc.data());
			// });
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<React.Fragment>
			<button
				onClick={() => {
					makeCall();
				}}
			>
				Make Call
			</button>

			<hr />

			<button onClick={addUser}>Add User</button>
		</React.Fragment>
	);
};
