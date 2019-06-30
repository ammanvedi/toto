const URL_BASE = `http://${window.location.hostname}:${process.env.TOTO_SERVER_PORT}`;

export const GRAPHQL_URL = `${URL_BASE}/graphql`;

export const URL_LIBRARY = `${URL_BASE}/library`;

export const URL_SEASON = (id: string, season: number) => `${URL_LIBRARY}/${id}/season/${season}`;

export const URL_VIDEO = (id: string) => `${URL_BASE}/video/${id}`;