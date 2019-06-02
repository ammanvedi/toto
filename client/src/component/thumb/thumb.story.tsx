import * as React from 'react';
import { storiesOf } from '@storybook/react';
import Thumb from './thumb';

const stories = storiesOf('Components', module);

stories.add(
    'Thumb',
    () => <Thumb posterUrl={'abc'} watchedPercentage={0} />,
    { info: { inline: true } }
);