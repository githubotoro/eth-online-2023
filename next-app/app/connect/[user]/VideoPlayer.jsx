import { useEffect, useRef } from "react";

const VideoPlayer = ({ stream, isMuted }) => {
	const videoRef = useRef(null);

	useEffect(() => {
		if (videoRef.current) {
			videoRef.current.srcObject = stream;
			videoRef.current.play();
		}
	}, [videoRef, stream]);

	return (
		<video
			ref={videoRef}
			muted={isMuted}
			autoPlay
			className="w-36 aspect-square border-2 border-black"
		/>
	);
};

export default VideoPlayer;
