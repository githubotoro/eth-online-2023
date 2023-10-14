import "./globals.css";
import { Inter } from "next/font/google";
import { MainConnector, PushSocketConnector } from "./(connectors)";
import { Toaster } from "react-hot-toast";
import clsx from "clsx";
import { TimestampIndicator } from "./TimestampIndicator";

const inter = Inter({
	subsets: ["latin"],
	weight: ["200", "300", "400", "500", "600", "700", "800"],
	display: "swap",
	style: ["normal"],
	variable: "--font-inter",
});

export const metadata = {
	title: "ETH Line",
	description: "Chat & call anyone on the open internet",
};

const RootLayout = ({ children }) => {
	return (
		<html lang="en">
			<link rel="manifest" href="/manifest.json" />
			<body
				className={clsx(
					inter.variable,
					"font-sans bg-isGrayLightEmphasis6 w-full h-full flex flex-col font-500 text-xs text-isSystemDarkPrimary"
				)}
			>
				<Toaster position="top-center" reverseOrder={false} />

				{/* <PushSocketConnector /> */}

				<div className="flex flex-col w-full h-screen items-center p-2">
					<div className="flex flex-col w-full max-w-xl bg-isWhite h-full rounded-2xl drop-shadow-sm overflow-auto relative">
						<TimestampIndicator />

						<div className="absolute top-0 w-full flex flex-row items-center">
							<div className="bg-isWhite flex-grow text-isWhite rounded-md -z-10 text-center">
								.
							</div>
							<div className="z-10 bg-isSystemDarkTertiary text-isWhite w-full max-w-[9rem] text-center rounded-b-lg font-600 drop-shadow-sm">
								ETH-Line
							</div>
							<div className="bg-isWhite flex-grow text-isWhite rounded-md -z-10 text-center">
								.
							</div>
						</div>
						<div className="absolute top-0 w-full h-2 bg-isSystemDarkTertiary -z-20"></div>
						<MainConnector />
						{children}
					</div>
				</div>
			</body>
		</html>
	);
};

export default RootLayout;
