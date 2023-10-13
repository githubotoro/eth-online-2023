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
	homeTab: "CHATS",
	setHomeTab: (homeTab) => set({ homeTab }),
	chats: [],
	setChats: (chats) => set({ chats }),
	requests: [],
	setRequests: (requests) => set({ requests }),
	trigger: false,
	setTrigger: (trigger) => set({ trigger }),
}));
