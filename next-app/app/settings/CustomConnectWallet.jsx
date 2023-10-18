import { ConnectButton } from "@rainbow-me/rainbowkit";
import { ANIMATE } from "@/components/Constants";
import clsx from "clsx";

export const CustomConnectWallet = () => {
	return (
		<ConnectButton.Custom>
			{({
				account,
				chain,
				openAccountModal,
				openChainModal,
				openConnectModal,
				authenticationStatus,
				mounted,
			}) => {
				const ready = mounted && authenticationStatus !== "loading";
				const connected =
					ready &&
					account &&
					(!authenticationStatus ||
						authenticationStatus === "authenticated");
				return (
					<div
						{...(!ready && {
							"aria-hidden": true,
							style: {
								opacity: 0,
								pointerEvents: "none",
								userSelect: "none",
							},
						})}
					>
						{(() => {
							if (!connected) {
								return (
									<button
										onClick={openConnectModal}
										type="button"
										className={clsx(
											"w-full text-[1rem] font-600 bg-isBlueDark hover:bg-isBlueLight p-2 rounded-lg drop-shadow-sm text-isSystemLightSecondary hover:text-isWhite",
											ANIMATE
										)}
									>
										Connect Wallet
									</button>
								);
							}

							return (
								<div>
									<button
										onClick={openAccountModal}
										type="button"
										className={clsx(
											"w-full text-lg font-600 bg-isGreenDark hover:bg-isGreenLight p-1 rounded-lg drop-shadow-sm text-isSystemLightSecondary hover:text-isWhite",
											ANIMATE
										)}
									>
										{account.displayName}
									</button>
								</div>
							);
						})()}
					</div>
				);
			}}
		</ConnectButton.Custom>
	);
};
