import React from "react";

export const FetchContacts = ({
	currUser,
	chats,
	requests,
	homeTab,
	setHomeTab,
}) => {
	return (
		<React.Fragment>
			<div className="w-full flex flex-row">
				{/* <button onClick={setHomeTab("CHATS")}>Contacts</button>
				<button onClick={setHomeTab("REQUESTS")}>Requests</button> */}
			</div>
		</React.Fragment>
	);
};
