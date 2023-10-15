import { Spinner } from "./Spinner";
import clsx from "clsx";

export const Checker = ({ cta, classes, container, ring }) => {
	return (
		<div
			className={clsx(
				"w-full h-full flex flex-col items-center place-content-center text-lg space-y-1",
				container
			)}
		>
			<div className="font-600 text-isSystemDarkTertiary">{cta}</div>
			<Spinner classes={classes} ring={ring} />
		</div>
	);
};
