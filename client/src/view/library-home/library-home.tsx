import React, {Fragment, useState} from 'react';
import {DataProvider, DataProviderType} from "../../component/data-provider/data-provider";
import {LibraryEpisode, LibraryFeature, LibraryResponse, LibrarySeries} from "../../../../types/API";
import {URL_LIBRARY, URL_VIDEO} from "../../constant/url";
import Thumb from "../../component/thumb/thumb";
import {getThumbPropsFromFeature} from "../../helper/library-feature-helper";
import {ThumbList} from "../../component/thumb-list/thumb-list";
import Modal from 'react-modal';
import VideoPage from "../video-page/video-page";
import SeriesPage from "../series-page/series-page";
import FeatureInfo from "../feature-info/feature-info";
import FeaturePage from "../feature-page/feature-page";

const LibraryDataProvider = DataProvider as DataProviderType<LibraryResponse>;

export const LibraryHome = () => {

    const [videoModalOpen, setVideoModalOpen] = useState(false);
    const [seriesModalOpen, setSeriesModalOpen] = useState(false);
    const [featureModalOpen, setFeatureModalOpen] = useState(false);
    const [currentVideo, setCurrentVideo] = useState('');
    const [currentSeries, setCurrentSeries] = useState<LibrarySeries | null>(null);
    const [currentFeature, setCurrentFeature] = useState<LibraryFeature | null>(null);

    const openVideoModal = () => {
        setVideoModalOpen(true);
        setSeriesModalOpen(false);
        setFeatureModalOpen(false)
    };

    const openSeriesModal = () => {
        setVideoModalOpen(false);
        setFeatureModalOpen(false);
        setSeriesModalOpen(true);
    };

    const openFeatureModal = () => {
        setVideoModalOpen(false);
        setFeatureModalOpen(true);
        setSeriesModalOpen(false);
    };

    const closeAllModals = () => {
        setVideoModalOpen(false);
        setSeriesModalOpen(false);
        setFeatureModalOpen(false);
    };

    const onClicked = (item: LibraryFeature | LibrarySeries) => {
        switch (item.__typename) {
            case "LibraryFeature":
                setCurrentFeature(item);
                openFeatureModal();
                break;
            case "LibrarySeries":
                setCurrentSeries(item);
                openSeriesModal();
                break;
        }
    };

    const onEpisodeClicked = (episode: LibraryEpisode) => {
        setCurrentVideo(URL_VIDEO(episode.sourceId));
        openVideoModal();
    };

    const modalProps = {
        shouldCloseOnEsc: true,
        shouldCloseOnOverlayClick: true,
        onRequestClose: closeAllModals,
    };

    const onSeriesRequestedPlay = () => {
        // in this case we fetch and play the most recent episode?
        openVideoModal();
    };

    const onFeatureRequestedPlay = () => {
        if (!currentFeature) {
            return;
        }
        setCurrentVideo(URL_VIDEO(currentFeature.sourceId));
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
                        <Modal
                            {...modalProps}
                            isOpen={seriesModalOpen}>
                            {currentSeries && (
                                <Fragment>
                                    <SeriesPage feature={currentSeries}
                                                episodeClicked={onEpisodeClicked} />
                                </Fragment>
                            )}
                        </Modal>
                        <Modal
                            {...modalProps}
                            isOpen={featureModalOpen}>
                            {currentFeature && (
                                <FeaturePage feature={currentFeature} onRequestPlay={onFeatureRequestedPlay}/>
                            )}
                        </Modal>
                        <Modal
                            {...modalProps}
                            isOpen={videoModalOpen}>
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