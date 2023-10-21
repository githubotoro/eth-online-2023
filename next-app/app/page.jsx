"use client";

import { FetchContacts } from "./(contacts)";
import React, { useState, useEffect } from "react";
import { useStore } from "@/store";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import clsx from "clsx";
import { ANIMATE } from "@/components/Constants";
import { Wifi, Home, Phone, ChatBubble, BellAlert } from "@/icons";

const HomePage = () => {
	const {
		currUser,
		chats,
		requests,
		setChats,
		setRequests,
		homeTab,
		setHomeTab,
		useSigner,
		username,
	} = useStore();

	// useEffect(() => {
	// 	const getChatsAndRequests = async () => {
	// 		try {
	// 			const newChats = await currUser.chat.list("CHATS");
	// 			const newRequests = await currUser.chat.list("REQUESTS");

	// 			setChats(newChats);
	// 			setRequests(newRequests);
	// 		} catch (err) {
	// 			console.log(err);
	// 		}
	// 	};

	// 	getChatsAndRequests();
	// }, []);

	const INLINE_ICON = clsx(
		"h-4 w-4 fill-isLabelLightSecondary inline-block rounded-md drop-shadow-sm mb-1 ml-1"
	);

	return (
		<React.Fragment>
			<hr className="bg-isSeparatorLight m-2" />
			<div className="w-full shrink-0 px-2">
				<div
					className={clsx(
						"w-full rounded-xl bg-isGreenDarkEmphasis py-1 px-2 text-center font-600 text-lg shadow-sm text-isWhite hover:bg-isGreenLight hover:text-isSystemLightSecondary flex flex-row items-center place-content-center space-x-2",
						ANIMATE
					)}
				>
					<div>Welcome to ETH-Line</div>
					<Wifi classes="fill-isWhite h-6 w-6" />
				</div>
			</div>
			<hr className="bg-isSeparatorLight m-2" />
			<div className="grow bg-isSystemLightSecondary w-full overflow-y-auto">
				<div className="p-3 w-full place-items-center flex flex-col">
					<div className="bg-isOrangeDark shadow-sm rounded-md text-[1rem] px-[0.5rem] py-[0.3rem] font-600 text-isWhite w-fit">
						Let's get you started.
					</div>
				</div>

				<div className="w-full items-center font-600 text-[0.9rem] text-isLabelLightSecondary py-2 px-3 leading-5">
					{/* To @{`${username}`},
					<br />
					<br /> */}
					<span className="px-2" />
					<b>You</b> are currently at
					<Home classes={INLINE_ICON} /> -- all available{" "}
					{/* <span className="underline decoration-dashed underline-offset-2"> */}
					network users
					{/* </span>{" "} */}
					can be found at <Phone classes={INLINE_ICON} /> --
					<span className="text-isBlueLight">click</span> on their
					profiles to see their web3 identities -- powered by{" "}
					<span className="text-isPurpleLight">Mask Network</span>.{" "}
					<ChatBubble classes={INLINE_ICON} />
					&nbsp; is where you can find all your recent chats --
					powered by <span className="text-isIndigoLight">
						XMTP
					</span>{" "}
					and <span className="text-isPinkLight">Push Protocol</span>.
					Notifications can be accessed from{" "}
					<BellAlert classes={INLINE_ICON} /> -- powered by{" "}
					<span className="text-isTealLight">Push Notifications</span>
					.
					<br /> <br />
					<span className="px-2" /> For messaging, you have 2 options
					-- on <span className="text-isPinkLight">PUSH</span>{" "}
					network, your first message will be a{" "}
					<b>connection request</b>, and you can only chat further if
					your connection request is accepted -- on{" "}
					<span className="text-isIndigoLight">XMTP</span> network,
					you can chat directly <b>without</b> any explicit connection
					requests.
					<br />
					<br />
					<span className="px-2" />{" "}
					<i>
						"If you are reading this message, <b>you are special</b>{" "}
						-- coz' you are one of the <b>earliest invites</b> on
						the network -- please do drop your valuable feedbacks
						over{" "}
						<a
							href="https://forms.gle/i8JwGuuoo6z5ajT58"
							target="_blank"
							rel="noopener noreferrer"
							className={clsx(
								"text-isBlueLight hover:text-isBlueLightEmphasis",
								ANIMATE
							)}
						>
							here
						</a>{" "}
						and let me know your experiences."
					</i>
					<br />
					<br />
					<b>
						Thanks, <br />
						Uday Khokhariya.
					</b>
				</div>
			</div>
			<hr className="bg-isSeparatorLight m-2" />
			<div className="w-full shrink-0 px-2">
				<div className="bg-isSystemLightSecondary w-full p-2 rounded-lg shadow-sm">
					<div className="w-full text-center text-xs font-700 text-isLabelLightSecondary">
						Built at{" "}
						<span
							className={clsx(
								"text-isPinkLight hover:text-isPinkLightEmphasis",
								ANIMATE
							)}
						>
							<a
								href="https://ethglobal.com/events/ethonline2023"
								target="_blank"
								rel="noopener noreferrer"
							>
								ETH Online 2023
							</a>
						</span>{" "}
						by{" "}
						<span
							className={clsx(
								"text-isBlueLight hover:text-isBlueLightEmphasis",
								ANIMATE
							)}
						>
							<a
								href="https://app.ens.domains/yupuday.eth"
								target="_blank"
								rel="noopener noreferrer"
							>
								yupuday.eth
							</a>
						</span>
					</div>
				</div>
			</div>
			<hr className="bg-isSeparatorLight m-2" />
		</React.Fragment>
	);
};

export default HomePage;
