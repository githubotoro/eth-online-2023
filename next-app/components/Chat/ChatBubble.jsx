import clsx from "clsx";

export const ChatBubble = ({ message, at, isConnection }) => {
	return (
		<div
			className={clsx(
				"w-full grid grid-cols-9 relative font-500 drop-shadow-sm"
				// isConnection === true ? "pl-[0.6rem]" : "pr-[0.6rem]"
			)}
		>
			{isConnection === true ? <></> : <div className="col-span-2"></div>}
			<div className="col-span-7 w-full flex flex-col">
				<div
					className={clsx(
						"w-fit min-w-[8rem] rounded-lg overflow-auto py-[0.15rem] px-2 z-30 text-isWhite drop-shadow-sm",
						isConnection === true
							? "bg-isBlueDark"
							: "bg-isGreenDark self-end"
						// ? "bg-isWhite border-l-[3px] border-isBlueLight"
						// : "bg-isWhite self-end border-r-[3px] border-isGreenLight"
					)}
				>
					<div className="w-full flex flex-row">{message}</div>
					<div
						className={clsx(
							"flex flex-col text-right w-full text-[0.6rem] font-700 leading-snug pt-[0.1rem]",
							isConnection === true
								? "text-isBlueLightEmphasis"
								: "text-isGreenLightEmphasis"
						)}
					>
						{at}
					</div>
				</div>
			</div>

			{/* <div
				className={clsx(
					"absolute  bottom-0 w-3 h-3 bg-isGrayLightEmphasis5 rounded-full z-10",
					isConnection === true ? "left-1" : "right-1"
				)}
			></div>

			<div
				className={clsx(
					"absolute bottom-[0.1rem] w-4 h-6 bg-isSystemLightSecondary rounded-2xl z-20",
					isConnection === true ? "-left-[0.4rem]" : "-right-[0.4rem]"
				)}
			></div> */}
		</div>
	);
};
