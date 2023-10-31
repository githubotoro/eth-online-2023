"use client";

import { useStore } from "@/store";
import React, { useEffect, useRef, useState } from "react";

import { db } from "@/firebase/video";
import {
	getFirestore,
	doc,
	collection,
	addDoc,
	getDocs,
	onSnapshot,
	getDoc,
	setDoc,
} from "firebase/firestore";
import { Phone, SquareStack } from "@/icons";
import clsx from "clsx";
import { ANIMATE } from "../Constants";

// if (!firebase.apps.length) {
// 	firebase.initializeApp(firebaseConfig);
// }

// firebase.initializeApp(firebaseConfig);

const servers = {
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
		{ urls: "stun:freeturn.net:5349" },
		{ urls: "stun:freeturn.net:3478" },
		{
			urls: "turn:freeturn.net:3478",
			username: "free",
			credential: "free",
		},
		{
			urls: "turns:freeturn.tel:5349",
			username: "free",
			credential: "free",
		},
		{
			urls: "stun:stun.relay.metered.ca:80",
		},
		{
			urls: "turn:a.relay.metered.ca:80",
			username: "334aa44472f04bbcf3d5418f",
			credential: "81IySF681Nlcbm0G",
		},
		{
			urls: "turn:a.relay.metered.ca:80?transport=tcp",
			username: "334aa44472f04bbcf3d5418f",
			credential: "81IySF681Nlcbm0G",
		},
		{
			urls: "turn:a.relay.metered.ca:443",
			username: "334aa44472f04bbcf3d5418f",
			credential: "81IySF681Nlcbm0G",
		},
		{
			urls: "turn:a.relay.metered.ca:443?transport=tcp",
			username: "334aa44472f04bbcf3d5418f",
			credential: "81IySF681Nlcbm0G",
		},
	],
	iceCandidatePoolSize: 10,
};

