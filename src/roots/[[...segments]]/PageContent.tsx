import { redirect, notFound } from "next/navigation";
import { Suspense } from "react";
import { findTopicBySegments } from "@/lib/contentful/findTopicBySegments";
import { getFieldForLocale, toContentfulLocale } from "@/lib/types";
import { Route } from "next";
import { RouteLocale } from "next-roots";

type PageContentProps = {
    params: Promise<{ segments?: string[] }>;
    locale: RouteLocale;
};

/**
 * Dynamic page content - wrapped in Suspense for non-prerendered paths
 * 
 * This component accesses params and fetches data. When the path is:
 * - In generateStaticParams: Fully static (ISR via cacheLife)
 * - Not in generateStaticParams: Streamed dynamically via Suspense
 */
export async function PageContent({ params, locale }: PageContentProps) {
    const { segments: rawSegments } = await params;
    // [[...segments]] = optional catch-all: segments is undefined for "/" or array for other paths
    const segments = rawSegments ?? [];
    const contentfulLocale = toContentfulLocale(locale);
    
    // Find the topic that matches these segments
    const result = await findTopicBySegments(segments, locale);

    // If preview mode was requested but token is invalid, redirect to clean URL
    if (result?.isPreviewMode && !result.isPreviewValid) {
        const cleanPath = result.parsedSegments.segments.length > 0
            ? `/${result.parsedSegments.segments.join('/')}`
            : '/';
        redirect(cleanPath as Route);
    }
    
    if (!result || !result.topic) {
        // No topic found - 404
        notFound();
    }
    
    // Topic found! You can now render it based on its type
    const { topic, contentType, urlPattern, isPreviewMode, isPreviewValid } = result;
    const displayName = getFieldForLocale(topic, "displayName", contentfulLocale);
    const slug = getFieldForLocale(topic, "slug", contentfulLocale);
    
    return (
        <div>
            <h1>Topic Found!</h1>
            <p><strong>Type:</strong> {contentType}</p>
            <p><strong>Display Name:</strong> {displayName}</p>
            <p><strong>Slug:</strong> {slug}</p>
            <p><strong>URL Pattern:</strong> {urlPattern}</p>
            {isPreviewMode && isPreviewValid && (
                <p className="text-orange-500"><strong>🔍 Preview Mode Active</strong></p>
            )}
        </div>
    );
}

/**
 * Loading skeleton for Suspense fallback
 */
export function PageSkeleton() {
    return (
        <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        </div>
    );
}
