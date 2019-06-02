import {LibraryFeature, LibrarySeries} from "../../../types/API";
import {ThumbProps} from "../component/thumb/thumb";

export const getThumbPropsFromFeature = (feature: LibraryFeature | LibrarySeries): ThumbProps => {

    switch(feature.__typename) {
        case 'LibraryFeature':
            return {
                posterUrl: feature.Poster,
                watchedPercentage: 0,
            };
            break;
        case 'LibrarySeries':
            return {
                posterUrl: feature.Poster,
                watchedPercentage: 0,
            };
    }
};