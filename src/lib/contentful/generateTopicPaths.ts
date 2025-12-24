/**
 * Generate static params for all topics based on build configuration
 * 
 * Environment variables:
 * - MINIMAL_BUILD="true" => Only generate paths for content types in FORCE_BUILD
 * - FORCE_BUILD="topicLanding,topicArticle" => Content types to generate in minimal mode
 * 
 * @see https://nextjs.org/docs/app/api-reference/functions/generate-static-params
 */
import { getTopicsByType, TOPIC_CONTENT_TYPES, type TopicContentType } from "../dal/contentful";
import { getFieldForLocale, type SupportedLocale } from "../types";
import { TypeConfigPageTemplateSkeleton } from "./content-types";

const MINIMAL_BUILD = process.env.MINIMAL_BUILD === "true";
const FORCE_BUILD = process.env.FORCE_BUILD?.split(",").map(s => s.trim()) ?? [];

/**
 * Determine which content types to build based on env configuration
 */
function getContentTypesToBuild(): TopicContentType[] {
    if (MINIMAL_BUILD) {
        // Only build content types specified in FORCE_BUILD
        return TOPIC_CONTENT_TYPES.filter(ct => FORCE_BUILD.includes(ct));
    }
    // Build all content types
    return [...TOPIC_CONTENT_TYPES];
}

/**
 * Convert a topic's URL pattern and slug into path segments
 * 
 * Examples:
 * - urlPattern: "{slug}", slug: "/" => []
 * - urlPattern: "{slug}", slug: "about" => ["about"]
 * - urlPattern: "/projects/{slug}", slug: "my-project" => ["projects", "my-project"]
 */
function buildPathSegments(urlPattern: string, slug: string): string[] {
    // Home page special case
    if (slug === "/" || slug === "") {
        return [];
    }

    // Remove leading slash if present
    const cleanPattern = urlPattern.startsWith('/') ? urlPattern.slice(1) : urlPattern;
    
    // Replace {slug} with actual slug value
    const path = cleanPattern.replace('{slug}', slug);
    
    // Split into segments and filter empty strings
    return path.split('/').filter(Boolean);
}

/**
 * Check if an entry is a resolved Entry (not an UnresolvedLink)
 */
function isResolvedEntry(entry: unknown): entry is { fields: Record<string, unknown> } {
    return !!entry && typeof entry === 'object' && 'fields' in entry;
}

/**
 * Generate all topic paths for a given locale
 * 
 * Used by generateStaticParams to pre-render pages at build time.
 * Respects MINIMAL_BUILD and FORCE_BUILD environment variables.
 * 
 * @param locale - The locale to generate paths for
 * @returns Array of segment arrays for generateStaticParams
 */
export async function generateTopicPaths(
    locale: SupportedLocale
): Promise<{ segments: string[] }[]> {
    const contentTypes = getContentTypesToBuild();
    
    if (contentTypes.length === 0) {
        console.log(`[generateTopicPaths] MINIMAL_BUILD=${MINIMAL_BUILD}, no content types to build`);
        return [];
    }

    console.log(`[generateTopicPaths] Building paths for locale "${locale}", content types: ${contentTypes.join(", ")}`);

    const allPaths: { segments: string[] }[] = [];

    for (const contentType of contentTypes) {
        try {
            const topics = await getTopicsByType(contentType, locale);
            
            for (const topic of topics) {
                const slug = getFieldForLocale(topic, "slug", locale);
                const pageTemplate = getFieldForLocale(topic, "pageTemplate", locale);

                if (!slug) {
                    console.warn(`[generateTopicPaths] Topic ${topic.sys.id} has no slug`);
                    continue;
                }

                if (!pageTemplate || !isResolvedEntry(pageTemplate)) {
                    console.warn(`[generateTopicPaths] Topic ${topic.sys.id} has no resolved pageTemplate`);
                    continue;
                }

                // Extract urlPattern from pageTemplate
                const urlPattern = pageTemplate.fields?.urlPattern?.[locale];
                
                if (!urlPattern) {
                    console.warn(`[generateTopicPaths] Topic ${topic.sys.id} pageTemplate has no urlPattern for locale ${locale}`);
                    continue;
                }

                const segments = buildPathSegments(urlPattern, slug);
                allPaths.push({ segments });

                console.log(`[generateTopicPaths] Added path: /${segments.join('/') || '(home)'} (${contentType})`);
            }
        } catch (error) {
            console.error(`[generateTopicPaths] Error fetching ${contentType}:`, error);
        }
    }

    console.log(`[generateTopicPaths] Generated ${allPaths.length} paths for locale "${locale}"`);
    
    return allPaths;
}

/**
 * Check if current build is minimal (for debugging/logging)
 */
export function isMinimalBuild(): boolean {
    return MINIMAL_BUILD;
}

/**
 * Get the list of forced content types (for debugging/logging)
 */
export function getForcedContentTypes(): string[] {
    return FORCE_BUILD;
}
