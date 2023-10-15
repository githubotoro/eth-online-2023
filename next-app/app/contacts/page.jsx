import { ANIMATE } from "@/components/Constants";
import React from "react";
import clsx from "clsx";
import Link from "next/link";

const fetchIdentities = async (users) => {
	try {
		const identities = await Promise.allSettled(
			Object.keys(users).map(async (address) => {
				try {
					const res = await fetch(
						`https://api.web3.bio/profile/${address}`
					);
					const data = await res.json();

					return data;
				} catch (err) {
					console.log(err);
				}
			})
		);

		return identities;
	} catch (err) {
		console.log("error while fetching identities");
		console.log(err);
		return null;
	}
};

const ContactsPage = async () => {
	const users = {
		fefeaf: {
			username: "vitalik",
		},
		wbsd: {
			username: "stani",
		},
		wegewgweg: {
			username: "dwr",
		},
		wegwegew: {
			username: "yupuday",
		},
		ewgewgweg: {
			username: "asd",
		},
		wegewgewg: {
			username: "sadafa",
		},
		ewgewgweg: {
			username: "herye",
		},
		wegewgweg: {
			username: "llerew",
		},
		gwgwg: {
			username: "qwqqeqe",
		},
		sdgewg: {
			username: "zozofa",
		},
		asdsad: {
			username: "ppoo",
		},
		asdasdas: {
			username: "ppaspfapsf",
		},
		asdsad: {
			username: "ppasdpasd",
		},
		asdsadasd: {
			username: "sadsaasf",
		},
		asdasda: {
			username: "asabsdv",
		},
		asdasd: {
			username: "sssffwww",
		},
		asd: {
			username: "bnjljls",
		},
		asdasd: {
			username: "mmmgmfef",
		},
		asdasd: {
			username: "ioioo",
		},
		asdsad: {
			username: "oiiiooada",
		},
		asdas: {
			username: "jkaokfoas",
		},
		sd: {
			username: "qqfaff",
		},
		asdasd: {
			username: "rkjjlh",
		},
		asddasdas: {
			username: "rknbkfkb",
		},
	};
	// const identitiesArray = await fetchIdentities(users);
	const identitiesArray = [
		{
			address: "0xb877f7bb52d28f06e60f557c00a56225124b357f",
			identity: "noun124.eth",
			platform: "ENS",
			displayName: "noun124.eth",
			avatar: "https://cdn.simplehash.com/assets/658c92e364bcdda4dfa8a7b95abeb3b28ae2fdac11dc692330f3f58c2cffab6c.svg",
			email: null,
			description: null,
			location: null,
			header: null,
			links: {
				twitter: {
					link: "https://twitter.com/nounonetwofour",
					handle: "nounonetwofour",
				},
			},
		},
		{
			address: "0xd7029bdea1c17493893aafe29aad69ef892b8ff2",
			identity: "dwr.eth",
			platform: "ENS",
			displayName: "dwr.eth",
			avatar: "https://ens.xyz/dwr.eth",
			email: null,
			description: null,
			location: null,
			header: null,
			links: {
				website: {
					link: "https://danromero.org",
					handle: "danromero.org",
				},
				github: {
					link: "https://github.com/danromero",
					handle: "danromero",
				},
				twitter: {
					link: "https://twitter.com/dwr",
					handle: "dwr",
				},
			},
		},
		{
			address: "0xd7029bdea1c17493893aafe29aad69ef892b8ff2",
			identity: "danromero.lens",
			platform: "lens",
			displayName: "Dan Romero",
			avatar: "https://ik.imagekit.io/lens/media-snapshot/1e210545640fa7b67b6502d7774727f67121adfa2e55020f6601e3ca835b4cd0.png",
			email: null,
			description: "Interested in technology.",
			location: null,
			header: null,
			links: {
				lenster: {
					link: "https://lenster.xyz/u/danromero",
					handle: "danromero",
				},
			},
		},
		{
			address: "0x8fc5d6afe572fefc4ec153587b63ce543f6fa2ea",
			identity: "dwr.eth",
			platform: "farcaster",
			displayName: "Dan Romero",
			avatar: "https://res.cloudinary.com/merkle-manufactory/image/fetch/c_fill,f_png,w_256/https://lh3.googleusercontent.com/MyUBL0xHzMeBu7DXQAqv0bM9y6s4i4qjnhcXz5fxZKS3gwWgtamxxmxzCJX7m2cuYeGalyseCA2Y6OBKDMR06TWg2uwknnhdkDA1AA",
			email: null,
			description: "Working on Farcaster and Warpcast.",
			location: "Los Angeles, CA, USA",
			header: null,
			links: {
				farcaster: {
					link: "https://warpcast.com/dwr.eth",
					handle: "dwr.eth",
				},
			},
		},
	];

	const identities = {};

	identitiesArray.forEach((identity) => {
		const address = identity.address;
		identities[address] = identity;
	});

	// Extract the user objects and sort them by username
	const sortedUsers = Object.values(users).sort((a, b) => {
		return a.username.localeCompare(b.username);
	});

	return (
		<React.Fragment>
			<div className="px-2 text-xl font-700 text-isSystemDarkTertiary h-fit shrink-0 pt-6">
				Contacts
			</div>

			<hr className="bg-isSeparatorLight" />

			<div className="w-full grow overflow-y-scroll">
				{sortedUsers.map((user, idx) => {
					const address = Object.keys(users).find(
						(key) => users[key] === user
					);
					const username = user.username;

					const char =
						idx === 0 ||
						sortedUsers[idx - 1].username[0].toLowerCase() !==
							sortedUsers[idx].username[0].toLowerCase()
							? sortedUsers[idx].username[0]
							: null;

					return (
						<React.Fragment>
							{char !== null ? (
								<React.Fragment>
									<div
										key={`${char}-index`}
										className="uppercase px-2 pt-4 pb-1 text-isLabelLightSecondary text-[0.8rem] font-800"
									>
										{char}
									</div>
									<hr
										key={`${char}-hr`}
										className="bg-isSeparatorLight"
									/>
								</React.Fragment>
							) : (
								<></>
							)}

							<Link
								href={`/connect/${address}`}
								key={`${address}-username`}
								className={clsx("  w-full", ANIMATE)}
							>
								<div className="w-full px-2 py-1 hover:bg-isGrayLightEmphasis5 text-[0.9rem] font-500 text-isSystemDarkTertiary">
									{username}
								</div>
							</Link>

							<hr
								key={`${address}-hr`}
								className="bg-isSeparatorLight"
							/>
						</React.Fragment>
					);
				})}
			</div>

			<hr className="bg-isSeparatorLight" />

			<div className="w-full py-2 text-center text-[1rem] font-700 bg-isSystemLightSecondary text-isSystemDarkTertiary flex flex-row items-center place-content-center space-x-[0.3rem]">
				<div className="h-[0.8rem] w-[0.8rem] p-1 bg-gradient-to-br from-isGreenDark to-isGreenLightEmphasis rounded-full border-2 border-isGrayLightEmphasis6 drop-shadow-sm animate-pulse"></div>
				<div>{sortedUsers.length} Network Users</div>
			</div>
			<div className="h-9 w-full p-1 shrink-0"></div>
		</React.Fragment>
	);
};

export default ContactsPage;
