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
}));
