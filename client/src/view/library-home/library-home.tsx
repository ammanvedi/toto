import React, {Fragment, useState} from 'react';
import {DataProvider, DataProviderType} from "../../component/data-provider/data-provider";
import {LibraryEpisode, LibraryFeature, LibraryResponse, LibrarySeries} from "../../../../types/API";
import {URL_LIBRARY, URL_VIDEO} from "../../constant/url";
import Thumb from "../../component/thumb/thumb";
import {getThumbPropsFromFeature} from "../../helper/library-feature-helper";
import {ThumbList} from "../../component/thumb-list/thumb-list";
import Modal from 'react-modal';
import VideoPage from "../video-page/video-page";
import EpisodeList from "../episode-list/episode-list";

const LibraryDataProvider = DataProvider as DataProviderType<LibraryResponse>;

export const LibraryHome = () => {

    const [videoModalOpen, setVideoModalOpen] = useState(false);
    const [seriesModalOpen, setSeriesModalOpen] = useState(false);
    const [currentVideo, setCurrentVideo] = useState('');
    const [currentSeries, setCurrentSeries] = useState<LibrarySeries | null>(null);

    const openVideoModal = () => {
        setVideoModalOpen(true);
        setSeriesModalOpen(false);
    };

    const openSeriesModal = () => {
        setVideoModalOpen(false);
        setSeriesModalOpen(true);
    };

    const closeAllModals = () => {
        setVideoModalOpen(false);
        setSeriesModalOpen(false);
    };

    const onClicked = (item: LibraryFeature | LibrarySeries) => {
        switch (item.__typename) {
            case "LibraryFeature":
                openVideoModal();
                setCurrentVideo(URL_VIDEO(item.sourceId));
                break;
            case "LibrarySeries":
                openSeriesModal();
                setCurrentSeries(item);
                setSeriesModalOpen(true);
                break;
        }
    };

    const onEpisodeClicked = (episode: LibraryEpisode) => {
        console.log(episode);
        setCurrentVideo(URL_VIDEO(episode.sourceId));
        openVideoModal();
    };

    return (
        <LibraryDataProvider url={URL_LIBRARY}>
            {({ isError, isLoading, data }) => {

                if (!data) {
                    return null
                }

                return (
                    <Fragment>
                        <Modal shouldCloseOnEsc shouldCloseOnOverlayClick isOpen={seriesModalOpen}>
                            {currentSeries && (
                                <EpisodeList feature={currentSeries} episodeClicked={onEpisodeClicked}/>
                            )}
                        </Modal>
                        <Modal shouldCloseOnEsc shouldCloseOnOverlayClick isOpen={videoModalOpen}>
                            <VideoPage src={currentVideo} />
                        </Modal>
                        <ThumbList itemClicked={onClicked} title='Movies' items={data.movies}/>
                        <ThumbList itemClicked={onClicked} title='Series' items={data.series}/>
                    </Fragment>
                )
            }}
        </LibraryDataProvider>
    )
}