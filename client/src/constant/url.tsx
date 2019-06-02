const URL_BASE = `http://${window.location.hostname}:${process.env.TOTO_SERVER_PORT}`;

export const URL_LIBRARY = `${URL_BASE}/library`;

export const URL_VIDEO = (id: string) => `${URL_BASE}/video/${id}`;