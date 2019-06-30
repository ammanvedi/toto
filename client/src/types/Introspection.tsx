export interface IntrospectionResultData {
  __schema: {
    types: {
      kind: string;
      name: string;
      possibleTypes: {
        name: string;
      }[];
    }[];
  };
}

const result: IntrospectionResultData = {
  __schema: {
    types: [
      {
        kind: "INTERFACE",
        name: "OMDBFeature",
        possibleTypes: [
          {
            name: "LibrarySeries"
          },
          {
            name: "LibraryFeature"
          }
        ]
      },
      {
        kind: "INTERFACE",
        name: "WithHistoryMetrics",
        possibleTypes: [
          {
            name: "SeriesWatchHistory"
          },
          {
            name: "MovieWatchHistory"
          }
        ]
      },
      {
        kind: "INTERFACE",
        name: "WithSource",
        possibleTypes: [
          {
            name: "LibraryFeature"
          },
          {
            name: "LibraryEpisode"
          }
        ]
      },
      {
        kind: "INTERFACE",
        name: "OMDBEpisode",
        possibleTypes: [
          {
            name: "LibraryEpisode"
          }
        ]
      },
      {
        kind: "UNION",
        name: "WatchHistory",
        possibleTypes: [
          {
            name: "SeriesWatchHistory"
          },
          {
            name: "MovieWatchHistory"
          }
        ]
      },
      {
        kind: "INTERFACE",
        name: "WithAvailableSeasons",
        possibleTypes: []
      },
      {
        kind: "INTERFACE",
        name: "WithDateAdded",
        possibleTypes: []
      }
    ]
  }
};

export default result;
