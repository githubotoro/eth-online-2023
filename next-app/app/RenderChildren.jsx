"use client";

import { useStore } from "@/store";
import React from "react";

export const RenderChildren = ({ children }) => {
	const { userSigner } = useStore();

	if (userSigner !== null) {
		return <React.Fragment>{children}</React.Fragment>;
	}
};
