import React from 'react';
import {LibraryFeature, LibrarySeries} from "../../../../types/API";

type FeatureInfoProps = {
    feature: LibraryFeature | LibrarySeries,
    onRequestPlay: () => void,
}

const FeatureInfo = ({ feature, onRequestPlay }: FeatureInfoProps) => {

    return (
        <div onClick={onRequestPlay} >{feature.Title}</div>
    )
};

export default FeatureInfo;