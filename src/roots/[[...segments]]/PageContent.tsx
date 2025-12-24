import { redirect, notFound } from "next/navigation";
import { findTopicBySegments } from "@/lib/contentful/findTopicBySegments";
import { getFieldForLocale, toContentfulLocale } from "@/lib/types";
import { isResolvedEntry } from "@/lib/contentful/field";
import { Route } from "next";
import { RouteLocale } from "next-roots";
import { DebugOverlay, type PageDebugInfo } from "@/components/internal/debug";
import AssemblySection from "@/components/contentful/AssemblySection";
import type { TypeAssemblySectionSkeleton } from "@/lib/contentful/content-types";

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
    const { topic, contentType, urlPattern, pageTemplate, isPreviewMode, isPreviewValid } = result;
    const displayName = getFieldForLocale(topic, "displayName", contentfulLocale);
    const templateName = pageTemplate ? getFieldForLocale(pageTemplate, "displayName", contentfulLocale) : null;
    
    // Extract sections from the page template
    const sections = pageTemplate ? getFieldForLocale(pageTemplate, "sections", contentfulLocale) : null;
    
    // Build debug info for the overlay (props-based, no dynamic impact)
    const debugInfo: PageDebugInfo = {
        contentType,
        entryId: topic.sys.id,
        displayName: displayName ?? '—',
        template: templateName ?? urlPattern,
        locale,
        isPreview: isPreviewMode && isPreviewValid,
    };
    
    return (
        <div>
            <DebugOverlay info={debugInfo} />
            
            {/* Render sections from the template */}
            {sections && sections.length > 0 ? (
                <main>
                    {sections.map((section) => {
                        // Skip unresolved links
                        if (!isResolvedEntry<TypeAssemblySectionSkeleton, string>(section)) {
                            return null;
                        }
                        
                        return (
                            <AssemblySection
                                key={section.sys.id}
                                entry={section}
                                locale={contentfulLocale}
                            />
                        );
                    })}
                </main>
            ) : (
                // Fallback: show debug info when no sections
                <div className="p-8">
                    <h1 className="text-2xl font-bold mb-4">Topic: {displayName}</h1>
                    <p><strong>Type:</strong> {contentType}</p>
                    <p><strong>Template:</strong> {templateName ?? urlPattern}</p>
                    {isPreviewMode && isPreviewValid && (
                        <p className="text-orange-500 mt-2"><strong>🔍 Preview Mode Active</strong></p>
                    )}
                    <p className="text-neutral-500 mt-4 text-sm">
                        No sections configured for this template.
                    </p>
                </div>
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
