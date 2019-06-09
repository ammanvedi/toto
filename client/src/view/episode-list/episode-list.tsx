import React, {Fragment, SyntheticEvent, useState} from 'react';
import {FeatureSeasonResponse, LibraryEpisode, LibraryResponse, LibrarySeries} from "../../../../types/API";
import {DataProvider, DataProviderType} from "../../component/data-provider/data-provider";
import {URL_SEASON} from "../../constant/url";

type EpisodeListProps = {
    feature: LibrarySeries,
    episodeClicked: (ep: LibraryEpisode) => void,
}

const SeriesDataProvider = DataProvider as DataProviderType<FeatureSeasonResponse>;

const EpisodeList = ({ feature, episodeClicked }: EpisodeListProps) => {
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
                    <option value={season}>{season}</option>
                ))}
            </select>
            <SeriesDataProvider url={URL_SEASON(feature.imdbID, currentSeason)}>
                {({isLoading, isError, data}) => {
                    console.log(isLoading, isError, data);

                    if (!data) {
                        return null;
                    }
                    return (
                        <ul>
                            {data.episodes.map(episode => (
                                <li
                                    onClick={() => episodeClicked(episode)}
                                    key={episode.imdbID}>
                                    {episode.Title}
                                </li>
                            ))}
                        </ul>
                    )
                }}
            </SeriesDataProvider>
        </div>
    )
};

export default EpisodeList;