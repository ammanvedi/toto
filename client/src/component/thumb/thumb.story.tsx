import * as React from 'react';
import { storiesOf } from '@storybook/react';
import Thumb from './thumb';

const stories = storiesOf('Components', module);

stories.add(
    'Thumb',
    () => (
        <div style={{width: 200}}>
            <Thumb
                id='123'
                posterUrl='https://i.imgur.com/Bj2tD15.jpg'
                watchedPercentage={0} />
        </div>
    ),

    { info: { inline: true } }
);