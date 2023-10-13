"use client";

import { useParams } from "next/navigation";
import { UserChats } from "./UserChats";

const ConnectPage = () => {
	const params = useParams();

	return (
		<div className="flex flex-col">
			<div>Connect Page</div>

			<hr />
			<UserChats contactAddress={params.user} />
		</div>
	);
};

export default ConnectPage;
