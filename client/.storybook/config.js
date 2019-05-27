import { configure } from '@storybook/react';
import '!style-loader!css-loader!sass-loader!../src/index.scss';

// automatically import all files ending in *.stories.js
const req = require.context('../', true, /\.(stories|story)\.tsx$/);
function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);