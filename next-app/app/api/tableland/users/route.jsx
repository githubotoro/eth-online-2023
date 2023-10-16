import { Database } from "@tableland/sdk";
import { Wallet, getDefaultProvider } from "ethers";

const wallet = new Wallet(process.env.TABLELAND_KEY);
const provider = getDefaultProvider(process.env.ALCHEMY_PROVIDER);
const signer = wallet.connect(provider);
const db = new Database({ signer });
const tableName = "users_80001_7753";

export async function GET(req) {
	try {
		const { results } = await db
			.prepare(`SELECT * FROM ${tableName};`)
			.all();

		console.log(results);

		return Response.json({
			code: 201,
			message: "success",
			users: users,
		});
	} catch (err) {
		return Response.json({
			code: 403,
			message: "something went wrong",
			err: err,
		});
	}
}

export async function POST(req) {
	try {
		const body = await req.json();
		const usersCollection = collection(db, "users");
		const invitesCollection = collection(db, "invites");

		if (body.inviteCode === undefined) {
			return Response.json({
				code: 401,
				message: "unauthorized",
			});
		} else {
			const inviteCodeExists = await getDoc(
				doc(invitesCollection, body.inviteCode)
			);

			if (!inviteCodeExists.exists()) {
				return Response.json({
					code: 401,
					message: "unauthorized",
				});
			} else {
				await setDoc(
					doc(usersCollection, body.id),
					{
						username: body.username,
					},
					{
						merge: true,
					}
				);

				await deleteDoc(doc(invitesCollection, body.inviteCode));

				return Response.json({
					code: 201,
					message: "success",
				});
			}
		}
	} catch (err) {
		return Response.json({
			code: 403,
			message: "something went wrong",
			err: err,
		});
	}
}
