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

const SettingsPage = () => {
	const [clearningStorage, setClearingStorage] = useState(false);

	const { address } = useAccount();

	const { ogAddress, setOgAddress, web3Bio } = useStore();

	// console.log("address is ", address);
	// console.log("ogAddress is ", ogAddress);

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

	const GetBio = () => {
		if (ogAddress !== undefined && ogAddress !== null) {
			return (
				<React.Fragment>
					{web3Bio.length === 0 ? (
						<div className={CTA_CLASSES}>
							You don't have any major on-chain profiles yet.
						</div>
					) : (
						<div className={CTA_CLASSES}>
							Found some of your on-chain profiles...
						</div>
					)}
					{web3Bio.map((bio, idx) => {
						return (
							<div key={idx} className="w-full">
								<React.Fragment>
									<div
										className={clsx(
											"w-full rounded-xl p-1 drop-shadow-sm group",
											bio.platform === "lens"
												? "bg-isGreenDarkEmphasis"
												: bio.platform === "ENS"
												? "bg-isBlueDarkEmphasis"
												: bio.platform === "farcaster"
												? "bg-isIndgioDarkEmphasis"
												: "bg-isGrayDark"
										)}
									>
										<a
											target="_blank"
											rel="noopener noreferrer"
											href={
												bio.platform === "lens"
													? bio.links.lenster.link
													: bio.platform === "ENS"
													? bio.links.website.link
													: bio.platform ===
													  "farcaster"
													? bio.links.farcaster.link
													: "#"
											}
											className={clsx(
												"rounded-lg opacity-90 hover:opacity-100 bg-isSystemLightSecondary group-hover:bg-isWhite w-full flex flex-row space-x-2 items-center",
												ANIMATE
											)}
										>
											<div className="relative h-8 w-8 rounded-lg overflow-hidden">
												{bio.platform === "lens" ? (
													<Image
														src="/assets/lens-logo.jpeg"
														alt="lens-logo"
														fill
														className="object-cover"
													/>
												) : bio.platform === "ENS" ? (
													<Image
														src="/assets/ens-logo.jpg"
														alt="ens-logo"
														fill
														className="object-cover"
													/>
												) : bio.platform ===
												  "farcaster" ? (
													<Image
														src="/assets/farcaster-logo.jpg"
														alt="lens-logo"
														fill
														className="object-cover"
													/>
												) : (
													<div className="bg-gradient-to-br from-isSystemDarkTertiary to-isSystemDarkPrimary"></div>
												)}
											</div>
											<div className="text-isSystemDarkSecondary text-[1rem] font-600 grow">
												{bio.identity}
											</div>
											{/* <LinkIcon
												classes={clsx(
													"p-[0.3rem] h-8 w-8 stroke-isSystemDarkTertiary stroke-4 bg-isSystemLightTertiary rounded-lg"
												)}
											/> */}
										</a>
										{bio.description !== null ? (
											<div
												className={clsx(
													"mt-1 rounded-lg drop-shadow-sm flex bg-isSystemLightSecondary group-hover:bg-isWhite p-1 break-words w-full text-isSystemDarkTertiary font-500 text-[0.7rem] leading-tight",
													ANIMATE
												)}
											>
												{bio.description}
											</div>
										) : (
											<></>
										)}
									</div>
								</React.Fragment>
							</div>
						);
					})}
				</React.Fragment>
			);
		} else {
			return (
				<div className="w-full h-full rounded-2xl items-center place-content-center text-center flex flex-col text-[0.8rem] text-isLabelLightSecondary space-y-1 leading-tight font-600">
					<span className="text-isSystemDarkSecondary text-[1.2rem] max-w-xs">
						You <b>haven't linked</b> any on-chain profiles yet.
					</span>
					<br />
					<span className="font-500 max-w-xs">
						<b>Pro Tip</b> <br />
						If people don't know who you are, they will not pick
						your call or reply to your messages.
					</span>
				</div>
			);
		}
	};

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

					<div className="text-[0.8rem] p-1 text-center text-isLabelLightSecondary font-500 leading-tight ">
						<b>No signing messages, no approving transactions</b>
						<br />
						Just a simple wallet connection to confirm your wallet
						address.
					</div>
				</div>
			</div>
			<hr className="bg-isSeparatorLight m-2" />
			<div className="grow w-full overflow-y-auto bg-isSystemLightSecondary p-2 space-y-2">
				{GetBio()}
			</div>
			<hr className="bg-isSeparatorLight m-2" />
			<div className="w-full pt-0 p-1 px-2 pb-2 shrink-0 text-lg font-600 text-isSystemLightSecondary flex flex-col space-y-2">
				<button
					onClick={async () => {
						setClearingStorage(!clearningStorage);
						// await localStoage.clear();
					}}
					className={clsx(
						"w-full text-center rounded-lg p-1 h-8 leading-none bg-isRedDark hover:text-isWhite hover:bg-isRedLight drop-shadow-sm",
						ANIMATE
					)}
				>
					{clearningStorage === true ? (
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
