import { Checker } from "@/components/Loaders";
import React from "react";

const Loading = () => {
	return (
		<React.Fragment>
			<div className="p-1 shrink-0"></div>
			<Checker
				cta="Loading"
				container="grow bg-isSystemLightSecondary"
				classes="fill-isGreenLight h-6 w-6"
				ring="fill-isWhite"
			/>
		</React.Fragment>
	);
};

export default Loading;
