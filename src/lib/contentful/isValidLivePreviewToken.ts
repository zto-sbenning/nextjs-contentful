export default function isValidLivePreviewToken(token: string | null): boolean {
    const ACCESS_TOKEN_LIVE_PREVIEW = process.env.CONTENTFUL_ACCESS_TOKEN_LIVE_PREVIEW;
    if (!ACCESS_TOKEN_LIVE_PREVIEW) {
        return false;
    }
    return token === ACCESS_TOKEN_LIVE_PREVIEW;
}
