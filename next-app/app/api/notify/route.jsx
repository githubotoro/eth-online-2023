import * as PushAPI from "@pushprotocol/restapi";
import * as ethers from "ethers";

const _signer = new ethers.Wallet(process.env.PUSH_CHANNEL_KEY);

export async function POST(req) {
	try {
		const body = await req.json();

		const apiResponse = await PushAPI.payloads.sendNotification({
			signer: _signer,
			recipients: `eip155:5:${body.recipient}`,
			senderType: 0,
			type: 3, // target
			identityType: 2, // direct payload
			notification: body.notification,
			payload: body.payload,
			channel: "eip155:5:0xaC7cD662FD84C8D14a18c65ADE38326fF95521e7", // eth-line address
			env: "staging",
		});

		return Response.json({
			code: 201,
			message: "success",
		});
	} catch (err) {
		return Response.json({
			code: 403,
			message: "something went wrong",
			err: err,
		});
	}
}
