import { useState } from 'react';

import singleComponentObserver from './single-component-observer';

type useObserverTuple = [boolean, (el: Element) => void];

export const useObserver = (): useObserverTuple => {
    const [ isVisible, setIsVisible ] = useState(false);

    const setRef = (ref: Element) => {
        if (isVisible) {
            return;
        }
        singleComponentObserver.observe(ref, () => setIsVisible(true));
    };

    return [
        isVisible,
        setRef
    ]
};