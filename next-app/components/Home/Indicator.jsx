"use client";

import { useState, useEffect } from "react";

export const Indicator = () => {
	const formatTimestamp = (timestamp) => {
		// Create a Date object from the input string
		const date = new Date(timestamp);

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
		const dayNames = ["Sun", "Mon", "Tues", "Wed", "Thur", "Fri", "Sat"];

		// Get day, month, and day-of-week indexes
		const day = date.getDate();
		const month = date.getMonth();
		const dayOfWeek = date.getDay();

		// Get hours, minutes, and AM/PM
		const hours = date.getHours() % 12 || 12; // Convert to 12-hour format
		const minutes = String(date.getMinutes()).padStart(2, "0");
		const ampm = date.getHours() >= 12 ? "PM" : "AM";

		// Format the output string
		const dateString = `${dayNames[dayOfWeek]}, ${monthNames[month]} ${day}`;
		const timeString = `${hours}:${minutes} ${ampm}`;

		return {
			dateString,
			timeString,
		};
	};

	const [timestamp, setTimestamp] = useState(
		formatTimestamp(new Date().toLocaleString())
	);

	useEffect(() => {
		const intervalID = setInterval(() => {
			setTimestamp(formatTimestamp(new Date().toLocaleString()));
		}, 1000);

		return () => {
			clearInterval(intervalID);
		};
	});

	return (
		<div className="shrink-0 flex w-full flex-row justify-between pt-1 relative overflow-hidden rounded-2xl">
			<div className="pl-2">{timestamp?.timeString}</div>

			<div className="pr-2">{timestamp?.dateString}</div>

			<div className="absolute w-full flex flex-row items-center -mt-1">
				<div className="bg-isWhite flex-grow text-isWhite rounded-md -z-10 text-center">
					.
				</div>
				<div className="z-10 bg-isSystemDarkTertiary text-isWhite w-full max-w-[9rem] text-center rounded-b-lg font-600 drop-shadow-sm">
					ETH-Line
				</div>
				<div className="bg-isWhite flex-grow  text-isWhite rounded-md -z-10 text-center">
					.
				</div>
			</div>
			<div className="absolute top-0 w-full h-2 bg-isSystemDarkTertiary -z-20"></div>
		</div>
	);
};
