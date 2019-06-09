import React, { useRef, useEffect, useState } from 'react';

export enum VideoType {
    WEBM = 'video/webm',
    MP4 = 'video/mp4',
}

export type VideoPlayerProps = {
    src: string,
    type: VideoType,
    onPlayHeadAdvance: (playHeadPositionSecs: number) => void,
    onVideoEnded: () => void,
    onVideoStarted: () => void,
}

const VideoPlayer = ({
    src,
    type,
    onPlayHeadAdvance,
    onVideoEnded,
    onVideoStarted,
}: VideoPlayerProps) => {

    const player = useRef<HTMLVideoElement>(null);
    const [initialPlayEventFired, setInitialPlayEventFired] = useState(false);

    useEffect(() => {
        setInitialPlayEventFired(false);
    }, [src]);

    const onTimeUpdate = () => {
        if (player.current) {
            onPlayHeadAdvance(player.current.currentTime);
        }
    };

    const onPlay = () => {
        if (!initialPlayEventFired) {
            onVideoStarted();
            setInitialPlayEventFired(false);
        }
    };

    return (
        <video
            ref={player}
            onEnded={onVideoEnded}
            onTimeUpdate={onTimeUpdate}
            onPlay={onPlay}
            controls
        >
            <source src={src} type={type} />
        </video>
    )
};

export default VideoPlayer;