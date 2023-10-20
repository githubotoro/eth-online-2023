"use client";

import { useStore } from "@/store";
import React from "react";

export const RenderChildren = ({ children }) => {
	const { userSigner, confirmingIdentity, onCall } = useStore();

	if (
		userSigner !== null &&
		confirmingIdentity === false &&
		onCall === false
	) {
		return <React.Fragment>{children}</React.Fragment>;
	}
};
