import React from 'react';
import styles from './thumb.module.scss';
import {Image} from "../image/image";

export type ThumbProps = {
    posterUrl: string,
    watchedPercentage: number,

};

const Thumb = ({ posterUrl, watchedPercentage }: ThumbProps) => (
    <Image src={posterUrl} />
);

export default Thumb;