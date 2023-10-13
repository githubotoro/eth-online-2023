import React from "react";

const formatTimestamp = (timestamp) => {
	// Create a Date object from the input string
	const localTimestamp = new Date(timestamp).toLocaleString();
	const date = new Date(localTimestamp);

	// Define arrays for month names and day names
	const monthNames = [
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"June",
		"July",
		"Aug",
		"Sept",
		"Oct",
		"Nov",
		"Dec",
	];
	const dayNames = [
		"Sunday",
		"Monday",
		"Tuesday",
		"Wednesday",
		"Thursday",
		"Friday",
		"Saturday",
	];

	// Get day, month, and day-of-week indexes
	const day = date.getDate();
	const month = date.getMonth();
	const dayOfWeek = date.getDay();

	// Get hours, minutes, and AM/PM
	const hours = date.getHours() % 12 || 12; // Convert to 12-hour format
	const minutes = date.getMinutes();
	const ampm = date.getHours() >= 12 ? "PM" : "AM";

	// Format the output string
	const dateString = `${dayNames[dayOfWeek]}, ${monthNames[month]} ${day}`;
	const timeString = `${hours}:${minutes} ${ampm}`;

	return {
		dateString,
		timeString,
	};
};

const chats = [
	{
		chatId: "283621122c45349d3c95e6e5d8dc4615c9d4106b17cceba2d48f1b1b0f21bf34",
		about: null,
		did: "eip155:0xcC2769d1541A670920241Ee7655D50810bE21490",
		intent: "eip155:0xcC2769d1541A670920241Ee7655D50810bE21490",
		intentSentBy: "eip155:0xcC2769d1541A670920241Ee7655D50810bE21490",
		intentTimestamp: "2023-10-13T05:38:46.000Z",
		publicKey:
			'{"key":"-----BEGIN PGP PUBLIC KEY BLOCK-----\\n\\nxsBNBGUowyYBCACl9KksXq7PxiKoVKxJzsxeLaQkEW+gy0dhpezsPcPCABQj\\n+cafneLSAx8Afe+4sClQtm8Zwdumljba1nq6ovNBYyAkxHW7jaTbL0QVk4T/\\nDsbJ9C5YG5LoNVWWhkH5BLuv1ibNW/cc85JvgQbixeSgs+aOErjJcO/quZnv\\nuxEsRYsFW+/WhMyTD4fwT37G8+swU48tXAYjDVup9D596Cj/nDbIPU6qLBoZ\\nyYa5jufNIBn4SPH31oSoH0y9Ri9TkxwMRkqnpQH63mVgP+IuzBUUpZM4RTqf\\n7gDl4/E+PpTd3o9gtekMfoMyaQIGEbRiOAPYMTrGHHEu3I0y9V3DDTVVABEB\\nAAHNAMLAigQQAQgAPgWCZSjDJgQLCQcICZAjD2FYtoLMEAMVCAoEFgACAQIZ\\nAQKbAwIeARYhBNfzIT1bRc/hB54BgiMPYVi2gswQAAB8wggAkw6HxaZaFw5W\\nbTauiYd4CCq24vEXKfQU+YSiQmxUw8fLkTksyEvNipM6JFHsNI9/pOKyteTR\\nknkCUDk0SVO9xRZAqgq7ooZlx8vH+ehCK6JbwhXcsBdeaaIOUazWp2oKhs5h\\nJ3cccYDilwNhzSPKeaZ1C4TAE0YEwKKeuVOyd3mtKVuU4wgBI4Wk+fznGPk7\\nXUgX4+0ikncjSOYhFTfSQ+Hg/2QFsce5jPqrMvS8s6k0graojqSj77v5DhKv\\nf8KZZYdLYl/yjj6Mh6+sL10iZyi6ufHkb8tyX0EYlv85mO5nbEUILnP+Axj1\\nNxlmOQCPu+oAuDh/uvc952BlTlU1a87ATQRlKMMmAQgAz0NJVOzl2CZ4409O\\n0pjvxraXWpvDg/WcsX/2mu135KX/LBKrR02LmW0dkJpK8WPM92OjtnJQ+LKi\\nsyfQaGerET523uKvXThoaBaM81IhWkjqkG4wuuTNyIkiq8OlAgFJGMJc5tf3\\nYmpKXZccMOe9qcb+VgY+YZW5daaLUt8fb0vX/NedO9dHwlcqmjdcdVYeXXxV\\nYovCX1da4SWAs4XzKtpoA6FDeEn2SQc2DeXU6qWfJdkNZFoG8iMG15QjsETw\\nL0tu5YBfbtcalj0T5dbezpaa1NPeuDpQIz4sqpyFSZcP771dIzcdTWd/lfqn\\n6e4B2K5MX4dT8yKOp75s1vqPzwARAQABwsB2BBgBCAAqBYJlKMMmCZAjD2FY\\ntoLMEAKbDBYhBNfzIT1bRc/hB54BgiMPYVi2gswQAAAFTAf/WQLBqmRyGNag\\neGE9VVk2Mr8zrlRmsWIl9dY2sMDO4xnfrY5UG0PQXMrJ8ZoL96MC8twpbdct\\nbCBAq5oDLha29DgUzpGhmlN7YXOaj5kRR1SrzICh0O2JMjTHKa6ovbTqQT/o\\nPNyQz8/ciqHQPpjbPiIfifeHqg5KvR7eVpoarL29pcIpA1zniDMMJYiG3yij\\n2FWlXLP7Kl3Y2sOYcHTtpyiMg0FvbCZsGeb7mONfUV4kIjdM8q6E7WK5jXnA\\nKuKzRtivJp/4DOWVQgvhUJf5iDhfGazJ7NJAcK+lxVquXog6TLaN6cwQuhqS\\nKe4Dep2I7uus/e5AopBslokMvrOpsw==\\n=1PeN\\n-----END PGP PUBLIC KEY BLOCK-----\\n","signature":"DEPRECATED"}',
		profilePicture:
			"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAyUlEQVR4AcXBq23EQBiF0S9XU8Bwt2SDSOnBZIihkWVkuGSI65htaRXqDhL6b4AjK497zsvr2/sHwbyMRN3U8xOP251oW3ciYSbMhFmqRyMq686TzJN6NM6UPPBkHYjq0YiEmTATZqnkgf9U8kAkzISZMEt8ox6NK+rRiEoeOCPMhJkwS/MycmrqiUoeOFOPRjQvI2eEmTATZokvuqnnN3VTT/S43YmEmTATZmlbd6JK4y9t604kzISZMEtcNC8jp6aeK4SZMBNmn8TXKmyoZszQAAAAAElFTkSuQmCC",
		threadhash:
			"bafyreia5k5cgeschwf3lklvqr2gmxdvgtu3lrq6axtpeqxfjynfk6bt7cu",
		wallets: "eip155:0xcC2769d1541A670920241Ee7655D50810bE21490",
		combinedDID:
			"eip155:0xcC2769d1541A670920241Ee7655D50810bE21490_eip155:0xd57dE78f3f741A8Dcd02Ec9728A5a26356ef57E3",
		name: null,
		groupInformation: null,
		msg: {
			fromDID: "eip155:0xcC2769d1541A670920241Ee7655D50810bE21490",
			toDID: "eip155:0xd57dE78f3f741A8Dcd02Ec9728A5a26356ef57E3",
			messageObj: {
				content: "Hi there",
			},
			messageContent: "Hi there",
			messageType: "Text",
			timestamp: 1697175526289,
			fromCAIP10: "eip155:0xcC2769d1541A670920241Ee7655D50810bE21490",
			toCAIP10: "eip155:0xd57dE78f3f741A8Dcd02Ec9728A5a26356ef57E3",
			encryptedSecret:
				"-----BEGIN PGP MESSAGE-----\n\nwcBMAyBNSuDe2qbUAQgAmtMLzie490jWc8J1mT4sE5XhmtJJCrgpQ6MYUJVu\n7Khh8g8ApUmiG5RoQbDMvY/nOVvzdXp5PIBGOIhIUgMAN9g3oWA1uEoEkvo3\nzwzRJ1CqHhY0vsegccnp9cRi5ndbYgL9QXjQWE5dK9bjMpKoYM3QGpkp8NFe\nKGvk5oVIvImvRGu9M7FfQXOYtVNhfjCqij6ZJKp8All7bvUtrwO5x0bEcE4a\ns0dQfu2bt7uJyVX/Poa0kGmwjNcpYAD02gqJsAuvCnWg/WHcZPWRueZIpf8i\nguAJj9HuPofJnWBB7ojqN49A5vkM5sJZC62xXiNeNuIoR/szm86+6aedxKKc\nycHATANHwLTNMH3cegEH/3c7LSIcpY007rah8dBuwgZXMPKPmC7uVyo8800l\nmlapPxWKxDo8RDzXeCQJKGnbD7tVeuH9VuCAFVpCYiMfeZ6uWJraDoYcUai6\nShwT0CNYCAqo3MQND7QilsuAqbyIfFznIduyaZC/hx4bcR5sUOle6JyA0Bjk\nBZ2H0HkJwrwNR75wVd2e1LiMTP5jtS4FH5YUDnnGiIdLkA7LWXG2MhwMwfgG\n8sXJgrPUbWuv9bdAXPLwpFQ4l7dV8EFmO9pCdJbHcGveNOr2cSrSXtWTT4Ij\nhbl4sg/v3McqpYSCeZRRNTbRfDZRg08XZrnRFTy+WlnpSSoswz9QXvioz7q9\njDzSQAGoXFambB2iLshoMHrX1M4EGGheABVT0SGAxxlaxaEzIx2X3AQWSJd1\nNrnLD26ADWhEuhkejlJ11AG60/Fc9UE=\n=a51T\n-----END PGP MESSAGE-----\n",
			encType: "pgp",
			signature:
				"-----BEGIN PGP SIGNATURE-----\n\nwsBzBAEBCAAnBYJlKNfkCZAjD2FYtoLMEBYhBNfzIT1bRc/hB54BgiMPYVi2\ngswQAACpuwgAnu1BetHjQg86kMXXL8dsXoBjzOS6yuTTylfys8QOxyzfrVjN\nW5olcNQZiisN8T/T0mA/rsTlTeyzWtKVfptKY5/ZN7WYEzd7j7ds+HzlAJRn\nf5p/mgrFSSMBl/8Bz2LxMKNUakNW2fk51u1JqPOiVu76qs9pKDOz2GKgyXMY\nHptw4zoI8ad6RYJQ3Ry5BnGm3psABr/365Fs9FXJM73sBpdeDOyPnxq1nJhe\nhBhGYn51sDlbbnZfx6U4of+Lzgzeh4tHmBAvZktR8YWivsn3mxxIZfRGrSQ2\npK3XMtVbtbe0eJDozGL6GfQj+U2v9Um2yrGIDjlGBpsOZPGOkgWZZQ==\n=UmiT\n-----END PGP SIGNATURE-----\n",
			sigType: "pgpv2",
			verificationProof:
				"pgpv2:-----BEGIN PGP SIGNATURE-----\n\nwsBzBAEBCAAnBYJlKNfkCZAjD2FYtoLMEBYhBNfzIT1bRc/hB54BgiMPYVi2\ngswQAAA5cQgAhv7WqnQYx/OKld/PIQ24MdV9NU299bIAy9c0vhrqLbV+IfTh\nuf2x0/Gr/77DDH19mePpL8LQCu9BDdeIjjS8zMTKYbtsqjSY/alM+LtCt4ZS\n54cuJA5EnA4O49Rip1iyT0Q9xx38tcpBuXcu0E0HfdccMWZGkDl8dWLCwPpK\neIVmo0di2ddkLSGShroMWt5P8oLhphoqx8ONbCQVAaxnPeWa+TGYL2W7Nemi\nkT9tDC40YQnQK4byzpgmee1MhCmRD87grH6Iqh9/Y680QZEx36ioD7h0iwex\nBstvvX0Waz5PmAxCGwrckIzkKsR0Wm70bGZJUrRVyW5MtXZBR6HDaQ==\n=7dNW\n-----END PGP SIGNATURE-----\n",
			link: null,
		},
	},
	{
		chatId: "283621122c45349d3c95e6e5d8dc4615c9d4106b17cceba2d48f1b1b0f21bf34",
		about: null,
		did: "eip155:0xcC2769d1541A670920241Ee7655D50810bE21490",
		intent: "eip155:0xcC2769d1541A670920241Ee7655D50810bE21490",
		intentSentBy: "eip155:0xcC2769d1541A670920241Ee7655D50810bE21490",
		intentTimestamp: "2023-10-13T05:38:46.000Z",
		publicKey:
			'{"key":"-----BEGIN PGP PUBLIC KEY BLOCK-----\\n\\nxsBNBGUowyYBCACl9KksXq7PxiKoVKxJzsxeLaQkEW+gy0dhpezsPcPCABQj\\n+cafneLSAx8Afe+4sClQtm8Zwdumljba1nq6ovNBYyAkxHW7jaTbL0QVk4T/\\nDsbJ9C5YG5LoNVWWhkH5BLuv1ibNW/cc85JvgQbixeSgs+aOErjJcO/quZnv\\nuxEsRYsFW+/WhMyTD4fwT37G8+swU48tXAYjDVup9D596Cj/nDbIPU6qLBoZ\\nyYa5jufNIBn4SPH31oSoH0y9Ri9TkxwMRkqnpQH63mVgP+IuzBUUpZM4RTqf\\n7gDl4/E+PpTd3o9gtekMfoMyaQIGEbRiOAPYMTrGHHEu3I0y9V3DDTVVABEB\\nAAHNAMLAigQQAQgAPgWCZSjDJgQLCQcICZAjD2FYtoLMEAMVCAoEFgACAQIZ\\nAQKbAwIeARYhBNfzIT1bRc/hB54BgiMPYVi2gswQAAB8wggAkw6HxaZaFw5W\\nbTauiYd4CCq24vEXKfQU+YSiQmxUw8fLkTksyEvNipM6JFHsNI9/pOKyteTR\\nknkCUDk0SVO9xRZAqgq7ooZlx8vH+ehCK6JbwhXcsBdeaaIOUazWp2oKhs5h\\nJ3cccYDilwNhzSPKeaZ1C4TAE0YEwKKeuVOyd3mtKVuU4wgBI4Wk+fznGPk7\\nXUgX4+0ikncjSOYhFTfSQ+Hg/2QFsce5jPqrMvS8s6k0graojqSj77v5DhKv\\nf8KZZYdLYl/yjj6Mh6+sL10iZyi6ufHkb8tyX0EYlv85mO5nbEUILnP+Axj1\\nNxlmOQCPu+oAuDh/uvc952BlTlU1a87ATQRlKMMmAQgAz0NJVOzl2CZ4409O\\n0pjvxraXWpvDg/WcsX/2mu135KX/LBKrR02LmW0dkJpK8WPM92OjtnJQ+LKi\\nsyfQaGerET523uKvXThoaBaM81IhWkjqkG4wuuTNyIkiq8OlAgFJGMJc5tf3\\nYmpKXZccMOe9qcb+VgY+YZW5daaLUt8fb0vX/NedO9dHwlcqmjdcdVYeXXxV\\nYovCX1da4SWAs4XzKtpoA6FDeEn2SQc2DeXU6qWfJdkNZFoG8iMG15QjsETw\\nL0tu5YBfbtcalj0T5dbezpaa1NPeuDpQIz4sqpyFSZcP771dIzcdTWd/lfqn\\n6e4B2K5MX4dT8yKOp75s1vqPzwARAQABwsB2BBgBCAAqBYJlKMMmCZAjD2FY\\ntoLMEAKbDBYhBNfzIT1bRc/hB54BgiMPYVi2gswQAAAFTAf/WQLBqmRyGNag\\neGE9VVk2Mr8zrlRmsWIl9dY2sMDO4xnfrY5UG0PQXMrJ8ZoL96MC8twpbdct\\nbCBAq5oDLha29DgUzpGhmlN7YXOaj5kRR1SrzICh0O2JMjTHKa6ovbTqQT/o\\nPNyQz8/ciqHQPpjbPiIfifeHqg5KvR7eVpoarL29pcIpA1zniDMMJYiG3yij\\n2FWlXLP7Kl3Y2sOYcHTtpyiMg0FvbCZsGeb7mONfUV4kIjdM8q6E7WK5jXnA\\nKuKzRtivJp/4DOWVQgvhUJf5iDhfGazJ7NJAcK+lxVquXog6TLaN6cwQuhqS\\nKe4Dep2I7uus/e5AopBslokMvrOpsw==\\n=1PeN\\n-----END PGP PUBLIC KEY BLOCK-----\\n","signature":"DEPRECATED"}',
		profilePicture:
			"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAyUlEQVR4AcXBq23EQBiF0S9XU8Bwt2SDSOnBZIihkWVkuGSI65htaRXqDhL6b4AjK497zsvr2/sHwbyMRN3U8xOP251oW3ciYSbMhFmqRyMq686TzJN6NM6UPPBkHYjq0YiEmTATZqnkgf9U8kAkzISZMEt8ox6NK+rRiEoeOCPMhJkwS/MycmrqiUoeOFOPRjQvI2eEmTATZokvuqnnN3VTT/S43YmEmTATZmlbd6JK4y9t604kzISZMEtcNC8jp6aeK4SZMBNmn8TXKmyoZszQAAAAAElFTkSuQmCC",
		threadhash:
			"bafyreia5k5cgeschwf3lklvqr2gmxdvgtu3lrq6axtpeqxfjynfk6bt7cu",
		wallets: "eip155:0xcC2769d1541A670920241Ee7655D50810bE21490",
		combinedDID:
			"eip155:0xcC2769d1541A670920241Ee7655D50810bE21490_eip155:0xd57dE78f3f741A8Dcd02Ec9728A5a26356ef57E3",
		name: null,
		groupInformation: null,
		msg: {
			fromDID: "eip155:0xcC2769d1541A670920241Ee7655D50810bE21490",
			toDID: "eip155:0xd57dE78f3f741A8Dcd02Ec9728A5a26356ef57E3",
			messageObj: {
				content: "Hi there",
			},
			messageContent: "Hi there",
			messageType: "Text",
			timestamp: 1697175526289,
			fromCAIP10: "eip155:0xcC2769d1541A670920241Ee7655D50810bE21490",
			toCAIP10: "eip155:0xd57dE78f3f741A8Dcd02Ec9728A5a26356ef57E3",
			encryptedSecret:
				"-----BEGIN PGP MESSAGE-----\n\nwcBMAyBNSuDe2qbUAQgAmtMLzie490jWc8J1mT4sE5XhmtJJCrgpQ6MYUJVu\n7Khh8g8ApUmiG5RoQbDMvY/nOVvzdXp5PIBGOIhIUgMAN9g3oWA1uEoEkvo3\nzwzRJ1CqHhY0vsegccnp9cRi5ndbYgL9QXjQWE5dK9bjMpKoYM3QGpkp8NFe\nKGvk5oVIvImvRGu9M7FfQXOYtVNhfjCqij6ZJKp8All7bvUtrwO5x0bEcE4a\ns0dQfu2bt7uJyVX/Poa0kGmwjNcpYAD02gqJsAuvCnWg/WHcZPWRueZIpf8i\nguAJj9HuPofJnWBB7ojqN49A5vkM5sJZC62xXiNeNuIoR/szm86+6aedxKKc\nycHATANHwLTNMH3cegEH/3c7LSIcpY007rah8dBuwgZXMPKPmC7uVyo8800l\nmlapPxWKxDo8RDzXeCQJKGnbD7tVeuH9VuCAFVpCYiMfeZ6uWJraDoYcUai6\nShwT0CNYCAqo3MQND7QilsuAqbyIfFznIduyaZC/hx4bcR5sUOle6JyA0Bjk\nBZ2H0HkJwrwNR75wVd2e1LiMTP5jtS4FH5YUDnnGiIdLkA7LWXG2MhwMwfgG\n8sXJgrPUbWuv9bdAXPLwpFQ4l7dV8EFmO9pCdJbHcGveNOr2cSrSXtWTT4Ij\nhbl4sg/v3McqpYSCeZRRNTbRfDZRg08XZrnRFTy+WlnpSSoswz9QXvioz7q9\njDzSQAGoXFambB2iLshoMHrX1M4EGGheABVT0SGAxxlaxaEzIx2X3AQWSJd1\nNrnLD26ADWhEuhkejlJ11AG60/Fc9UE=\n=a51T\n-----END PGP MESSAGE-----\n",
			encType: "pgp",
			signature:
				"-----BEGIN PGP SIGNATURE-----\n\nwsBzBAEBCAAnBYJlKNfkCZAjD2FYtoLMEBYhBNfzIT1bRc/hB54BgiMPYVi2\ngswQAACpuwgAnu1BetHjQg86kMXXL8dsXoBjzOS6yuTTylfys8QOxyzfrVjN\nW5olcNQZiisN8T/T0mA/rsTlTeyzWtKVfptKY5/ZN7WYEzd7j7ds+HzlAJRn\nf5p/mgrFSSMBl/8Bz2LxMKNUakNW2fk51u1JqPOiVu76qs9pKDOz2GKgyXMY\nHptw4zoI8ad6RYJQ3Ry5BnGm3psABr/365Fs9FXJM73sBpdeDOyPnxq1nJhe\nhBhGYn51sDlbbnZfx6U4of+Lzgzeh4tHmBAvZktR8YWivsn3mxxIZfRGrSQ2\npK3XMtVbtbe0eJDozGL6GfQj+U2v9Um2yrGIDjlGBpsOZPGOkgWZZQ==\n=UmiT\n-----END PGP SIGNATURE-----\n",
			sigType: "pgpv2",
			verificationProof:
				"pgpv2:-----BEGIN PGP SIGNATURE-----\n\nwsBzBAEBCAAnBYJlKNfkCZAjD2FYtoLMEBYhBNfzIT1bRc/hB54BgiMPYVi2\ngswQAAA5cQgAhv7WqnQYx/OKld/PIQ24MdV9NU299bIAy9c0vhrqLbV+IfTh\nuf2x0/Gr/77DDH19mePpL8LQCu9BDdeIjjS8zMTKYbtsqjSY/alM+LtCt4ZS\n54cuJA5EnA4O49Rip1iyT0Q9xx38tcpBuXcu0E0HfdccMWZGkDl8dWLCwPpK\neIVmo0di2ddkLSGShroMWt5P8oLhphoqx8ONbCQVAaxnPeWa+TGYL2W7Nemi\nkT9tDC40YQnQK4byzpgmee1MhCmRD87grH6Iqh9/Y680QZEx36ioD7h0iwex\nBstvvX0Waz5PmAxCGwrckIzkKsR0Wm70bGZJUrRVyW5MtXZBR6HDaQ==\n=7dNW\n-----END PGP SIGNATURE-----\n",
			link: null,
		},
	},
];

export const Test2 = () => {
	return (
		<React.Fragment>
			{chats.map((chat, idx) => {
				const timestamp = formatTimestamp(chat?.msg?.timestamp);

				return (
					<div key={chat?.chatId} className="w-full flex flex-col">
						{idx === 0 ? (
							<div>{timestamp.dateString}</div>
						) : (
							<div>{timestamp.dateString}</div>
						)}
						<div className="flex flex-row w-full">
							From -- {chat?.msg?.fromDID.slice(7)}
						</div>
						<div className="w-full flex flex-row">
							Message -- {chat?.msg?.messageContent}
						</div>
						<div className="flex flex-row w-full">
							At -- {timestamp.timeString}
						</div>
						<hr />
					</div>
				);
			})}
		</React.Fragment>
	);
};
