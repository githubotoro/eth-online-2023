"use client";

import { useStore } from "@/store";
import React, { useState, useEffect } from "react";

export const Test3 = () => {
	// const [identities, setIdentities] = useState();

	const identities = [
		{
			address: "0xb877f7bb52d28f06e60f557c00a56225124b357f",
			identity: "noun124.eth",
			platform: "ENS",
			displayName: "noun124.eth",
			avatar: "https://cdn.simplehash.com/assets/658c92e364bcdda4dfa8a7b95abeb3b28ae2fdac11dc692330f3f58c2cffab6c.svg",
			email: null,
			description: null,
			location: null,
			header: null,
			links: {
				twitter: {
					link: "https://twitter.com/nounonetwofour",
					handle: "nounonetwofour",
				},
			},
		},
		{
			address: "0xd7029bdea1c17493893aafe29aad69ef892b8ff2",
			identity: "dwr.eth",
			platform: "ENS",
			displayName: "dwr.eth",
			avatar: "https://ens.xyz/dwr.eth",
			email: null,
			description: null,
			location: null,
			header: null,
			links: {
				website: {
					link: "https://danromero.org",
					handle: "danromero.org",
				},
				github: {
					link: "https://github.com/danromero",
					handle: "danromero",
				},
				twitter: {
					link: "https://twitter.com/dwr",
					handle: "dwr",
				},
			},
		},
		{
			address: "0xd7029bdea1c17493893aafe29aad69ef892b8ff2",
			identity: "danromero.lens",
			platform: "lens",
			displayName: "Dan Romero",
			avatar: "https://ik.imagekit.io/lens/media-snapshot/1e210545640fa7b67b6502d7774727f67121adfa2e55020f6601e3ca835b4cd0.png",
			email: null,
			description: "Interested in technology.",
			location: null,
			header: null,
			links: {
				lenster: {
					link: "https://lenster.xyz/u/danromero",
					handle: "danromero",
				},
			},
		},
		{
			address: "0x8fc5d6afe572fefc4ec153587b63ce543f6fa2ea",
			identity: "dwr.eth",
			platform: "farcaster",
			displayName: "Dan Romero",
			avatar: "https://res.cloudinary.com/merkle-manufactory/image/fetch/c_fill,f_png,w_256/https://lh3.googleusercontent.com/MyUBL0xHzMeBu7DXQAqv0bM9y6s4i4qjnhcXz5fxZKS3gwWgtamxxmxzCJX7m2cuYeGalyseCA2Y6OBKDMR06TWg2uwknnhdkDA1AA",
			email: null,
			description: "Working on Farcaster and Warpcast.",
			location: "Los Angeles, CA, USA",
			header: null,
			links: {
				farcaster: {
					link: "https://warpcast.com/dwr.eth",
					handle: "dwr.eth",
				},
			},
		},
	];

	const users = {
		"0xd8da6bf26964af9d7eed9e03e53415d37aa96045": {
			username: "vitalik",
		},
		"0x2e21f5d32841cf8c7da805185a041400bf15f21a": {
			username: "stani",
		},
		"0xd7029bdea1c17493893aafe29aad69ef892b8ff2": {
			username: "dwr",
		},
		"0x3e331406313e4b79a0bf8486428e65df19dd8d80": {
			username: "yupuday",
		},
	};

	// const fetchUsers = async () => {
	// 	try {
	// 		const res = await fetch("/api/users");
	// 		const data = await res.json();
	// 		console.log(data);
	// 	} catch (err) {
	// 		console.log(err);
	// 	}
	// };

	// const fetchIdentities = async () => {
	// 	try {
	// 		let newIdentities = {};

	// 		const fetchingIdentities = await Promise.allSettled(
	// 			Object.keys(users).map(async (address) => {
	// 				try {
	// 					const res = await fetch(
	// 						`https://api.web3.bio/profile/${address}`
	// 					);
	// 					const data = await res.json();

	// 					console.log(data);
	// 					return data;
	// 				} catch (err) {
	// 					console.log(err);
	// 				}
	// 			})
	// 		);

	// 		// console.log(newIdentities);

	// 		setIdentities(newIdentities);
	// 	} catch (err) {
	// 		console.log("error while fetching identities");
	// 		console.log(err);
	// 	}
	// };

	// useEffect(() => {
	// 	fetchIdentities();
	// }, []);

	// useEffect(() => {
	// 	// fetchUsers();
	// }, []);

	return (
		<React.Fragment>
			<div className="px-2 text-lg font-700 text-isSystemDarkTertiary">
				New on ETH-Line
			</div>
			{Object.keys(users).map((address, key) => {
				return (
					<div key={address}>
						{address} -- {users[address].username}
					</div>
				);
			})}
		</React.Fragment>
	);
};
