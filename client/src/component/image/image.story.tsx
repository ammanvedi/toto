import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { Image } from './image';

const stories = storiesOf('Components', module);

stories.add(
    'Image',
    () => (
        <div>
            <Image src='https://i.imgur.com/Bj2tD15.jpg'/>
            <div>another image below ! scroll down !</div>
            <div style={{
                height: 500
            }} />
            <Image src='https://i.imgur.com/b7Nr5eX.gif'/>
        </div>

    ),
    { info: { inline: true } }
);