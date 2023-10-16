import "./globals.css";
import "@rainbow-me/rainbowkit/styles.css";

import clsx from "clsx";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import {
	Indicator,
	Providers,
	MainConnector,
	PushSocketConnector,
	Navigator,
} from "@/components/Home";

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

			<body className={clsx(inter.variable, "text-xs font-sans")}>
				<Toaster position="top-center" reverseOrder={false} />

				<PushSocketConnector />
				<Providers>
					<div className="absolute inset-0 h-[calc(100dvh)] flex flex-col w-full items-center p-2 bg-isGrayLightEmphasis6 overflow-hidden">
						<div className="flex flex-col h-full w-full max-w-xl bg-isWhite rounded-2xl drop-shadow-sm overflow-hidden relative">
							<Indicator />

							<MainConnector />

							{children}

							<Navigator />
						</div>
					</div>
				</Providers>
			</body>
		</html>
	);
};

export default RootLayout;
