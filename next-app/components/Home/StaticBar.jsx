import clsx from "clsx";
import React, { useState } from "react";
import { ANIMATE } from "@/components/Constants";
import { CheckCircle, Clipboard } from "@/icons";

export const StaticBar = ({ username, address }) => {
	const [copying, setCopying] = useState(false);
	const delay = (milliseconds) => {
		return new Promise((resolve) => {
			setTimeout(resolve, milliseconds);
		});
	};

	const copyAddress = async () => {
		try {
			setCopying(true);
			await navigator.clipboard.writeText(address);
			await delay(1000);
			setCopying(false);
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<React.Fragment>
			<div className="shrink-0 rounded-2xl bg-gradient-to-b from-isIndgioDarkEmphasis border border-isGrayLightEmphasis6 to-isIndigoLight mt-4 mx-1 p-1">
				<div
					className={clsx(
						"w-full text-center text-lg font-600 text-isSystemLightPrimary hover:text-isSystemLightSecondary items-center flex flex-col drop-shadow-sm",
						ANIMATE
					)}
				>
					<div className="rounded-md px-2 w-full max-w-fit truncate text-ellipsis">{`@${username}`}</div>
				</div>
				<div className="w-full py-1 px-4 shrink-0 flex flex-col items-center">
					<div className="w-full max-w-fit bg-isGrayLightEmphasis6 rounded-xl p-1 flex flex-row items-center text-md space-x-1 drop-shadow-sm">
						<div className="shrink-0 h-4 w-4 rounded-full bg-gradient-to-br from-isYellowLight via-isOrangeLight to-isRedLight border-[1.5px] border-isWhite shadow-sm"></div>
						<div
							className={clsx(
								"text-isLabelLightSecondary hover:text-isLabelLightPrimary truncate text-ellipsis font-600",
								ANIMATE
							)}
						>
							{address}
						</div>

						<button
							disabled={copying === true}
							onClick={() => {
								copyAddress();
							}}
						>
							{copying === true ? (
								<CheckCircle
									classes={clsx(
										"shrink-0 h-4 w-4 rounded-none fill-isGreenLight stroke-isWhite drop-shadow-sm"
									)}
								/>
							) : (
								<Clipboard
									classes={clsx(
										"shrink-0 h-4 w-4 rounded-none fill-isSystemLightPrimary stroke-isBlueLight drop-shadow-sm cursor-pointer"
									)}
								/>
							)}
						</button>
					</div>
				</div>
			</div>
		</React.Fragment>
	);
};
