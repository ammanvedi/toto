import React from 'react';
import {DataProvider, DataProviderType} from "../../component/data-provider/data-provider";
import {LibraryResponse} from "../../../../types/API";
import {URL_LIBRARY} from "../../constant/url";
import Thumb from "../../component/thumb/thumb";
import {getThumbPropsFromFeature} from "../../helper/library-feature-helper";

const LibraryDataProvider = DataProvider as DataProviderType<LibraryResponse>;

export const LibraryHome = () => {

    return (
        <LibraryDataProvider url={URL_LIBRARY}>
            {({ isError, isLoading, data }) => {

                if (data) {
                    return data.movies.map(movie => (
                        <Thumb {...getThumbPropsFromFeature(movie)} />
                    ))
                }
                console.log(data);
                return <div/>
            }}
        </LibraryDataProvider>
    )
}