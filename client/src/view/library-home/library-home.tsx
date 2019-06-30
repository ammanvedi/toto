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
import { LibraryHomeComponent } from "../../types/ClientQueries";

const LibraryDataProvider = DataProvider as DataProviderType<LibraryResponse>;

export const LibraryHome = () => {

    const [videoModalOpen, setVideoModalOpen] = useState(false);
    const [seriesModalOpen, setSeriesModalOpen] = useState(false);
    const [featureModalOpen, setFeatureModalOpen] = useState(false);
    const [currentVideo, setCurrentVideo] = useState<string | null>(null);
    const [currentSeries, setCurrentSeries] = useState<string | null>(null);
    const [currentFeature, setCurrentFeature] = useState<string | null>(null);

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

    const onFeatureClicked = (id: string) => {
        setCurrentFeature(id);
        openFeatureModal();
    };

    const onSeriesClicked = (id: string) => {
        setCurrentSeries(id);
        openSeriesModal();
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
        <LibraryHomeComponent>
            {( { data, loading, error} ) => {

                if (loading) {
                    return <div>loading...</div>
                }

                if (error || !data) {
                    return <div>oops!</div>
                }

                const { allLibraryFeatures, allLibrarySeries } = data;

                return (
                    <Fragment>
                        <Modal
                            {...modalProps}
                            isOpen={seriesModalOpen}>
                            {currentSeries && (
                                <Fragment>
                                    <FeatureInfo feature={currentSeries}
                                                 onRequestPlay={onSeriesRequestedPlay} />
                                    <SeriesPage feature={currentSeries}
                                                 episodeClicked={onEpisodeClicked} />
                                </Fragment>
                            )}
                        </Modal>
                        <Modal
                            {...modalProps}
                            isOpen={featureModalOpen}>
                            {currentFeature && (
                                <FeatureInfo feature={currentFeature}
                                             onRequestPlay={onFeatureRequestedPlay} />
                            )}
                        </Modal>
                        <Modal
                            {...modalProps}
                            isOpen={videoModalOpen}>
                            {currentVideo && (
                                <VideoPage src={currentVideo} />
                            )}
                        </Modal>
                        {allLibraryFeatures && (
                            <ThumbList itemClicked={onFeatureClicked} title='Movies' items={allLibraryFeatures.map(getThumbPropsFromFeature)}/>
                        )}
                        {allLibrarySeries && (
                            <ThumbList itemClicked={onSeriesClicked} title='Series' items={allLibrarySeries.map(getThumbPropsFromFeature)}/>
                        )}

                    </Fragment>
                )
            }}
        </LibraryHomeComponent>
    )
}