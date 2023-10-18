"use client";

import { useStore } from "@/store";
import React from "react";

export const RenderChildren = ({ children }) => {
	const { userSigner, confirmingIdentity } = useStore();

	if (userSigner !== null && confirmingIdentity === false) {
		return <React.Fragment>{children}</React.Fragment>;
	}
};
