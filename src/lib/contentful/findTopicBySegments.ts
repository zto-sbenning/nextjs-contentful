import { RouteLocale } from "next-roots";
import { TypeConfigPageTemplateSkeleton } from "./content-types";
import { getTopicBySlug as getTopicBySlugLive } from "../dal/contentful";
import { getTopicBySlug as getTopicBySlugPreview } from "../dal/contentfulPreview";
import isValidLivePreviewToken from "./isValidLivePreviewToken";
import {
    parseSegments,
    type ParsedSegments,
    getFieldForLocale,
    isResolvedEntry,
    toContentfulLocale,
    DEFAULT_LOCALE,
    TOPIC_CONTENT_TYPES,
    type SupportedLocale,
} from "../types";

/**
 * Find a topic entry by matching segments against URL patterns
 * 
 * Cette fonction orchestre la recherche de topic sans faire d'appels Contentful directs.
 * Les appels sont délégués au DAL (getTopicBySlug) qui gère le cache de manière granulaire.
 * 
 * En mode preview:
 * - Vérifie la validité du token
 * - Utilise le DAL preview si token valide
 * - Retourne isPreviewMode et isPreviewValid pour permettre à la page de gérer la redirection
 * 
 * @param segments - Array of URL segments
 * @param locale - Locale to search in (default: 'en-US')
 * @returns The matching topic entry with preview state, or null
 */
export async function findTopicBySegments(
    segments: string[],
    locale: RouteLocale = DEFAULT_LOCALE as RouteLocale
) {
    const parsedSegments: ParsedSegments = parseSegments(segments);
    
    // Determine preview mode and token validity
    const isPreviewMode = parsedSegments.isPreview;
    const isPreviewValid = isPreviewMode && isValidLivePreviewToken(parsedSegments.previewToken);
    
    // Early return if preview mode requested but token is invalid
    // No need to call DAL - let the page handle the redirect
    if (isPreviewMode && !isPreviewValid) {
        return {
            topic: null,
            contentType: null,
            pageTemplate: null,
            parsedSegments,
            urlPattern: null,
            isPreviewMode,
            isPreviewValid,
        };
    }
    
    // Select the appropriate DAL function based on preview state
    const getTopicBySlug = isPreviewValid ? getTopicBySlugPreview : getTopicBySlugLive;
    
    // Special case: home page (empty segments should match slug '/')
    const searchSlug = !parsedSegments.slug && parsedSegments.segments.length === 0 
        ? '/' 
        : parsedSegments.slug;
    
    if (!searchSlug) {
        return null;
    }

    // Ensure locale is valid for Contentful
    const contentfulLocale: SupportedLocale = toContentfulLocale(locale);

    // Try to find a topic with matching slug across all topic types
    // Each call to getTopicBySlug is independently cached in the DAL
    for (const contentType of TOPIC_CONTENT_TYPES) {
        try {
            const topic = await getTopicBySlug(contentType, searchSlug, contentfulLocale);

            if (topic) {
                // Get the page template to verify URL pattern
                const pageTemplate = getFieldForLocale(topic, "pageTemplate", locale);
                if (!pageTemplate) {
                    console.warn(`Topic ID '${topic.sys.id}' has no page template assigned.`);
                    continue;
                }

                // Check if pageTemplate is a resolved Entry (not an UnresolvedLink)
                if (isResolvedEntry<TypeConfigPageTemplateSkeleton, SupportedLocale>(pageTemplate)) {
                    const urlPattern = getFieldForLocale(pageTemplate, "urlPattern", locale);
                    
                    // Use parsedSegments.segments for matching (excludes preview/pagination segments)
                    if (urlPattern && matchesUrlPattern(parsedSegments.segments, urlPattern, searchSlug)) {
                        const result = {
                            topic,
                            contentType,
                            pageTemplate,
                            parsedSegments,
                            urlPattern,
                            isPreviewMode,
                            isPreviewValid,
                        };

                        return result;
                    }
                }
            }
        } catch (error) {
            console.error(`Error searching for ${contentType}:`, error);
            continue;
        }
    }

    return null;
}

/**
 * Check if the segments match the URL pattern
 * 
 * Examples:
 * - Pattern: "{slug}" matches segments: ["home"]
 * - Pattern: "/projects/{slug}" matches segments: ["projects", "my-project"]
 * - Pattern: "/tech/{slug}" matches segments: ["tech", "nextjs"]
 * 
 * @param segments - URL segments
 * @param pattern - URL pattern from page template
 * @param slug - The topic's slug
 * @returns True if segments match the pattern
 */
function matchesUrlPattern(
    segments: string[],
    pattern: string,
    slug: string
): boolean {
    // Special case: home page with slug '/' and pattern '{slug}'
    if (segments.length === 0 && slug === '/' && pattern === '{slug}') {
        return true;
    }
    
    // Remove leading slash if present
    const cleanPattern = pattern.startsWith('/') ? pattern.slice(1) : pattern;
    
    // Split pattern into parts
    const patternParts = cleanPattern.split('/');
    
    // Segments should match pattern length (excluding pagination/preview segments)
    if (segments.length !== patternParts.length) {
        return false;
    }
    
    // Check each part
    for (let i = 0; i < patternParts.length; i++) {
        const patternPart = patternParts[i];
        const segmentPart = segments[i];
        
        if (patternPart === '{slug}') {
            // This should match the slug
            if (segmentPart !== slug) {
                return false;
            }
        } else {
            // This should be an exact match
            if (patternPart !== segmentPart) {
                return false;
            }
        }
    }
    
    return true;
}
