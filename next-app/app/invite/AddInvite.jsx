"use client";

import React from "react";
import { useState } from "react";

export const AddInvite = () => {
	const [inviteCode, setInviteCode] = useState("");
	const [inviteSecret, setInviteSecret] = useState("");

	return (
		<React.Fragment>
			<div className="flex flex-row">
				<input
					value={inviteCode}
					placeholder="inviteCode"
					type="text"
					onChange={(e) => {
						setInviteCode(e.target.value);
					}}
				></input>

				<input
					value={inviteSecret}
					placeholder="inviteSecret"
					type="text"
					onChange={(e) => {
						setInviteSecret(e.target.value);
					}}
				></input>
				<button
					disabled={inviteCode === "" || inviteSecret === ""}
					onClick={async () => {
						const res = await fetch("/api/invites", {
							method: "POST",
							headers: {
								"Content-Type": "application/json",
							},
							body: JSON.stringify({
								inviteCode,
								inviteSecret,
							}),
						});

						const data = await res.json();

						console.log(data);
					}}
				>
					Invite
				</button>
			</div>
		</React.Fragment>
	);
};
