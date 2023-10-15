export const FormatTimestamp = (timestamp) => {
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
