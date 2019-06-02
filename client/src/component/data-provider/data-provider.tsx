import React, {useState, useEffect, Fragment} from "react";

type DataState<T> = {
    isLoading: boolean,
    isError: boolean,
    data?: T
};

type DataProviderProps<T> = {
    url: string,
    children: (state: DataState<T>) => React.ReactNode,
};

export type DataProviderType<T = any> = React.FC<DataProviderProps<T>>

export const DataProvider: DataProviderType = ({ url, children }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [data, setData] = useState(undefined);

    useEffect(() => {
        fetch(url)
            .then(res => {
                if (res.status >= 400) {
                    throw new Error('Request failed');
                }
                return res.json()
            })
            .then(data => {
                setIsLoading(false);
                setIsError(false);
                setData(data);
            })
            .catch(() => {
                setIsError(true);
                setIsLoading(false);
            })
    }, [url]);

    return (
        <Fragment>
            {children({ isLoading, isError, data })}
        </Fragment>
    );
};