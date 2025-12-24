import * as contentful from 'contentful';

const SPACE_ID = process.env.CONTENTFUL_SPACE_ID || '';
const ENVIRONMENT = process.env.CONTENTFUL_ENVIRONMENT || 'master';
const ACCESS_TOKEN = process.env.CONTENTFUL_ACCESS_TOKEN || '';
const HOST = process.env.CONTENTFUL_HOST || '';
const ACCESS_TOKEN_PREVIEW = process.env.CONTENTFUL_ACCESS_TOKEN_PREVIEW || '';
const HOST_PREVIEW = process.env.CONTENTFUL_HOST_PREVIEW || '';

let _client: contentful.ContentfulClientApi<"WITH_ALL_LOCALES">;
let _previewClient: contentful.ContentfulClientApi<"WITH_ALL_LOCALES">;

function createClient() {
    if (!_client) {
        _client = contentful.createClient({
            space: SPACE_ID,
            environment: ENVIRONMENT,
            accessToken: ACCESS_TOKEN,
            host: HOST,
        }).withAllLocales;
    }
    return _client;
}

function createPreviewClient() {
    if (!_previewClient) {
        _previewClient = contentful.createClient({
            space: SPACE_ID,
            environment: ENVIRONMENT,
            accessToken: ACCESS_TOKEN_PREVIEW,
            host: HOST_PREVIEW,
        }).withAllLocales;
    }
    return _previewClient;
}

export function getContentfulClient() {
    return createClient();
}

export function getContentfulPreviewClient() {
    return createPreviewClient();
}
