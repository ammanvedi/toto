import React, {Fragment, SyntheticEvent, useState} from 'react';
import {FeatureSeasonResponse, LibraryEpisode, LibraryResponse, LibrarySeries} from "../../../../types/API";
import {DataProvider, DataProviderType} from "../../component/data-provider/data-provider";
import {URL_SEASON} from "../../constant/url";
import FeatureInfo from "../feature-info/feature-info";

type SeriesPageProps = {
    feature: LibrarySeries,
    episodeClicked: (id: string, series: string, episode: string) => void,
}

const SeriesDataProvider = DataProvider as DataProviderType<FeatureSeasonResponse>;

const SeriesPage = ({ feature, episodeClicked }: SeriesPageProps) => {
    const [currentSeason, setCurrentSeason] = useState(feature.availableSeasons[0]);

    const onSeriesSelectChange = (evt: SyntheticEvent<HTMLSelectElement>) => {
        const el = evt.target as HTMLSelectElement;
        const seriesNumber = parseInt(el.value);
        if (!isNaN(seriesNumber)) {
            setCurrentSeason(seriesNumber);
        }
    };

    return (
        <div>
            <select onChange={onSeriesSelectChange} value={currentSeason}>
                {feature.availableSeasons.map(season => (
                    <option key={season} value={season}>{season}</option>
                ))}
            </select>
            <SeriesDataProvider url={URL_SEASON(feature.imdbID, currentSeason)}>
                {({isLoading, isError, data}) => {
                    console.log(isLoading, isError, data);

                    if (!data) {
                        return null;
                    }
                    return (
                        <Fragment>
                            <FeatureInfo feature={feature}
                                         onRequestPlay={() => {
                                             // make this separate component with its own data fetch
                                             // create a cache provider that all these data providers can hook onto
                                             // it will use the watch history to fetch the series
                                             // maybe we can extends video player to even handle a list of items so
                                             // it can play next episode.
                                         }} />
                            <ul>
                                {data.episodes.map(episode => (
                                    <li
                                        onClick={() => episodeClicked(episode)}
                                        key={episode.imdbID}>
                                        {episode.Title}
                                    </li>
                                ))}
                            </ul>
                        </Fragment>
                    )
                }}
            </SeriesDataProvider>
        </div>
    )
};

export default SeriesPage;