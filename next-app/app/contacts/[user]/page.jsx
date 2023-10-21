"use client";

import { ethers } from "ethers";
import { useParams } from "next/navigation";
import { GetBio } from "@/components/MaskNetwork";
import { useStore } from "@/store";
import React, { useEffect, useState } from "react";
import { Checker } from "@/components/Loaders";
import clsx from "clsx";
import { ChatBubbleLeftRight, Phone, Camera } from "@/icons";
import Image from "next/image";
import Link from "next/link";
import { ANIMATE } from "@/components/Constants";
// import { useStore } from "@/store";

const ProfilePage = () => {
	const params = useParams();
	if (!ethers.utils.isAddress(params.user)) {
		return;
	}

	const {
		setOnCall,
		setPeerAddress,
		setCallType,
		setIsCaller,
		setIsCallAccepted,
	} = useStore();

	const [loadingBio, setLoadingBio] = useState(true);
	const [web3Bio, setWeb3Bio] = useState(null);

	const GetWeb3Bio = async () => {
		try {
			const res = await fetch(
				`https://api.web3.bio/profile/${params.user}`
			);
			const data = await res.json();
			if (!data.error) {
				setWeb3Bio(data);
			} else {
				setWeb3Bio([]);
			}

			setLoadingBio(false);
		} catch (err) {
			console.log(err);
		}
	};

	useEffect(() => {
		GetWeb3Bio();
	}, []);

	const CTA_CLASSES = clsx(
		"font-700 text-center w-full text-isSystemDarkTertiary text-[1rem] p-3"
	);

	if (loadingBio === true) {
		return (
			<Checker
				classes="w-6 h-6 fill-isBlueLight"
				ring="fill-isSystemLightTertiary"
				container="grow"
				cta="Fetching Profile"
			/>
		);
	} else {
		return (
			<React.Fragment>
				<hr className="bg-isSeparatorLight m-2" />
				<div className="px-2 w-full shrink-0">
					<div className="rounded-xl bg-isSystemLightSecondary p-2 drop-shadow-sm">
						<div className="flex flex-row space-x-2 items-center place-content-center">
							<div className="shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-isSystemLightTertiary to-isSystemDarkTertiary drop-shadow-sm"></div>
							<div className="text-[1rem] truncate text-ellipsis font-500 text-isLabelLightSecondary">
								{params.user}
							</div>
						</div>
					</div>
					<div className="w-full place-content-center flex flex-col items-center">
						<div className="w-full flex flex-row mt-2 max-w-xs">
							<button
								onClick={() => {
									setIsCallAccepted(true);
									setIsCaller(true);
									setCallType("aduio");
									setPeerAddress(params.user);
									setOnCall(true);
								}}
								className={clsx(
									"w-1/6 aspect-square bg-isGreenLight hover:bg-isGreenLightEmphasis rounded-xl shadow-sm mr-2 p-2 group",
									ANIMATE
								)}
							>
								<Phone
									classes={clsx(
										"fill-isSystemLightSecondary group-hover:fill-isWhite",
										ANIMATE
									)}
								/>
							</button>
							<button
								onClick={() => {
									setIsCallAccepted(true);
									setIsCaller(true);
									setCallType("video");
									setPeerAddress(params.user);
									setOnCall(true);
								}}
								className={clsx(
									"w-1/6 aspect-square bg-isBlueLight hover:bg-isBlueLightEmphasis rounded-xl shadow-sm mr-2 p-2 group",
									ANIMATE
								)}
							>
								<Camera
									classes={clsx(
										"fill-isSystemLightSecondary group-hover:fill-isWhite",
										ANIMATE
									)}
								/>
							</button>
							<div className="w-1/6 shrink-0 aspect-square bg-isSystemLightSecondary rounded-xl p-2 rounded-r-none">
								<ChatBubbleLeftRight
									classes={clsx("fill-isOrangeLight")}
								/>
							</div>
							<div className="w-fit bg-isSystemLightSecondary rounded-lg rounded-l-none flex flex-col justify-between px-1 md:py-[0.15rem] ">
								<Link
									href={`/connect/${params.user}/push`}
									className="contents"
								>
									<div className="h-1/2 flex flex-col items-end place-content-center w-full">
										<div
											className={clsx(
												"w-[4rem] flex flex-row items-center bg-isSystemLightTertiary shadow-sm rounded-md space-x-1 hover:bg-isSystemLightPrimary/50",
												ANIMATE
											)}
										>
											<div className="relative w-[1.3rem] h-[1.3rem] rounded-md overflow-hidden shadow-sm">
												<Image
													src="/assets/push-logo.jpeg"
													alt="push protocol logo"
													fill
												/>
											</div>
											<div className="font-700 text-isSystemDarkTertiary pr-1">
												PUSH
											</div>
										</div>
									</div>
								</Link>

								<Link
									href={`/connect/${params.user}/xmtp`}
									className="contents"
								>
									<div className="h-1/2 flex flex-col items-end place-content-center w-full">
										<div
											className={clsx(
												"w-[4rem] flex flex-row items-center bg-isSystemLightTertiary shadow-sm rounded-md space-x-1 hover:bg-isSystemLightPrimary/50",
												ANIMATE
											)}
										>
											<div className="relative w-[1.3rem] h-[1.3rem] rounded-md overflow-hidden shadow-sm">
												<Image
													src="/assets/xmtp-logo.png"
													alt="xmtp logo"
													fill
												/>
											</div>
											<div className="font-700 text-isSystemDarkTertiary pr-1">
												XMTP
											</div>
										</div>
									</div>
								</Link>
							</div>

							{/* <div className="w-3/6 aspect-auto bg-isSystemLightSecondary rounded-xl shadow-sm px-[0.35rem] py-[0.15rem] space-y-[0.25rem]">
								<div className="flex flex-row items-center w-full place-content-center space-x-1 text-md font-600 text-isLabelLightSecondary">
									<ChatBubbleLeftRight
										classes={clsx("fill-isOrangeLight w-5")}
									/>
									<div>Send Message</div>
								</div>
								<div
									className="w-full flex flex-row justify-between
                                "
								>
									<div className="flex flex-row items-center bg-isSystemLightTertiary shadow-sm rounded-md space-x-2">
										<div className="relative w-5 h-5 rounded-md overflow-hidden shadow-sm">
											<Image
												src="/assets/push-logo.jpeg"
												fill
											/>
										</div>
										<div className="font-700 text-isSystemDarkTertiary pr-1">
											PUSH
										</div>
									</div>
									<div className="flex flex-row items-center bg-isSystemLightTertiary shadow-sm rounded-md space-x-2">
										<div className="relative w-5 h-5 rounded-md overflow-hidden shadow-sm">
											<Image
												src="/assets/xmtp-logo.png"
												fill
											/>
										</div>
										<div className="font-700 text-isSystemDarkTertiary pr-1">
											XMTP
										</div>
									</div>
								</div>
							</div> */}
						</div>
					</div>
				</div>
				<hr className="bg-isSeparatorLight m-2" />
				<div className="grow w-full overflow-y-auto bg-isSystemLightSecondary p-2 space-y-2">
					{GetBio({
						ogAddress: params.user,
						web3Bio,
						CTA_CLASSES,
						flag: "contacts",
					})}
				</div>
			</React.Fragment>
		);
	}
};

export default ProfilePage;
