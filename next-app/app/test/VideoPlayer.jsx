import { useEffect, useRef } from "react";

const VideoPlayer = ({ stream, isMuted }) => {
	console.log("stream is ", stream);

	const videoRef = useRef(null);

	useEffect(() => {
		if (videoRef.current) {
			videoRef.current.srcObject = stream;
			videoRef.current.play();
		}
	}, [videoRef, stream]);

	return (
		<video
			className="w-1/2 aspect-square bg-isRedDark"
			ref={videoRef}
			muted={isMuted}
			autoPlay
		/>
	);
};

export default VideoPlayer;
