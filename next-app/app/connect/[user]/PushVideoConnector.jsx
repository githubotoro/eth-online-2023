"use client";

import { env } from "./Constants";
import * as PushAPI from "@pushprotocol/restapi";
import { produce } from "immer";
import { useEffect, useRef, useState } from "react";
import VideoPlayer from "./VideoPlayer";
import { ADDITIONAL_META_TYPE } from "@pushprotocol/restapi/src/lib/payloads/constants";
import { useStore } from "@/store";

const PushVideoConnector = ({ recipientAddress }) => {
	const {
		currUser,
		userSigner,
		latestFeedItem,
		pushSocket,
		isPushSocketConnected,
	} = useStore();

	const videoObjectRef = useRef(null);

	const [data, setData] = useState(PushAPI.video.initVideoCallData);

	console.log("data is  ", data);

	const setRequestVideoCall = async () => {
		if (!currUser) return;

		const user = await PushAPI.user.get({
			account: userSigner.address,
			env,
		});

		console.log("requesting video call");

		let pgpPrivateKey = null;

		if (user?.encryptedPrivateKey) {
			pgpPrivateKey = await PushAPI.chat.decryptPGPKey({
				encryptedPGPPrivateKey: user.encryptedPrivateKey,
				account: userSigner.address,
				signer: userSigner,
				env,
			});
		}
		const response = await PushAPI.chat.chats({
			account: userSigner.address,
			toDecrypt: true,
			pgpPrivateKey: pgpPrivateKey,
			env,
		});

		// if (currUser?.encryptedPrivateKey) {
		// 	pgpPrivateKey = await PushAPI.chat.decryptPGPKey({
		// 		encryptedPGPPrivateKey: currUser.encryptedPrivateKey,
		// 		account: userSigner.address,
		// 		signer: userSigner,
		// 		env,
		// 	});
		// }

		// const response = await PushAPI.chat.chats({
		// 	account: userSigner.address,
		// 	toDecrypt: true,
		// 	pgpPrivateKey: currUser.decryptedPgpPvtKey,
		// 	env,
		// });

		let chatId = "";
		response.forEach((chat) => {
			if (chat.did === "eip155:" + recipientAddress) {
				chatId = chat.chatId;
			}
		});

		console.log("chat id is ", chatId);

		if (!chatId) return;

		// update the video call 'data' state with the outgoing call data
		videoObjectRef.current?.setData((oldData) => {
			return produce(oldData, (draft) => {
				draft.local.address = userSigner.address;
				draft.incoming[0].address = recipientAddress;
				draft.incoming[0].status = PushAPI.VideoCallStatus.INITIALIZED;
				draft.meta.chatId = chatId;
			});
		});

		console.log("recipientAddress is ", recipientAddress);

		console.log("about to start video");

		// start the local media stream
		await videoObjectRef.current?.create({ video: true, audio: true });

		console.log("video object ref is ", videoObjectRef.current);
	};

	const setIncomingVideoCall = async (videoCallMetaData) => {
		// update the video call 'data' state with the incoming call data
		videoObjectRef.current?.setData((oldData) => {
			return produce(oldData, (draft) => {
				draft.local.address = videoCallMetaData.recipientAddress;
				draft.incoming[0].address = videoCallMetaData.senderAddress;
				draft.incoming[0].status = PushAPI.VideoCallStatus.RECEIVED;
				draft.meta.chatId = videoCallMetaData.chatId;
				draft.meta.initiator.address = videoCallMetaData.senderAddress;
				draft.meta.initiator.signal = videoCallMetaData.signalData;
			});
		});

		// start the local media stream
		await videoObjectRef.current?.create({ video: true, audio: true });
	};

	const acceptVideoCallRequest = async () => {
		if (!data.local.stream) return;

		await videoObjectRef.current?.acceptRequest({
			signalData: data.meta.initiator.signal,
			senderAddress: data.local.address,
			recipientAddress: data.incoming[0].address,
			chatId: data.meta.chatId,
		});
	};

	const connectHandler = ({ signalData, senderAddress }) => {
		videoObjectRef.current?.connect({
			signalData,
			peerAddress: senderAddress,
		});
	};

	useEffect(() => {
		if (!pushSocket?.connected) {
			pushSocket?.connect();
		}
	}, [pushSocket]);

	// initialize video call object
	useEffect(() => {
		if (!userSigner) return;

		(async () => {
			if (!currUser) return;

			const user = await PushAPI.user.get({
				account: userSigner.address,
				env,
			});

			let pgpPrivateKey = null;

			if (user?.encryptedPrivateKey) {
				pgpPrivateKey = await PushAPI.chat.decryptPGPKey({
					encryptedPGPPrivateKey: user.encryptedPrivateKey,
					account: userSigner.address,
					signer: userSigner,
					env,
				});
			}

			videoObjectRef.current = new PushAPI.video.Video({
				signer: userSigner,
				chainId: 5,
				pgpPrivateKey,
				env,
				setData,
			});

			// if (currUser?.encryptedPrivateKey) {
			// 	pgpPrivateKey = await PushAPI.chat.decryptPGPKey({
			// 		encryptedPGPPrivateKey: user.encryptedPrivateKey,
			// 		account: userSigner.address,
			// 		signer: userSigner,
			// 		env,
			// 	});
			// }

			// videoObjectRef.current = new PushAPI.video.Video({
			// 	signer: userSigner,
			// 	chainId: 5,
			// 	pgpPrivateKey: currUser.decryptedPgpPvtKey,
			// 	env,
			// 	setData,
			// });
		})();
	}, [userSigner]);

	// after setRequestVideoCall, if local stream is ready, we can fire the request()
	useEffect(() => {
		(async () => {
			const currentStatus = data.incoming[0].status;

			console.log("stream status is ", currentStatus);

			if (
				data.local.stream &&
				currentStatus === PushAPI.VideoCallStatus.INITIALIZED
			) {
				await videoObjectRef.current?.request({
					senderAddress: data.local.address,
					recipientAddress: data.incoming[0].address,
					chatId: data.meta.chatId,
				});
			}
		})();
	}, [
		data.incoming,
		data.local.address,
		data.local.stream,
		data.meta.chatId,
	]);

	// receive video call notifications
	useEffect(() => {
		if (!isPushSocketConnected || !latestFeedItem) return;

		const { payload } = latestFeedItem || {};

		// check for additionalMeta
		if (
			!Object.prototype.hasOwnProperty.call(payload, "data") ||
			!Object.prototype.hasOwnProperty.call(
				payload["data"],
				"additionalMeta"
			)
		)
			return;

		const additionalMeta = payload["data"]["additionalMeta"];
		console.log("RECEIVED ADDITIONAL META", additionalMeta);
		if (!additionalMeta) return;

		// check for PUSH_VIDEO
		if (additionalMeta.type !== `${ADDITIONAL_META_TYPE.PUSH_VIDEO}+1`)
			return;
		const videoCallMetaData = JSON.parse(additionalMeta.data);
		console.log("RECIEVED VIDEO DATA", videoCallMetaData);

		if (videoCallMetaData.status === PushAPI.VideoCallStatus.INITIALIZED) {
			setIncomingVideoCall(videoCallMetaData);
		} else if (
			videoCallMetaData.status === PushAPI.VideoCallStatus.RECEIVED ||
			videoCallMetaData.status === PushAPI.VideoCallStatus.RETRY_RECEIVED
		) {
			connectHandler(videoCallMetaData);
		} else if (
			videoCallMetaData.status === PushAPI.VideoCallStatus.DISCONNECTED
		) {
			window.location.reload();
		} else if (
			videoCallMetaData.status ===
				PushAPI.VideoCallStatus.RETRY_INITIALIZED &&
			videoObjectRef.current?.isInitiator()
		) {
			videoObjectRef.current?.request({
				senderAddress: data.local.address,
				recipientAddress: data.incoming[0].address,
				chatId: data.meta.chatId,
				retry: true,
			});
		} else if (
			videoCallMetaData.status ===
				PushAPI.VideoCallStatus.RETRY_INITIALIZED &&
			!videoObjectRef.current?.isInitiator()
		) {
			videoObjectRef.current?.acceptRequest({
				signalData: videoCallMetaData.signalingData,
				senderAddress: data.local.address,
				recipientAddress: data.incoming[0].address,
				chatId: data.meta.chatId,
				retry: true,
			});
		}
	}, [latestFeedItem]);

	return (
		<div className="flex flex-col w-full">
			<div>Video Call Status: {data.incoming[0].status}</div>

			<div className="flex flex-row w-full space-x-3">
				<button
					disabled={
						data.incoming[0].status !==
						PushAPI.VideoCallStatus.UNINITIALIZED
					}
					onClick={setRequestVideoCall}
				>
					Request
				</button>
				|
				<button
					disabled={
						data.incoming[0].status !==
						PushAPI.VideoCallStatus.RECEIVED
					}
					onClick={acceptVideoCallRequest}
				>
					Accept Request
				</button>
				|
				<button
					disabled={
						data.incoming[0].status ===
						PushAPI.VideoCallStatus.UNINITIALIZED
					}
					onClick={() =>
						videoObjectRef.current?.disconnect({
							peerAddress: data.incoming[0].address,
						})
					}
				>
					Disconect
				</button>
				|
				<button
					disabled={
						data.incoming[0].status ===
						PushAPI.VideoCallStatus.UNINITIALIZED
					}
					onClick={() =>
						videoObjectRef.current?.enableVideo({
							state: !data.local.video,
						})
					}
				>
					Toggle Video
				</button>
				|
				<button
					disabled={
						data.incoming[0].status ===
						PushAPI.VideoCallStatus.UNINITIALIZED
					}
					onClick={() =>
						videoObjectRef.current?.enableAudio({
							state: !data.local.audio,
						})
					}
				>
					Toggle Audio
				</button>
			</div>

			<div className="w-full flex flex-row space-x-3">
				<div>LOCAL VIDEO: {data.local.video ? "TRUE" : "FALSE"}</div>
				<div>LOCAL AUDIO: {data.local.audio ? "TRUE" : "FALSE"}</div>
				<div>
					INCOMING VIDEO:
					{data.incoming[0].video ? "TRUE" : "FALSE"}
				</div>
				<div>
					INCOMING AUDIO:
					{data.incoming[0].audio ? "TRUE" : "FALSE"}
				</div>
			</div>

			<div className="flex flex-row w-full space-x-3">
				<VideoPlayer stream={data.local.stream} isMuted={true} />
				<VideoPlayer stream={data.incoming[0].stream} isMuted={false} />
			</div>
		</div>
	);
};

export default PushVideoConnector;
