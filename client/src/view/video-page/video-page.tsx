import React from 'react';
import VideoPlayer, {VideoPlayerProps, VideoType} from "../../component/video-player/video-player";

type VideoPageProps = {
    src: VideoPlayerProps['src']
}

const VideoPage = ({ src }: VideoPageProps) => {

    return (
        <VideoPlayer
            src={src}
            type={VideoType.MP4}
            onPlayHeadAdvance={() => {}}
            onVideoEnded={() => {}}
            onVideoStarted={() => {}}
        />
    )
};

export default VideoPage;