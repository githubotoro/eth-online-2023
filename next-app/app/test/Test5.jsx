"use client";

import React, { useEffect, useRef, useState } from "react";
import { useStore } from "@/store";

const StunServers = {
	iceServers: [
		{
			urls: [
				"stun:stun.l.google.com:19302",
				"stun:stun1.l.google.com:19302",
				"stun:stun2.l.google.com:19302",
				"stun:stun3.l.google.com:19302",
				"stun:stun4.l.google.com:19302",
			],
		},
	],
	iceCandidatePoolSize: 10,
};

export const Test5 = () => {
	const { latestNotification, userSigner } = useStore();
	const [peerCalling, setPeerCalling] = useState(false);
	const [onCall, setOnCall] = useState(false);
	const [userCalling, setUserCalling] = useState(false);
	const [streamMessage, setStreamMessage] = useState(null);
	const [peerAddress, setPeerAddress] = useState(null);

	const localVideo = useRef();
	const peerVideo = useRef();

	const peerConnection = new RTCPeerConnection(StunServers);

	let localStream = null;
	let remoteStream = null;

	const checkPeerAnswer = () => {
		if (userSigner !== null && !peerConnection.currentRemoteDescription) {
			const title = latestNotification.payload.data.asub;
			const addressRegex = /0x[a-fA-F0-9]{40}/;
			const caller = title.match(addressRegex)[0];

			const message = latestNotification.payload.data.amsg;
			const answer = JSON.parse(message);

			const answerDescription = new RTCSessionDescription(answer);
			peerConnection.setRemoteDescription(answerDescription);

			// const candidate = new RTCIceCandidate(change.doc.data());
			// pc.addIceCandidate(candidate);
		}
	};

	const checkPeerConnection = async () => {
		if (userSigner !== null) {
			const title = latestNotification.payload.data.asub;
			const addressRegex = /0x[a-fA-F0-9]{40}/;
			const caller = title.match(addressRegex)[0];

			console.log(`${caller} is calling...`);

			const message = latestNotification.payload.data.amsg;
			const offer = JSON.parse(message);

			const offerDescription = offer;
			await peerConnection.setRemoteDescription(
				new RTCSessionDescription(offerDescription)
			);

			const answerDescription = await peerConnection.createAnswer();
			await peerConnection.setLocalDescription(answerDescription);

			const answer = {
				type: answerDescription.type,
				sdp: answerDescription.sdp,
			};

			await fetch();
		}
	};

	const checkCallStatus = async () => {
		try {
			if (userSigner !== null) {
				const title = latestNotification.payload.data.asub;
				const addressRegex = /0x[a-fA-F0-9]{40}/;
				const peer = title.match(addressRegex)[0];

				const callingRegex = /calling/;
				const acceptedRegex = /accepted/;
				const endedRegex = /ended/;

				if (callingRegex.test(title)) {
					setPeerCalling(true);
					setPeerAddress(peer);
					setOnCall(true);
				} else if (acceptedRegex.test(title)) {
					// do something
				} else if (endedRegex.test(title) && onCall === true) {
					setOnCall(false);
					setPeerCalling(false);
					setUserCalling(false);
				}
			}
		} catch (err) {
			console.log(err);
		}
	};

	const GetButtons = () => {
		if (peerCalling === true) {
			<React.Fragment>
				<div className="flex flex-row justify-evenly w-full">
					<button
						onClick={async () => {
							try {
							} catch (err) {
								console.log(err);
							}
						}}
					>
						Accept
					</button>
					<button
						onClick={async () => {
							try {
								setPeerCalling(false);
								setOnCall(false);
							} catch (err) {
								console.log(err);
							}
						}}
					>
						End
					</button>
					<button>Video</button>
					<button>Audio</button>
				</div>
			</React.Fragment>;
		} else if (userCalling === true) {
			<React.Fragment>
				<div className="flex flex-row justify-evenly w-full">
					<button
						onClick={async () => {
							try {
								setUserCalling(false);
								setOnCall(false);
							} catch (err) {
								console.log(err);
							}
						}}
					>
						End
					</button>
					<button>Video</button>
					<button>Audio</button>
				</div>
			</React.Fragment>;
		}
	};

	useEffect(() => {
		checkCallStatus();
	}, [latestNotification]);

	return (
		<React.Fragment>
			<div>Video Test</div>
			<hr />
			<button
				onClick={async () => {
					try {
						// setting up
						localStream = await navigator.mediaDevices.getUserMedia(
							{ video: true, audio: true }
						);
						peerStream = new MediaStream();

						localStream.getTracks().forEach((track) => {
							peerConnection.addTrack(track, localStream);
						});

						peerConnection.ontrack = (event) => {
							event.streams[0].getTracks().forEach((track) => {
								peerStream.addTrack(track);
							});
						};

						localVideo.current.srcObject = localStream;
						peerVideo.current.srcObject = peerStream;

						// calling
						const offerDescription =
							await peerConnection.createOffer();
						await peerConnection.setLocalDescription(
							offerDescription
						);

						const offer = {
							sdp: offerDescription.sdp,
							type: offerDescription.type,
						};

						await fetch("/api/notify", {
							method: "POST",
							headers: {
								"Content-Type": "application/json",
							},
							body: JSON.stringify({
								recipient:
									"0xcf47799707316D911A767EE475bA771293DA9797",
								notification: {
									title: `${
										userSigner.address
									} is calling at ${new Date().getTime()}`,
									body: JSON.stringify(offer),
								},
								payload: {
									title: `${
										userSigner.address
									} is calling at ${new Date().getTime()}`,
									body: JSON.stringify(offer),
									cta: ``,
									img: "",
								},
							}),
						});

						setUserCalling(true);
						setOnCall(true);
					} catch (err) {
						console.log(err);
					}
				}}
			>
				Start Call
			</button>
			<hr />
			<div className="flex flex-row">
				<video
					ref={localVideo}
					className="w-1/2 aspect-square bg-isGreenLight object-cover"
					autoPlay
					playsInline
				></video>
				<video
					ref={peerVideo}
					className="w-1/2 aspect-square bg-isBlueLight object-cover"
					autoPlay
					playsInline
				></video>
			</div>
			<hr />
			<GetButtons />
		</React.Fragment>
	);
};
