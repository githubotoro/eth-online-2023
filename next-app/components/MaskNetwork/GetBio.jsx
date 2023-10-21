import clsx from "clsx";
import React from "react";
import { ANIMATE } from "../Constants";
import Image from "next/image";
import { ExclamationTriangle } from "@/icons";

export const GetBio = ({ ogAddress, web3Bio, CTA_CLASSES, flag }) => {
	if (ogAddress !== undefined && ogAddress !== null) {
		return (
			<React.Fragment>
				{web3Bio.length === 0 ? (
					<div className={CTA_CLASSES}>
						{/* <ExclamationTriangle
							classes={clsx(
								"w-6 h-6 bg-isRedDark fill-isSystemDarkSecondary inline-block"
							)}
						/> */}
						No major on-chain profiles were found.
					</div>
				) : (
					<div className={CTA_CLASSES}>
						Found some on-chain profiles...
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
												: bio.platform === "farcaster"
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
											) : bio.platform === "farcaster" ? (
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
	} else if (flag === "settings") {
		return (
			<div className="w-full h-full rounded-2xl items-center place-content-center text-center flex flex-col text-[0.8rem] text-isLabelLightSecondary space-y-1 leading-tight font-600">
				<span className="text-isSystemDarkSecondary text-[1rem] max-w-xs">
					You <b>haven't linked</b> any on-chain profiles yet.
				</span>
				<br />
				<span className="font-500 max-w-xs">
					<b>Pro Tip</b> <br />
					If people don't know who you are, they will not pick your
					call or reply to your messages.
				</span>
			</div>
		);
	} else {
		return <div></div>;
	}
};
