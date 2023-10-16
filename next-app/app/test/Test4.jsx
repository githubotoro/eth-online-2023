"use client";

import React from "react";

export const Test4 = () => {
	const sendNotification = async () => {
		try {
			const res = await fetch("/api/notify", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					recipient: "0xB038444E986c4d146053813231a0A0F95Db466E3",
				}),
			});

			const data = await res.json();
			console.log(data);
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<React.Fragment>
			<button
				onClick={() => {
					sendNotification();
				}}
			>
				Send Test Notification
			</button>
			{/* <div>Push Notification Testing</div> */}
		</React.Fragment>
	);
};
