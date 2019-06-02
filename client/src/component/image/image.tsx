import React, { useState } from 'react';
import { ViewportAwareComponent } from "../viewport-aware-component/viewport-aware-component";
import styles from './image.module.scss';
import classNames from 'classnames';

type ImageProps = {
    src: string,
    alt?: string,
    className?: string,
    children?: React.ReactNode,
}

export const Image = ({
    src,
    className = styles['default-image'],
    children,
    alt
}: ImageProps) => {
    const [isLoaded, setIsLoaded] = useState(false);

    return (
        <ViewportAwareComponent>
            {visible => {
                return (
                    <div className={classNames(
                        className,
                        styles['image'],
                        isLoaded && styles['image--loaded'],
                    )} >
                        {visible ? (
                            <img
                                className={styles['image__img']}
                                src={src}
                                onLoad={() => setIsLoaded(true)}
                                alt={alt}
                            />
                        ) : children}
                    </div>
                );
            }}
        </ViewportAwareComponent>
    )
};