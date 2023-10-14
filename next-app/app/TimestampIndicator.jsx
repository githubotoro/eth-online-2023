"use client";

import { useState, useEffect } from "react";

export const TimestampIndicator = () => {
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
		<div className="flex w-full flex-row justify-between px-2 pt-1 relative">
			<div>{timestamp?.timeString}</div>

			<div>{timestamp?.dateString}</div>
		</div>
	);
};
