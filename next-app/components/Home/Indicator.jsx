"use client";

import { Moon } from "@/icons/Moon";
import { useState, useEffect } from "react";
import clsx from "clsx";
import { Sun } from "@/icons/Sun";
import { ChartBar } from "@/icons/ChartBar";

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
			hours: date.getHours(),
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
		<div className="shrink-0 flex w-full flex-row justify-between pt-1 relative overflow-hidden rounded-2xl font-500">
			<div className="pl-2 space-x-2 ">
				{timestamp?.timeString}
				{timestamp?.hours >= 20 || timestamp?.hours <= 8 ? (
					<Moon
						classes={clsx(
							"fill-isSystemDarkSecondary h-3 w-3 inline-block ml-1 mb-[0.2rem]"
						)}
					/>
				) : (
					<></>
				)}

				{timestamp?.hours > 8 && timestamp?.hours < 20 ? (
					<Sun
						classes={clsx(
							"fill-isSystemDarkSecondary h-3 w-3 inline-block ml-1 mb-[0.2rem]"
						)}
					/>
				) : (
					<></>
				)}
			</div>

			<div className="pr-2">
				<ChartBar
					classes={clsx(
						"fill-isSystemDarkSecondary h-3 w-3 inline-block mr-1 mb-[0.2rem]"
					)}
				/>
				{timestamp?.dateString}
			</div>

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
