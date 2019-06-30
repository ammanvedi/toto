import {LibraryFeature, LibrarySeries} from "../../../types/API";
import {ThumbProps} from "../component/thumb/thumb";
import {FeatureThumbnailFieldsFragment, SeriesThumbnailFieldsFragment} from "../types/ClientQueries";

export const getThumbPropsFromFeature = (feature: SeriesThumbnailFieldsFragment | FeatureThumbnailFieldsFragment): ThumbProps => {

    switch(feature.__typename) {
        case 'LibraryFeature':
            return {
                id: feature.imdbId,
                posterUrl: feature.poster,
                watchedPercentage: 0,
            };
            break;
        case 'LibrarySeries':
            return {
                id: feature.imdbId,
                posterUrl: feature.poster,
                watchedPercentage: 0,
            };
    }
};