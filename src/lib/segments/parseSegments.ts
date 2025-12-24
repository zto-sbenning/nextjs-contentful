export type ParsedSegments = {
    segments: string[];
    parents: string[];
    slug: string | null;
    isPaginated: boolean;
    pageNumber: number | null;
    isPreview: boolean;
    previewToken: string | null;
}

const PAGE_SEGMENT = 'page';
const PREVIEW_SEGMENT = 'preview';

/**
 * 
 * segments can be like:
 * - ["category", "subcategory", "slug"]
 * - ["category", "subcategory", "slug", "page", "2"]
 * - ["category", "subcategory", "slug", "preview", "token123"]
 * - ["category", "subcategory", "slug", "page", "2", "preview", "token123"]
 */

export default function parseSegments(segments: string[]) {
    let isPaginated = false;
    let pageNumber: number | null = null;
    let isPreview = false;
    let previewToken: string | null = null;
    let slugSegments = [...segments];

    // Check for preview segment
    const previewIndex = slugSegments.indexOf(PREVIEW_SEGMENT);
    if (previewIndex !== -1) {
        isPreview = true;
        previewToken = slugSegments[previewIndex + 1] || null;
        slugSegments = slugSegments.slice(0, previewIndex);
    }
    // Check for pagination segment
    const pageIndex = slugSegments.indexOf(PAGE_SEGMENT);
    if (pageIndex !== -1) {
        isPaginated = true;
        const pageNumStr = slugSegments[pageIndex + 1];
        pageNumber = pageNumStr ? parseInt(pageNumStr, 10) : null;
        slugSegments = slugSegments.slice(0, pageIndex);
    }
    const slug = slugSegments.length ? slugSegments[slugSegments.length - 1] : null;
    const parents = slugSegments.length > 1 ? slugSegments.slice(0, -1) : [];
    return {
        segments: slugSegments,
        parents,
        slug,
        isPaginated,
        pageNumber,
        isPreview,
        previewToken
    } as ParsedSegments;
}