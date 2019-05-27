import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import Thumb from './thumb';

const stories = storiesOf('Components', module);

stories.add(
    'Thumb',
    () => <Thumb />,
    { info: { inline: true } }
);