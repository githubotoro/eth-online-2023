"use client";

import React, { useEffect, useState, useRef } from "react";
import { useStore } from "@/store";
import { Web3Storage } from "web3.storage";

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

export const Test6 = () => {
	const CALLER_ADDRESS = "0xB038444E986c4d146053813231a0A0F95Db466E3";
	const RECEIVER_ADDRESS = "0xcf47799707316D911A767EE475bA771293DA9797";

	const [onCall, setOnCall] = useState(false);
	const [callType, setCallType] = useState(null);
	const [callData, setCallData] = useState(null);
	const [callAccepted, setCallAccepted] = useState(false);
	const [candidatePool, setCandidatePool] = useState([]);

	const { latestNotification, userSigner } = useStore();

	const localVideo = useRef();
	const peerVideo = useRef();

	const peerConnection = new RTCPeerConnection(StunServers);

	let localStream = null;
	let peerStream = null;

	console.log("callData is ", callData);

	const checkConnectionStatus = async () => {
		try {
			if (latestNotification === null) return;

			// storing message
			const receivedMessage = latestNotification.payload.data.amsg;

			// notification title
			const title = latestNotification.payload.data.asub;

			// address of notification sender
			const addressRegex = /0x[a-fA-F0-9]{40}/;
			const address = title.match(addressRegex)[0];

			// candidate regex
			const candidateRegex = /candidate/;
			const callingRegex = /calling/;
			const endedRegex = /ended/;
			const acceptedRegex = /accepted/;

			if (candidateRegex.test(title)) {
				const tempJson = JSON.parse(receivedMessage);
				console.log("candidate is ", tempJson.candidate);
				if (callAccepted === true) {
					const message = JSON.parse(receivedMessage);

					// add candidate to peer connection

					const candidate = new RTCIceCandidate(message);
					peerConnection.addIceCandidate(candidate);
				} else if (callType === "CALLER") {
					const message = JSON.parse(receivedMessage);

					// add candidate to pool
					const candidate = new RTCIceCandidate(message);
					setCandidatePool([...candidatePool, candidate]);
					// peerConnection.addIceCandidate(candidate);
				} else {
					const message = JSON.parse(receivedMessage);

					// add candidate to pool
					const candidate = new RTCIceCandidate(message);
					setCandidatePool([...candidatePool, candidate]);
				}
			} else if (callingRegex.test(title) && callAccepted === false) {
				// console.log("received message is ", receivedMessage);
				const ipfsClient = new Web3Storage({
					token: "",
				});
				const res = await ipfsClient.get(receivedMessage);
				const files = await res.files();

				const fileData = await files[0].text();

				// console.log("received text message is ", fileData);

				const message = JSON.parse(fileData);

				// console.log("decoded json message is ", message);

				setCallData(message);
				setOnCall(true);
				setCallType("RECEIVER");
			} else if (endedRegex.test(title)) {
				setOnCall(false);
				setCallType(null);
			} else if (acceptedRegex.test(title) && callAccepted === false) {
				// console.log("received message is ", receivedMessage);
				const ipfsClient = new Web3Storage({
					token: "",
				});
				const res = await ipfsClient.get(receivedMessage);
				const files = await res.files();

				const fileData = await files[0].text();

				const message = JSON.parse(fileData);

				if (
					!peerConnection.currentRemoteDescription &&
					message?.answer
				) {
					const answerDescription = new RTCSessionDescription(
						message.answer
					);
					console.log("answerDescription is ", answerDescription);
					peerConnection.setRemoteDescription(answerDescription);
				}

				setCallAccepted(true);
			}
		} catch (err) {
			console.log(err);
		}
	};

	useEffect(() => {
		checkConnectionStatus();
	}, [latestNotification]);

	useEffect(() => {
		if (callAccepted === true) {
			console.log("==========> adding ice candidates...");

			for (let i = 0; i < candidatePool.length; i++) {
				peerConnection.addIceCandidate(candidatePool[i]);
			}
		}
	}, [callAccepted]);

	const GetButtons = () => {
		if (onCall !== true) return;

		if (callType === "RECEIVER") {
			return (
				<div className="flex flex-row items-center justify-evenly w-full">
					<button
						onClick={async () => {
							try {
								// send ice candidates
								peerConnection.onicecandidate = async (
									event
								) => {
									if (event.candidate) {
										await fetch("/api/notify", {
											method: "POST",
											headers: {
												"Content-Type":
													"application/json",
											},
											body: JSON.stringify({
												recipient: CALLER_ADDRESS,
												notification: {
													title: `${
														userSigner.address
													} sent a candidate at ${new Date().getTime()}`,
													body: JSON.stringify(
														event.candidate.toJSON()
													),
												},
												payload: {
													title: `${
														userSigner.address
													} sent a candidate at ${new Date().getTime()}`,
													body: JSON.stringify(
														event.candidate.toJSON()
													),
													cta: ``,
													img: "",
												},
											}),
										});
									}
								};

								console.log(
									"======> offer is ",
									callData.offer
								);

								// get offer description
								const offerDescription = callData.offer;
								console.log(
									"=====> offer description is ",
									offerDescription
								);
								await peerConnection.setRemoteDescription(
									new RTCSessionDescription(offerDescription)
								);

								// get answer description
								const answerDescription =
									await peerConnection.createAnswer();
								await peerConnection.setLocalDescription(
									answerDescription
								);

								// create answer
								const answer = {
									type: answerDescription.type,
									sdp: answerDescription.sdp,
								};

								// create new call data
								const newCallData = {
									...callData,
									answer: answerDescription,
								};

								const ipfsClient = new Web3Storage({
									token: "",
								});

								const blob = new Blob(
									[JSON.stringify(newCallData)],
									{
										type: "application/json",
									}
								);

								const files = [new File([blob], "answer.json")];

								const cid = await ipfsClient.put(files);

								// send answer
								await fetch("/api/notify", {
									method: "POST",
									headers: {
										"Content-Type": "application/json",
									},
									body: JSON.stringify({
										recipient: CALLER_ADDRESS,
										notification: {
											title: `${
												userSigner.address
											} accepted the call at ${new Date().getTime()}`,
											body: `${cid}`,
										},
										payload: {
											title: `${
												userSigner.address
											} accepted the call at ${new Date().getTime()}`,
											body: `${cid}`,
											cta: ``,
											img: "",
										},
									}),
								});

								// call accepted
								setCallAccepted(true);
							} catch (err) {
								console.log(err);
							}
						}}
					>
						Accept
					</button>
					<button>End</button>
				</div>
			);
		} else if (callType === "CALLER") {
			return (
				<div className="flex flex-row items-center justify-evenly w-full">
					<button>End</button>
				</div>
			);
		}
	};

	return (
		<React.Fragment>
			<hr />
			<button
				onClick={async () => {
					try {
						// create streams
						if (userSigner.address === CALLER_ADDRESS) {
							localStream =
								await navigator.mediaDevices.getUserMedia({
									video: true,
									audio: false,
								});
						} else {
							localStream =
								await navigator.mediaDevices.getUserMedia({
									video: false,
									audio: true,
								});
						}

						peerStream = new MediaStream();

						// set local stream
						localStream.getTracks().forEach((track) => {
							peerConnection.addTrack(track, localStream);
						});

						// send stream to peer connection
						peerConnection.ontrack = (event) => {
							event.streams[0].getTracks().forEach((track) => {
								peerStream.addTrack(track);
							});
						};

						// show stream in browser
						localVideo.current.srcObject = localStream;
						peerVideo.current.srcObject = peerStream;
					} catch (err) {
						console.log(err);
					}
				}}
			>
				Start Video
			</button>
			<hr />
			<button
				onClick={async () => {
					try {
						// send ice candidates
						peerConnection.onicecandidate = async (event) => {
							if (event.candidate) {
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
											} sent a candidate at ${new Date().getTime()}`,
											body: JSON.stringify(
												event.candidate.toJSON()
											),
										},
										payload: {
											title: `${
												userSigner.address
											} sent a candidate at ${new Date().getTime()}`,
											body: JSON.stringify(
												event.candidate.toJSON()
											),
											cta: ``,
											img: "",
										},
									}),
								});
							}
						};

						// get offer
						const offerDescription =
							await peerConnection.createOffer();
						await peerConnection.setLocalDescription(
							offerDescription
						);

						// create offer
						const offer = {
							sdp: offerDescription.sdp,
							type: offerDescription.type,
						};

						// console.log(
						// 	"JSON format of offer is ",
						// 	JSON.stringify(offer)
						// );

						// console.log("offer is -- ", JSON.stringify(offer));

						const ipfsClient = new Web3Storage({
							token: "",
						});

						const blob = new Blob(
							[JSON.stringify({ offer: offerDescription })],
							{
								type: "application/json",
							}
						);

						const files = [new File([blob], "offer.json")];

						const cid = await ipfsClient.put(files);

						// send offer
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
									body: `${cid}`,
								},
								payload: {
									title: `${
										userSigner.address
									} is calling at ${new Date().getTime()}`,
									body: `${cid}`,
									cta: ``,
									img: "",
								},
							}),
						});

						// call is on
						setOnCall(true);
						setCallType("CALLER");
					} catch (err) {
						console.log(err);
					}
				}}
			>
				Make Call
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
			<hr />
			<button
				onClick={async () => {
					try {
						const ipfsClient = new Web3Storage({
							token: "",
						});

						const blob = new Blob(
							[
								JSON.stringify({
									sdp: "v=0\r\no=- 557110765548889892 2 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\na=group:BUNDLE 0 1\r\na=extmap-allow-mixed\r\na=msid-semantic: WMS ce5c5486-14bf-4047-b7c5-78b412b9153a\r\nm=audio 9 UDP/TLS/RTP/SAVPF 111 63 9 0 8 13 110 126\r\nc=IN IP4 0.0.0.0\r\na=rtcp:9 IN IP4 0.0.0.0\r\na=ice-ufrag:Uzag\r\na=ice-pwd:hhWgKD5/HOVtJ+RBfe6aTXBR\r\na=ice-options:trickle\r\na=fingerprint:sha-256 58:F2:C4:ED:E9:2C:64:88:C5:1B:93:C2:52:74:E6:95:8E:C6:6D:83:A5:BE:61:67:0D:4D:68:D0:5B:58:4B:53\r\na=setup:actpass\r\na=mid:0\r\na=extmap:1 urn:ietf:params:rtp-hdrext:ssrc-audio-level\r\na=extmap:2 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time\r\na=extmap:3 http://www.ietf.org/id/draft-holmer-rmcat-transport-wide-cc-extensions-01\r\na=extmap:4 urn:ietf:params:rtp-hdrext:sdes:mid\r\na=sendrecv\r\na=msid:ce5c5486-14bf-4047-b7c5-78b412b9153a 1736c342-b79b-4a41-a6d6-daebf5b054ce\r\na=rtcp-mux\r\na=rtpmap:111 opus/48000/2\r\na=rtcp-fb:111 transport-cc\r\na=fmtp:111 minptime=10;useinbandfec=1\r\na=rtpmap:63 red/48000/2\r\na=fmtp:63 111/111\r\na=rtpmap:9 G722/8000\r\na=rtpmap:0 PCMU/8000\r\na=rtpmap:8 PCMA/8000\r\na=rtpmap:13 CN/8000\r\na=rtpmap:110 telephone-event/48000\r\na=rtpmap:126 telephone-event/8000\r\na=ssrc:3132771543 cname:CMLzCMpcPetebKPP\r\na=ssrc:3132771543 msid:ce5c5486-14bf-4047-b7c5-78b412b9153a 1736c342-b79b-4a41-a6d6-daebf5b054ce\r\nm=video 9 UDP/TLS/RTP/SAVPF 96 97 102 103 104 105 106 107 108 109 127 125 39 40 45 46 98 99 100 101 112 113 116 117 118\r\nc=IN IP4 0.0.0.0\r\na=rtcp:9 IN IP4 0.0.0.0\r\na=ice-ufrag:Uzag\r\na=ice-pwd:hhWgKD5/HOVtJ+RBfe6aTXBR\r\na=ice-options:trickle\r\na=fingerprint:sha-256 58:F2:C4:ED:E9:2C:64:88:C5:1B:93:C2:52:74:E6:95:8E:C6:6D:83:A5:BE:61:67:0D:4D:68:D0:5B:58:4B:53\r\na=setup:actpass\r\na=mid:1\r\na=extmap:14 urn:ietf:params:rtp-hdrext:toffset\r\na=extmap:2 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time\r\na=extmap:13 urn:3gpp:video-orientation\r\na=extmap:3 http://www.ietf.org/id/draft-holmer-rmcat-transport-wide-cc-extensions-01\r\na=extmap:5 http://www.webrtc.org/experiments/rtp-hdrext/playout-delay\r\na=extmap:6 http://www.webrtc.org/experiments/rtp-hdrext/video-content-type\r\na=extmap:7 http://www.webrtc.org/experiments/rtp-hdrext/video-timing\r\na=extmap:8 http://www.webrtc.org/experiments/rtp-hdrext/color-space\r\na=extmap:4 urn:ietf:params:rtp-hdrext:sdes:mid\r\na=extmap:10 urn:ietf:params:rtp-hdrext:sdes:rtp-stream-id\r\na=extmap:11 urn:ietf:params:rtp-hdrext:sdes:repaired-rtp-stream-id\r\na=sendrecv\r\na=msid:ce5c5486-14bf-4047-b7c5-78b412b9153a 5f8b1bf4-6687-4fc8-bc2e-74a55a07a6f1\r\na=rtcp-mux\r\na=rtcp-rsize\r\na=rtpmap:96 VP8/90000\r\na=rtcp-fb:96 goog-remb\r\na=rtcp-fb:96 transport-cc\r\na=rtcp-fb:96 ccm fir\r\na=rtcp-fb:96 nack\r\na=rtcp-fb:96 nack pli\r\na=rtpmap:97 rtx/90000\r\na=fmtp:97 apt=96\r\na=rtpmap:102 H264/90000\r\na=rtcp-fb:102 goog-remb\r\na=rtcp-fb:102 transport-cc\r\na=rtcp-fb:102 ccm fir\r\na=rtcp-fb:102 nack\r\na=rtcp-fb:102 nack pli\r\na=fmtp:102 level-asymmetry-allowed=1;packetization-mode=1;profile-level-id=42001f\r\na=rtpmap:103 rtx/90000\r\na=fmtp:103 apt=102\r\na=rtpmap:104 H264/90000\r\na=rtcp-fb:104 goog-remb\r\na=rtcp-fb:104 transport-cc\r\na=rtcp-fb:104 ccm fir\r\na=rtcp-fb:104 nack\r\na=rtcp-fb:104 nack pli\r\na=fmtp:104 level-asymmetry-allowed=1;packetization-mode=0;profile-level-id=42001f\r\na=rtpmap:105 rtx/90000\r\na=fmtp:105 apt=104\r\na=rtpmap:106 H264/90000\r\na=rtcp-fb:106 goog-remb\r\na=rtcp-fb:106 transport-cc\r\na=rtcp-fb:106 ccm fir\r\na=rtcp-fb:106 nack\r\na=rtcp-fb:106 nack pli\r\na=fmtp:106 level-asymmetry-allowed=1;packetization-mode=1;profile-level-id=42e01f\r\na=rtpmap:107 rtx/90000\r\na=fmtp:107 apt=106\r\na=rtpmap:108 H264/90000\r\na=rtcp-fb:108 goog-remb\r\na=rtcp-fb:108 transport-cc\r\na=rtcp-fb:108 ccm fir\r\na=rtcp-fb:108 nack\r\na=rtcp-fb:108 nack pli\r\na=fmtp:108 level-asymmetry-allowed=1;packetization-mode=0;profile-level-id=42e01f\r\na=rtpmap:109 rtx/90000\r\na=fmtp:109 apt=108\r\na=rtpmap:127 H264/90000\r\na=rtcp-fb:127 goog-remb\r\na=rtcp-fb:127 transport-cc\r\na=rtcp-fb:127 ccm fir\r\na=rtcp-fb:127 nack\r\na=rtcp-fb:127 nack pli\r\na=fmtp:127 level-asymmetry-allowed=1;packetization-mode=1;profile-level-id=4d001f\r\na=rtpmap:125 rtx/90000\r\na=fmtp:125 apt=127\r\na=rtpmap:39 H264/90000\r\na=rtcp-fb:39 goog-remb\r\na=rtcp-fb:39 transport-cc\r\na=rtcp-fb:39 ccm fir\r\na=rtcp-fb:39 nack\r\na=rtcp-fb:39 nack pli\r\na=fmtp:39 level-asymmetry-allowed=1;packetization-mode=0;profile-level-id=4d001f\r\na=rtpmap:40 rtx/90000\r\na=fmtp:40 apt=39\r\na=rtpmap:45 AV1/90000\r\na=rtcp-fb:45 goog-remb\r\na=rtcp-fb:45 transport-cc\r\na=rtcp-fb:45 ccm fir\r\na=rtcp-fb:45 nack\r\na=rtcp-fb:45 nack pli\r\na=rtpmap:46 rtx/90000\r\na=fmtp:46 apt=45\r\na=rtpmap:98 VP9/90000\r\na=rtcp-fb:98 goog-remb\r\na=rtcp-fb:98 transport-cc\r\na=rtcp-fb:98 ccm fir\r\na=rtcp-fb:98 nack\r\na=rtcp-fb:98 nack pli\r\na=fmtp:98 profile-id=0\r\na=rtpmap:99 rtx/90000\r\na=fmtp:99 apt=98\r\na=rtpmap:100 VP9/90000\r\na=rtcp-fb:100 goog-remb\r\na=rtcp-fb:100 transport-cc\r\na=rtcp-fb:100 ccm fir\r\na=rtcp-fb:100 nack\r\na=rtcp-fb:100 nack pli\r\na=fmtp:100 profile-id=2\r\na=rtpmap:101 rtx/90000\r\na=fmtp:101 apt=100\r\na=rtpmap:112 H264/90000\r\na=rtcp-fb:112 goog-remb\r\na=rtcp-fb:112 transport-cc\r\na=rtcp-fb:112 ccm fir\r\na=rtcp-fb:112 nack\r\na=rtcp-fb:112 nack pli\r\na=fmtp:112 level-asymmetry-allowed=1;packetization-mode=1;profile-level-id=64001f\r\na=rtpmap:113 rtx/90000\r\na=fmtp:113 apt=112\r\na=rtpmap:116 red/90000\r\na=rtpmap:117 rtx/90000\r\na=fmtp:117 apt=116\r\na=rtpmap:118 ulpfec/90000\r\na=ssrc-group:FID 4274250194 487731890\r\na=ssrc:4274250194 cname:CMLzCMpcPetebKPP\r\na=ssrc:4274250194 msid:ce5c5486-14bf-4047-b7c5-78b412b9153a 5f8b1bf4-6687-4fc8-bc2e-74a55a07a6f1\r\na=ssrc:487731890 cname:CMLzCMpcPetebKPP\r\na=ssrc:487731890 msid:ce5c5486-14bf-4047-b7c5-78b412b9153a 5f8b1bf4-6687-4fc8-bc2e-74a55a07a6f1\r\n",
									type: "offer",
								}),
							],
							{
								type: "application/json",
							}
						);

						const files = [new File([blob], "test.json")];

						const cid = await ipfsClient.put(files);
						console.log("stored files with cid:", cid);
					} catch (err) {
						console.log(err);
					}
				}}
			>
				Upload JSON
			</button>

			<hr />
			<button
				onClick={async () => {
					const ipfsClient = new Web3Storage({
						token: "",
					});
					const res = await ipfsClient.get(
						"bafybeifkouxneeiu4f2kqtpvzzchanhccah5gdcxyfoqfpiuzxyzqkrsba"
					);
					const fileData = await res.text();
					const jsonData = JSON.parse(fileData);
					console.log(jsonData);
				}}
			>
				Get CID
			</button>
		</React.Fragment>
	);
};
