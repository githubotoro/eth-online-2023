"use client";

import React from "react";
import { Users, Home, Cog, ChatBubble, BellAlert } from "@/icons";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import { ANIMATE } from "@/components/Constants";
import Link from "next/link";

export const Navigator = () => {
	const pathname = usePathname();
	console.log(pathname.slice(0, 8));

	const BASE_ICON = clsx(
		"drop-shadow-sm stroke-none cursor-pointer",
		ANIMATE
	);
	const PASSIVE = clsx("fill-isGrayLightEmphasis3 hover:fill-isGrayLight");
	const ACTIVE = clsx("fill-isBlueDark hover:fill-isBlueLightEmphasis");
	const LINK = clsx("w-7 h-7");

	return (
		<React.Fragment>
			<div className="shrink-0 absolute bottom-0 bg-gradient-to-b from-isSystemLightSecondary bg-isGrayLightEmphasis5 w-full rounded-b-2xl h-9 p-1 flex flex-row justify-evenly drop-shadow-sm">
				<Link href="/settings" className={LINK}>
					<Cog
						classes={clsx(
							BASE_ICON,
							pathname.slice(0, 10) === "/settings"
								? ACTIVE
								: PASSIVE
						)}
					/>
				</Link>
				<Link href="/contacts" className={LINK}>
					<Users
						classes={clsx(
							BASE_ICON,
							pathname.slice(0, 10) === "/contacts"
								? ACTIVE
								: PASSIVE
						)}
					/>
				</Link>
				<Link href="/" className={LINK}>
					<Home
						classes={clsx(
							BASE_ICON,
							pathname === "/" ? ACTIVE : PASSIVE
						)}
					/>
				</Link>
				<Link href="/connect" className={LINK}>
					<ChatBubble
						classes={clsx(
							BASE_ICON,
							pathname.slice(0, 8) === "/connect"
								? ACTIVE
								: PASSIVE
						)}
					/>
				</Link>
				<Link href="/notifications" className={LINK}>
					<BellAlert
						classes={clsx(
							BASE_ICON,
							pathname.slice(0, 15) === "/notifications"
								? ACTIVE
								: PASSIVE
						)}
					/>
				</Link>
			</div>
		</React.Fragment>
	);
};
