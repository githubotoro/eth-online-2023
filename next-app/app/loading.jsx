import { Checker } from "@/components/Loaders";

const Loading = () => {
	return (
		<Checker
			cta="Loading"
			container="grow bg-isSystemLightSecondary"
			classes="fill-isGreenLight h-6 w-6"
			ring="fill-isWhite"
		/>
	);
};

export default Loading;
