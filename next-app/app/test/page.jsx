"use client";

import React from "react";

// import { Test7 } from "./Test7";
import { VideoConnector } from "@/components/Video";
import { useStore } from "@/store";

const TestPage = () => {
	const { setOnCall, setIsCaller } = useStore();

	return (
		<React.Fragment>
			<VideoConnector />
			<button
				onClick={() => {
					setIsCaller(true);
					setOnCall(true);
				}}
			>
				Start Call
			</button>
			<button
				onClick={() => {
					setIsCaller(false);
					setOnCall(false);
				}}
			>
				End Call
			</button>
		</React.Fragment>
	);
};

export default TestPage;
