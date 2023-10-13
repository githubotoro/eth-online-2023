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

export async function POST(req) {
	try {
		const body = await req.json();
		const invitesCollection = collection(db, "invites");

		if (body.inviteCode === undefined || body.inviteSecret === undefined) {
			return Response.json({
				code: 401,
				message: "unauthorized",
			});
		} else {
			if (body.inviteSecret !== process.env.INVITE_SECRET) {
				return Response.json({
					code: 401,
					message: "unauthorized",
				});
			} else {
				await setDoc(doc(invitesCollection, body.inviteCode), {});
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