export const VideoConnector = () => {
	const [copying, setCopying] = useState(false);
	const delay = (milliseconds) => {
		return new Promise((resolve) => {
			setTimeout(resolve, milliseconds);
		});
	};

	const copyAddress = async (address) => {
		try {
			setCopying(true);
			await navigator.clipboard.writeText(address);
			await delay(1000);
			setCopying(false);
		} catch (err) {
			console.log(err);
		}
	};

	let pc = new RTCPeerConnection(servers);
	let localStream = null;
	let remoteStream = null;

	const webcamVideo = useRef();
	const remoteVideo = useRef();

	const {
		userSigner,
		latestNotification,
		peerAddress,
		setPeerAddress,
		onCall,
		setOnCall,
		callType,
		setCallType,
		isCaller,
		setIsCaller,
		isCallAccepted,
		setIsCallAccepted,
		callId,
		setCallId,
		peerUsername,
		setPeerUsername,
		username,
	} = useStore();

	const checkCallStatus = async () => {
		try {
			// console.log("latest notification is ", latestNotification);
			const title = latestNotification.payload.data.asub;
			const addressRegex = /0x[a-fA-F0-9]{40}/;
			const peer = title.match(addressRegex)[0];
			const message = latestNotification.payload.data.amsg;

			const callingRegex = /calling/;
			const videTypeRegex = /video/;
			const endedRegex = /ended/;

			if (callingRegex.test(title) && onCall === false) {
				if (videTypeRegex.test(title)) {
					setCallType("video");
				} else {
					setCallType("audio");
				}

				setOnCall(true);
				setPeerAddress(peer);

				const data = JSON.parse(message);
				console.log("data is ", data);

				setCallId(data.callId);
				setPeerUsername(data.peerUsername);
			} else if (endedRegex.test(title)) {
				if (isCallAccepted === true) {
					const stream = webcamVideo.current.srcObject;
					const tracks = stream.getTracks();

					tracks.forEach((track) => {
						track.stop();
					});

					webcamVideo.current.srcObject = null;
				}

				setOnCall(false);
				setCallType(null);
				setIsCaller(false);
				setIsCallAccepted(false);
				setPeerAddress(null);
				setCallId(null);
			}
		} catch (err) {
			console.log(err);
		}
	};

	const getMedias = async () => {
		try {
			// if (
			// 	userSigner.address ===
			// 	"0xB038444E986c4d146053813231a0A0F95Db466E3"
			// ) {
			// 	localStream = await navigator.mediaDevices.getUserMedia({
			// 		video: true,
			// 		audio: false,
			// 	});
			// } else {
			// 	localStream = await navigator.mediaDevices.getUserMedia({
			// 		video: false,
			// 		audio: true,
			// 	});
			// }

			if (callType === "audio") {
				localStream = await navigator.mediaDevices.getUserMedia({
					video: false,
					audio: true,
				});
			} else {
				localStream = await navigator.mediaDevices.getUserMedia({
					video: true,
					audio: true,
				});
			}

			remoteStream = new MediaStream();
			localStream.getTracks().forEach((track) => {
				pc.addTrack(track, localStream);
			});

			pc.ontrack = (event) => {
				event.streams[0].getTracks().forEach((track) => {
					remoteStream.addTrack(track);
				});
			};

			webcamVideo.current.srcObject = localStream;
			remoteVideo.current.srcObject = remoteStream;
		} catch (err) {
			console.log(err);
		}
	};

	const acceptCall = async () => {
		try {
			await getMedias();

			const callDocRef = doc(db, "calls", callId);
			const callDoc = await getDoc(callDocRef);

			const offerCandidates = collection(callDocRef, "offerCandidates");
			const answerCandidates = collection(callDocRef, "answerCandidates");

			pc.onicecandidate = async (event) => {
				if (event.candidate) {
					try {
						await addDoc(
							answerCandidates,
							event.candidate.toJSON()
						);
					} catch (err) {
						console.log(err);
					}
				}
			};

			const callData = callDoc.data();

			const offerDescription = callData.offer;
			await pc.setRemoteDescription(
				new RTCSessionDescription(offerDescription)
			);

			const answerDescription = await pc.createAnswer();
			await pc.setLocalDescription(answerDescription);

			const answer = {
				type: answerDescription.type,
				sdp: answerDescription.sdp,
			};

			await setDoc(
				doc(db, "calls", callId),
				{
					answer: answer,
				},
				{
					merge: true,
				}
			);

			onSnapshot(offerCandidates, (snapshot) => {
				snapshot.docChanges().forEach((change) => {
					if (change.type === "added") {
						const candidate = new RTCIceCandidate(
							change.doc.data()
						);
						pc.addIceCandidate(candidate);
					}
				});
			});

			setIsCallAccepted(true);
		} catch (err) {
			console.log(err);
		}
	};

	const makeCall = async () => {
		try {
			// onCall === true && isCaller === true
			if (
				onCall === true &&
				isCaller === true &&
				peerAddress !== null &&
				callType !== null
			) {
				await getMedias();

				const callDocRef = collection(db, "calls");
				const callDoc = await addDoc(callDocRef, { created: true });

				try {
					await fetch("/api/notify", {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							recipient: peerAddress,
							notification: {
								title: `${
									userSigner.address
								} is calling via ${callType} at ${new Date().getTime()}`,
								body: JSON.stringify({
									callId: callDoc.id,
									peerUsername: username,
								}),
							},
							payload: {
								title: `${
									userSigner.address
								} is calling via ${callType} at ${new Date().getTime()}`,
								body: JSON.stringify({
									callId: callDoc.id,
									peerUsername: username,
								}),
								cta: ``,
								img: "",
							},
						}),
					});
				} catch (err) {
					console.log(err);
				}

				const offerCandidates = collection(callDoc, "offerCandidates");
				const answerCandidates = collection(
					callDoc,
					"answerCandidates"
				);

				pc.onicecandidate = async (event) => {
					if (event.candidate) {
						try {
							await addDoc(
								offerCandidates,
								event.candidate.toJSON()
							);
						} catch (err) {
							console.log(err);
						}
					}
				};

				const offerDescription = await pc.createOffer();
				await pc.setLocalDescription(offerDescription);

				const offer = {
					sdp: offerDescription.sdp,
					type: offerDescription.type,
				};

				await setDoc(
					doc(callDocRef, callDoc.id),
					{
						offer: offer,
					},
					{
						merge: true,
					}
				);

				onSnapshot(callDoc, (snapshot) => {
					const data = snapshot.data();
					if (!pc.currentRemoteDescription && data.answer) {
						const answerDescription = new RTCSessionDescription(
							data.answer
						);
						pc.setRemoteDescription(answerDescription);
					}
				});

				onSnapshot(answerCandidates, (snapshot) => {
					snapshot.docChanges().forEach((change) => {
						if (change.type === "added") {
							const candidate = new RTCIceCandidate(
								change.doc.data()
							);
							pc.addIceCandidate(candidate);
						}
					});
				});
			}
		} catch (err) {
			console.log(err);
		}
	};

	const endCall = async () => {
		try {
			setOnCall(false);
			setCallType(null);
			setIsCaller(false);
			setIsCallAccepted(false);
			setPeerAddress(null);
			setCallId(null);

			if (localStream !== null) {
				const stream = webcamVideo.current.srcObject;
				const tracks = stream.getTracks();

				tracks.forEach((track) => {
					track.stop();
				});

				webcamVideo.current.srcObject = null;
			}

			await fetch("/api/notify", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					recipient: peerAddress,
					notification: {
						title: `${
							userSigner.address
						} ended the call at ${new Date().getTime()}`,
						body: ``,
					},
					payload: {
						title: `${
							userSigner.address
						} ended the call at ${new Date().getTime()}`,
						body: ``,
						cta: ``,
						img: "",
					},
				}),
			});
		} catch (err) {
			console.log(err);
		}
	};

	useEffect(() => {
		checkCallStatus();
	}, [latestNotification]);

	useEffect(() => {
		makeCall();
	}, [onCall, isCaller, peerAddress, callType]);

	console.log("remote stream is ", remoteStream);
	console.log("remote video is ", remoteVideo);

	// && peerAddress !== null
	if (onCall === true && peerAddress !== null) {
		return (
			<React.Fragment>
				{/* <button
					onClick={() => {
						makeCall();
					}}
				>
					Make Call
				</button> */}
				<hr className="bg-isSeparatorLight m-2" />
				<div className="p-2 pt-0">
					<div className="rounded-xl bg-isSystemLightSecondary p-2 drop-shadow-sm">
						<div className="flex flex-row space-x-2 items-center place-content-center">
							<div className="shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-isSystemLightTertiary to-isSystemDarkTertiary drop-shadow-sm mr-1"></div>

							<div
								className={clsx(
									" w-fit text-isSystemDarkTertiary font-700 text-center text-[1rem] shadow-sm bg-isWhite py-1 px-2 rounded-md",
									peerUsername === null ? "hidden" : ""
								)}
							>{`@${peerUsername}`}</div>

							<div className="pl-1 text-[0.9rem] truncate text-ellipsis font-600 text-isLabelLightSecondary max-w-[8rem]">
								{peerAddress}
							</div>
							<button
								disabled={copying === true}
								onClick={() => {
									copyAddress(peerAddress);
								}}
								className={clsx(
									"shrink-0",
									copying === true
										? "rotate-[360deg]"
										: "rotate-0",
									ANIMATE
								)}
							>
								{copying === true ? (
									<CheckCircle
										classes={clsx(
											"shrink-0 h-6 w-6 rounded-none fill-isGreenLight stroke-none drop-shadow-sm"
										)}
									/>
								) : (
									<SquareStack
										onClick={async () => {
											setCopying(true);
											await navigator.clipboard.writeText(
												peerAddress
											);
											await delay(1000);
											setCopying(false);
										}}
										classes={clsx(
											"shrink-0 h-6 w-6 rounded-none fill-isBlueLight drop-shadow-sm cursor-pointer"
										)}
									/>
								)}
							</button>
						</div>
					</div>
				</div>
				<div className="grow w-full px-2 relative">
					<div className="absolute top-0 left-0 px-2 w-full h-full">
						<video
							className={clsx(
								"w-full h-full bg-isBlueDark rounded-2xl shadow-sm object-cover",
								isCallAccepted === true ? "" : "hidden"
							)}
							ref={remoteVideo}
							autoPlay
							playsInline
						></video>
					</div>

					<video
						muted={true}
						className={clsx(
							"w-1/5 aspect-[3/4] z-40 bg-isGreenDark rounded-2xl shadow-sm absolute bottom-2 right-4 object-cover",
							isCallAccepted === true ? "" : "hidden"
						)}
						ref={webcamVideo}
						autoPlay
						playsInline
					></video>
					{/* <div className="bg-isWhite px-2 absolute w-full h-full top-0 left-0 z-10 text-isLabelLightSecondary font-700 text-lg">
						<div
							className={clsx(
								"w-full h-full  bg-isSystemLightTertiary animate-pulse rounded-2xl shadow-sm flex flex-col items-center place-content-center",
								isCallAccepted === false ||
									remoteStream === null
									? ""
									: "hidden"
							)}
						>
							<div className="w-full max-w-xs text-center">
								{isCaller === true
									? `Waiting for @ ${peerUsername} -- ${peerAddress.slice(
											0,
											5
									  )}...${peerAddress.slice(
											peerAddress.length - 3
									  )} to accept the call.`
									: `@ ${peerUsername} -- ${peerAddress.slice(
											0,
											5
									  )}...${peerAddress.slice(
											peerAddress.length - 3
									  )} is calling you.`}
							</div>
						</div>
					</div> */}
					<div
						className={clsx(
							"w-full h-full bg-isSystemLightSecondary rounded-2xl shadow-sm animate-pulse",
							isCallAccepted === false ? "" : "hidden"
						)}
					></div>
					<div
						className={clsx(
							"w-1/5 aspect-[3/4] bg-isWhite rounded-2xl shadow-sm absolute bottom-2 right-4 animate-pulse",
							isCallAccepted === false ? "" : "hidden"
						)}
					></div>
				</div>
				<hr className="bg-isSeparatorLight m-2" />
				<div className="flex flex-row bg-isSystemLightSecondary shrink-0 p-2 items-center place-content-center space-x-2">
					{isCallAccepted === false ? (
						<button
							onClick={() => {
								acceptCall();
							}}
							className={clsx(
								"rounded-xl shadow-sm p-2 h-12 w-12 bg-isGreenLight hover:bg-isGreenLightEmphasis",
								ANIMATE
							)}
						>
							<Phone classes={clsx("h-8 w-8 fill-isWhite")} />
						</button>
					) : (
						<></>
					)}

					<button
						onClick={() => {
							endCall();
						}}
						className={clsx(
							"rounded-xl shadow-sm p-2 h-12 w-12 bg-isRedLight hover:bg-isRedLightEmphasis ",
							ANIMATE
						)}
					>
						<Phone
							classes={clsx(
								"fill-isWhite rotate-[135deg] mt-[0.15rem]"
							)}
						/>
					</button>
				</div>
			</React.Fragment>
		);
	}
};
