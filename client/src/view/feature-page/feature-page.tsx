import React from 'react';
import {LibraryFeature} from "../../../../types/API";
import FeatureInfo from "../feature-info/feature-info";

type FeaturePageProps = {
    feature: LibraryFeature,
    onRequestPlay: (feature: LibraryFeature) => void,
}

const FeaturePage = ({ feature, onRequestPlay }: FeaturePageProps) => (
    <FeatureInfo feature={feature} onRequestPlay={() => {
        onRequestPlay(feature);
    }}/>
);

export default FeaturePage;