"use client";

import { useParams } from "next/navigation";

const ConnectPage = () => {
	const params = useParams();

	console.log(params);
	return <div>Connect Page</div>;
};

export default ConnectPage;
