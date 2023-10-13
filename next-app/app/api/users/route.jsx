import { db } from "@/firebase/config";
import {
	collection,
	getFirestore,
	doc,
	getDoc,
	getDocs,
	setDoc,
	deleteDoc,
} from "firebase/firestore";

export async function GET(req) {
	try {
		const querySnapshot = await getDocs(collection(db, "users"));

		let users = {};

		querySnapshot.forEach((doc) => {
			users[doc.id] = doc.data();
		});

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
