"use client";

import { useStore } from "@/store";
import { useState, useEffect } from "react";

export const MaskNetworkConnector = () => {
	const { web3Bio, setWeb3Bio, setFetchingBio, ogAddress } = useStore();

	const GetWeb3Bio = async () => {
		try {
			const res = await fetch(
				`https://api.web3.bio/profile/${ogAddress}`
			);
			const data = await res.json();
			if (!data.error) {
				setWeb3Bio(data);
			} else {
				setWeb3Bio([]);
			}
		} catch (err) {
			console.log(err);
		}
	};

	useEffect(() => {
		if (ogAddress !== undefined && ogAddress !== null) {
			GetWeb3Bio();
		}
	}, [ogAddress]);
};
