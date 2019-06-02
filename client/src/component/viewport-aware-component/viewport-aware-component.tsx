import React from 'react';
import { useRef, useEffect } from 'react';
import { useObserver } from "./use-observer";

type ViewportAwareComponentProps = {
    children: (visible: boolean) => React.ReactNode,

}

export const ViewportAwareComponent = ({ children }: ViewportAwareComponentProps) => {
    const [isVisible, setRef] = useObserver();
    const componentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!componentRef.current) {
            return;
        }
        setRef(componentRef.current);
    });


    return (
        <div ref={componentRef} >
            {children(isVisible)}
        </div>
    )
};