"use client";

import React, { useEffect, useState } from "react";
import { ANIMATE } from "@/components/Constants";
import clsx from "clsx";
import { Spinner } from "@/components/Loaders";
import { CustomConnectWallet } from "./CustomConnectWallet";
import { useStore } from "@/store";
import { useAccount } from "wagmi";
import Image from "next/image";
import { LinkIcon } from "@/icons";
import { GetBio } from "@/components/MaskNetwork";

const SettingsPage = () => {
	const [clearingStorage, setClearingStorage] = useState(false);

	const { address } = useAccount();

	const { ogAddress, setOgAddress, web3Bio } = useStore();

	const changeOgAddress = () => {
		if (address !== undefined && address !== null) {
			if (ogAddress === null || ogAddress === undefined) {
				setOgAddress(address);
				localStorage.setItem("ogAddress", address);
			} else if (ogAddress !== address) {
				setOgAddress(address);
				localStorage.setItem("ogAddress", address);
			}
		}
	};

	const CTA_CLASSES = clsx(
		"font-700 text-center w-full text-isSystemDarkTertiary text-[1rem] p-3"
	);

	useEffect(() => {
		changeOgAddress();
	}, [address]);

	return (
		<React.Fragment>
			<hr className="bg-isSeparatorLight m-2" />
			<div className="w-full shrink-0 px-2 py-0">
				<div className="bg-isSystemLightSecondary px-3 py-3 rounded-xl space-y-2 drop-shadow-sm">
					<div className="text-[1rem] p-1 text-center text-isSystemDarkTertiary font-500 leading-tight">
						You can <b>link</b> your on-chain profiles like{" "}
						<b>ens, lens and farcaster</b> by just{" "}
						<b>connecting your wallet</b>.
					</div>

					<CustomConnectWallet />

					<div className="text-md p-1 text-center text-isLabelLightSecondary font-500 leading-tight ">
						<b>No signing messages, no approving transactions</b>
						<br />
						Just a simple wallet connection to confirm your wallet
						address.
					</div>
				</div>
			</div>
			<hr className="bg-isSeparatorLight m-2" />
			<div className="grow w-full overflow-y-auto bg-isSystemLightSecondary p-2 space-y-2">
				{GetBio({
					ogAddress,
					web3Bio,
					CTA_CLASSES,
					flag: "settings",
				})}
			</div>
			<hr className="bg-isSeparatorLight m-2" />
			<div className="w-full pt-0 p-1 px-2 pb-2 shrink-0 text-lg font-600 text-isSystemLightSecondary flex flex-col space-y-2">
				<button
					onClick={() => {
						setClearingStorage(true);
						localStorage.clear();
						setClearingStorage(false);
					}}
					className={clsx(
						"w-full text-center rounded-lg p-1 h-8 leading-none bg-isRedDark hover:text-isWhite hover:bg-isRedLight drop-shadow-sm text-[1rem]",
						ANIMATE
					)}
				>
					{clearingStorage === true ? (
						<Spinner
							classes="h-6 w-6 fill-isRedLightEmphasis"
							ring="fill-isWhite"
						/>
					) : (
						"Delete Identity"
					)}
				</button>
				<div className="text-isLabelLightSecondary font-700 text-[0.8rem] text-center leading-none">
					{`Note: This action is irreversible!`}
				</div>
				<hr className="bg-isSeparatorLight" />
			</div>
		</React.Fragment>
	);
};

export default SettingsPage;
