import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import { Route } from "next";
import { getTopicById } from "@/lib/dal/contentfulPreview";
import isValidLivePreviewToken from "@/lib/contentful/isValidLivePreviewToken";
import { getFieldForLocale, isResolvedEntry, toContentfulLocale, type SupportedLocale } from "@/lib/types";
import { TypeConfigPageTemplateSkeleton } from "@/lib/contentful/content-types";
import { PageProps as RootsPageProps } from "next-roots";
import { RouteLocale } from "next-roots";

/**
 * Build the real URL path for a topic based on its pageTemplate urlPattern
 */
function buildTopicPath(urlPattern: string, slug: string): string {
    if (slug === "/" || slug === "") {
        return "/";
    }
    
    // Remove leading slash if present
    const cleanPattern = urlPattern.startsWith('/') ? urlPattern.slice(1) : urlPattern;
    
    // Replace {slug} with actual slug value
    const path = cleanPattern.replace('{slug}', slug);
    
    return `/${path}`;
}

type LivePreviewContentProps = {
    entrySysId: string;
    token: string | string[] | undefined;
    locale: RouteLocale;
};

/**
 * Live Preview Content - wrapped in Suspense for streaming
 * 
 * Handles token validation, topic fetching, and redirect to the real preview URL.
 */
async function LivePreviewContent({ entrySysId, token, locale }: LivePreviewContentProps): Promise<never> {
    // Validate the preview token
    const tokenValue = Array.isArray(token) ? token[0] : token;
    if (!isValidLivePreviewToken(tokenValue ?? null)) {
        // Invalid or missing token - 404
        notFound();
    }

    // Fetch the topic by its Contentful sys.id using preview client
    const topic = await getTopicById(entrySysId);
    
    if (!topic) {
        // Topic not found
        notFound();
    }

    // Get the slug and pageTemplate to build the real URL
    const contentfulLocale = toContentfulLocale(locale);
    const slug = getFieldForLocale(topic, "slug", contentfulLocale);
    const pageTemplate = getFieldForLocale(topic, "pageTemplate", contentfulLocale);

    if (!slug) {
        console.error(`[LivePreview] Topic ${entrySysId} has no slug`);
        notFound();
    }

    if (!pageTemplate || !isResolvedEntry<TypeConfigPageTemplateSkeleton, SupportedLocale>(pageTemplate)) {
        console.error(`[LivePreview] Topic ${entrySysId} has no resolved pageTemplate`);
        notFound();
    }

    const urlPattern = getFieldForLocale(pageTemplate, "urlPattern", contentfulLocale);
    
    if (!urlPattern) {
        console.error(`[LivePreview] Topic ${entrySysId} pageTemplate has no urlPattern`);
        notFound();
    }

    // Build the real topic path
    const topicPath = buildTopicPath(urlPattern, slug);
    
    // Redirect to the real URL with preview token
    const previewUrl = topicPath === "/" 
        ? `/preview/${tokenValue}` 
        : `${topicPath}/preview/${tokenValue}`;
    
    redirect(previewUrl as Route);
}

/**
 * Loading skeleton for Live Preview
 */
function LivePreviewSkeleton() {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="animate-pulse text-center">
                <div className="h-6 bg-gray-200 rounded w-48 mb-4 mx-auto"></div>
                <div className="h-4 bg-gray-200 rounded w-32 mx-auto"></div>
            </div>
        </div>
    );
}

/**
 * Contentful Live Preview Entry Point
 * 
 * This page is used by Contentful's Live Preview feature.
 * Contentful calls: /live-preview/[entrySysId]?token=xxx
 * 
 * We validate the token, fetch the topic by ID, build its real URL,
 * and redirect to: /{real-url}/preview/{token}
 */
export default async function LivePreviewEntryPage({
    params,
    searchParams,
    locale,
}: PageProps<"/live-preview/[entrySysId]"> & RootsPageProps) {
    const { entrySysId } = await params;
    const { token } = await searchParams;
    
    return (
        <Suspense fallback={<LivePreviewSkeleton />}>
            <LivePreviewContent 
                entrySysId={entrySysId} 
                token={token} 
                locale={locale} 
            />
        </Suspense>
    );
}