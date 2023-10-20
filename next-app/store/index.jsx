import { PushAPI } from "@pushprotocol/restapi";
import { create } from "zustand";

export const useStore = create((set) => ({
	pushSocket: null,
	setPushSocket: (pushSocket) => set({ pushSocket }),
	isPushSocketConnected: false,
	setIsPushSocketConnected: (isPushSocketConnected) =>
		set({ isPushSocketConnected }),
	latestFeedItem: null,
	setLatestFeedItem: (latestFeedItem) => set({ latestFeedItem }),
	// videoData: PushAPI.video.initVideoCallData,
	setVideoData: (videoData) => set({ videoData }),
	instanceProvider: null,
	setInstanceProvider: (instanceProvider) => set({ instanceProvider }),
	currUser: null,
	setCurrUser: (currUser) => set({ currUser }),
	userSigner: null,
	setUserSigner: (userSigner) => set({ userSigner }),
	username: "",
	setUsername: (username) => set({ username }),
	isConnecting: true,
	setIsConnecting: (isConnecting) => set({ isConnecting }),
	userFound: false,
	setUserFound: (userFound) => set({ userFound }),
	confirmingIdentity: false,
	setConfirmingIdentity: (confirmingIdentity) => set({ confirmingIdentity }),
	isRegistering: false,
	setIsRegistering: (isRegistering) => set({ isRegistering }),
	inviteCode: "",
	setInviteCode: (inviteCode) => set({ inviteCode }),
	homeTab: "chats",
	setHomeTab: (homeTab) => set({ homeTab }),
	chats: [],
	setChats: (chats) => set({ chats }),
	requests: [],
	setRequests: (requests) => set({ requests }),
	trigger: false,
	setTrigger: (trigger) => set({ trigger }),
	xmtpClient: null,
	setXmtpClient: (xmtpClient) => set({ xmtpClient }),
	chatNetwork: "XMTP",
	setChatNetwork: (chatNetwork) => set({ chatNetwork }),
	xmtpTrigger: false,
	setXmtpTrigger: (xmtpTrigger) => set({ xmtpTrigger }),
	pushNotificationSocket: null,
	setPushNotificationSocket: (pushNotificationSocket) =>
		set({ pushNotificationSocket }),
	notificationFeed: null,
	setNotificationFeed: (notificationFeed) => set({ notificationFeed }),
	xmtpMessageIncoming: false,
	setXmtpMessageIncoming: (xmtpMessageIncoming) =>
		set({ xmtpMessageIncoming }),
	latestNotification: false,
	setLatestNotification: (latestNotification) => set({ latestNotification }),
	ogAddress: null,
	setOgAddress: (ogAddress) => set({ ogAddress }),
	web3Bio: [],
	setWeb3Bio: (web3Bio) => set({ web3Bio }),
	fetchingBio: true,
	setFetchingBio: (fetchingBio) => set({ fetchingBio }),
	peerAddress: null,
	setPeerAddress: (peerAddress) => set({ peerAddress }),
	onCall: false,
	setOnCall: (onCall) => set({ onCall }),
	callType: null,
	setCallType: (callType) => set({ callType }),
	isCaller: false,
	setIsCaller: (isCaller) => set({ isCaller }),
	isCallAccepted: false,
	setIsCallAccepted: (isCallAccepted) => set({ isCallAccepted }),
	callId: null,
	setCallId: (callId) => set({ callId }),
}));
