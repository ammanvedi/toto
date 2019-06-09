import React from 'react';
import {LibraryFeature, LibrarySeries} from "../../../../types/API";
import Thumb from "../thumb/thumb";
import {getThumbPropsFromFeature} from "../../helper/library-feature-helper";

import styles from './thumb-list.module.scss';

type ThumbListProps = {
    title: string,
    items: Array<LibraryFeature | LibrarySeries>,
    itemClicked: (item: LibraryFeature | LibrarySeries) => void,
}

export const ThumbList = ({ title, items, itemClicked }: ThumbListProps) => (
    <section className={styles['thumb-list']}>
        <h1 className={styles['thumb-list__title']} >{title}</h1>
        <ul className={styles['thumb-list__list']}>
            {items.map(item => (
                <li key={item.imdbID} className={styles['thumb-list__item']}>
                    <Thumb {...getThumbPropsFromFeature(item)} onClick={() => itemClicked(item)} />
                </li>
            ))}
        </ul>
    </section>
);
