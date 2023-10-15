"use client";

import { useParams } from "next/navigation";
import { useStore } from "@/store";
import { redirect } from "next/navigation";
import { Checker } from "@/components/Loaders";

const UserPage = () => {
	const params = useParams();
	const { chatNetwork } = useStore();

	if (chatNetwork === "PUSH") {
		redirect(`/connect/${params.user}/push`);
	} else if (chatNetwork === "XMTP") {
		redirect(`/connect/${params.user}/xmtp`);
	} else {
		return (
			<Checker
				cta="Connecting..."
				container="grow"
				classes="h-6 w-6 fill-isOrangeLight"
				ring="fill-isSystemLightSecondary"
			/>
		);
	}
};

export default UserPage;
