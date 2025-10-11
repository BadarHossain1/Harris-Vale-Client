import React, { useState } from 'react';
import { BsPlay, BsPause, BsVolumeUp, BsVolumeMute } from 'react-icons/bs';

const VideoBanner = () => {
    const [isPlaying, setIsPlaying] = useState(true);
    const [isMuted, setIsMuted] = useState(true);
    const [videoRef, setVideoRef] = useState(null);

    // Handle video play/pause
    const togglePlay = () => {
        if (videoRef) {
            if (isPlaying) {
                videoRef.pause();
            } else {
                videoRef.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    // Handle mute/unmute
    const toggleMute = () => {
        if (videoRef) {
            videoRef.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    return (
        <div className="relative w-full overflow-auto" style={{ height: 'calc(100vh - 96px)' }}>
            {/* Background Video - Full coverage without zoom */}
            <video
                ref={setVideoRef}
                className="absolute top-0 left-0 w-full h-full  object-fill"
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                onLoadedData={() => setIsPlaying(true)}
            >
                <source src="/Adobe Express - Use_the_uploaded_202510100251.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>

            {/* Video Controls */}
            <div className="absolute bottom-6 right-6 z-20 flex space-x-3">
                {/* Play/Pause Button */}
                <button
                    onClick={togglePlay}
                    className="bg-black/50 backdrop-blur-md rounded-full p-3 border border-white/20 hover:bg-black/70 transition-all duration-300 group"
                    aria-label={isPlaying ? 'Pause video' : 'Play video'}
                >
                    {isPlaying ? (
                        <BsPause className="text-white/80 group-hover:text-white" size={16} />
                    ) : (
                        <BsPlay className="text-white/80 group-hover:text-white" size={16} />
                    )}
                </button>

                {/* Mute/Unmute Button */}
                <button
                    onClick={toggleMute}
                    className="bg-black/50 backdrop-blur-md rounded-full p-3 border border-white/20 hover:bg-black/70 transition-all duration-300 group"
                    aria-label={isMuted ? 'Unmute video' : 'Mute video'}
                >
                    {isMuted ? (
                        <BsVolumeMute className="text-white/80 group-hover:text-white" size={16} />
                    ) : (
                        <BsVolumeUp className="text-white/80 group-hover:text-white" size={16} />
                    )}
                </button>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce z-20">
                <div className="w-6 h-10 border-2 border-white/60 rounded-full flex justify-center">
                    <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse"></div>
                </div>
            </div>
        </div>
    );
};

export default VideoBanner;