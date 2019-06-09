import React from 'react';
import styles from './thumb.module.scss';
import {Image} from "../image/image";

export type ThumbProps = {
    posterUrl: string,
    watchedPercentage: number,
    onClick?: () => void,
};

const Thumb = ({ posterUrl, watchedPercentage, onClick }: ThumbProps) => (
    <div className={styles.thumb} onClick={onClick}>
        <Image src={posterUrl} className={styles['thumb__image']} />
    </div>

);

export default Thumb;