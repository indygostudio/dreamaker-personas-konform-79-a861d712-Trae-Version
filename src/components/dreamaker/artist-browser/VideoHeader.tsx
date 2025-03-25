import { useRef, useEffect } from "react";

export const VideoHeader = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.error("Video playback error:", error);
      });

      videoRef.current.addEventListener('loadedmetadata', () => {
        videoRef.current?.play().catch(error => {
          console.error("Video playback error after load:", error);
        });
      });
    }

    return () => {
      if (videoRef.current) {
        videoRef.current.removeEventListener('loadedmetadata', () => {});
      }
    };
  }, []);

  return (
    <div className="relative h-[60vh] overflow-hidden">
      <video 
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        src="/Videos/ROTATING EYE.mp4"
        muted
        loop
        playsInline
        autoPlay
        onError={(e) => console.error("Video error:", e)}
      >
        Your browser does not support the video tag.
      </video>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black" />
    </div>
  );
};