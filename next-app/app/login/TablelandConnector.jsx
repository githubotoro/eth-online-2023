"use client";

import { Database } from "@tableland/sdk";

export const connectDb = async () => {
	try {
		const tableName = "healthbot_80001_1"; // Our pre-defined health check table

		const db = new Database();

		const { results } = await db
			.prepare(`SELECT * FROM ${tableName};`)
			.all();

		console.log(results);
	} catch (err) {
		console.log(err);
	}
};

export const TablelandConnector = () => {
	return (
		<button
			onClick={() => {
				connectDb();
			}}
		>
			Connect DB
		</button>
	);
};
