"use client";

import * as PushAPI from "@pushprotocol/restapi";
import { ENV } from "@pushprotocol/restapi/src/lib/constants";
import { produce } from "immer";
import { useAccount, useNetwork, useSigner } from "wagmi";
import React, { useEffect, useRef, useState } from "react";
import { ADDITIONAL_META_TYPE } from "@pushprotocol/restapi/src/lib/payloads/constants";
import { env } from "@/components/Constants";
import { useStore } from "@/store";
import { useParams } from "next/navigation";
import VideoPlayer from "./VideoPlayer";

export const Test7 = () => {
	const { userSigner, isPushSocketConnected, latestFeedItem, pushSocket } =
		useStore();

	const videoObjectRef = useRef();
	const recipientAddressRef = useRef(null);

	const [data, setData] = useState(PushAPI.video.initVideoCallData);

	const setRequestVideoCall = async () => {
		const user = await PushAPI.user.get({
			account: userSigner.address,
			env,
		});

		console.log("user is ", user);

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

		let chatId = "";
		response.forEach((chat) => {
			if (chat.did === "eip155:" + recipientAddressRef?.current?.value) {
				chatId = chat.chatId;
			}
		});

		console.log("chat id is ", chatId);

		if (!chatId) return;

		// update the video call 'data' state with the outgoing call data
		videoObjectRef.current?.setData((oldData) => {
			return produce(oldData, (draft) => {
				if (!recipientAddressRef || !recipientAddressRef.current)
					return;

				draft.local.address = userSigner.address;
				draft.incoming[0].address = recipientAddressRef.current.value;
				draft.incoming[0].status = PushAPI.VideoCallStatus.INITIALIZED;
				draft.meta.chatId = chatId;
			});
		});

		// start the local media stream
		await videoObjectRef.current?.create({ video: true, audio: true });
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

	// initialize video call object
	useEffect(() => {
		if (!userSigner) return;

		(async () => {
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
				signer: userSigner.address,
				chainId: 5,
				pgpPrivateKey,
				env,
				setData,
			});
		})();
	}, [userSigner]);

	// useEffect(() => {
	// 	if (
	// 		userSigner.address === "0xe4777c6d98D007B6d837971Cfb77E3934e71fE8c"
	// 	) {
	// 		recipientAddressRef?.current.value =
	// 			"0xB038444E986c4d146053813231a0A0F95Db466E3";
	// 	} else if (
	// 		userSigner.address === "0xB038444E986c4d146053813231a0A0F95Db466E3"
	// 	) {
	// 		recipientAddressRef?.current.value =
	// 			"0xe4777c6d98D007B6d837971Cfb77E3934e71fE8c";
	// 	}
	// }, [userSigner]);

	useEffect(() => {
		(async () => {
			const currentStatus = data.incoming[0].status;

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
		<React.Fragment>
			<hr />
			<input
				ref={recipientAddressRef}
				placeholder="recipient address"
				type="text"
			/>
			<hr />

			<button
				disabled={
					data.incoming[0].status !==
					PushAPI.VideoCallStatus.UNINITIALIZED
				}
				onClick={setRequestVideoCall}
			>
				Request
			</button>

			<button
				disabled={
					data.incoming[0].status !== PushAPI.VideoCallStatus.RECEIVED
				}
				onClick={acceptVideoCallRequest}
			>
				Accept Request
			</button>

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
			<hr />
			<div className="flex flex-row space-x-2">
				<VideoPlayer stream={data.local.stream} />

				<VideoPlayer stream={data.incoming[0].stream} />
			</div>

			<hr />
		</React.Fragment>
	);
};
