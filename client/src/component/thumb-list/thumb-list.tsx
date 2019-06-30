import React from 'react';
import Thumb, {ThumbProps} from "../thumb/thumb";
import {getThumbPropsFromFeature} from "../../helper/library-feature-helper";

import styles from './thumb-list.module.scss';

type ThumbListProps = {
    title: string,
    items: Array<ThumbProps>,
    itemClicked: (id: string) => void,
}

export const ThumbList = ({ title, items, itemClicked }: ThumbListProps) => (
    <section className={styles['thumb-list']}>
        <h1 className={styles['thumb-list__title']} >{title}</h1>
        <ul className={styles['thumb-list__list']}>
            {items.map(item => (
                <li key={item.id} className={styles['thumb-list__item']}>
                    <Thumb {...item} onClick={() => itemClicked(item.id)} />
                </li>
            ))}
        </ul>
    </section>
);
