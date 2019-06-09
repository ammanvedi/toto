import * as React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from "@storybook/addon-actions";
import VideoPlayer, {VideoType} from './video-player';

const stories = storiesOf('Components', module);

stories.add(
    'VideoPlayer',
    () => (
        <VideoPlayer
            onPlayHeadAdvance={action('onPlayheadAdvance')}
            onVideoEnded={action('onVideoEnded')}
            onVideoStarted={action('onVideoStarted')}
            type={VideoType.MP4}
            src='https://interactive-examples.mdn.mozilla.net/media/examples/flower.mp4' />
    ),
    { info: { inline: true } }
);