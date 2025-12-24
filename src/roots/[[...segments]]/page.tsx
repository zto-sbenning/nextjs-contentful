import { Suspense } from "react";
import { generateTopicPaths } from "@/lib/contentful/generateTopicPaths";
import { toContentfulLocale } from "@/lib/types";
import { GeneratePageStaticParamsProps, PageProps as RootsPageProps } from "next-roots";
import { PageContent, PageSkeleton } from "./PageContent";

/**
 * Generate static params for all topics
 * 
 * Paths returned here will be:
 * - Pre-rendered at build time
 * - Part of the static shell
 * - Revalidated via ISR (cacheLife in DAL)
 * 
 * Paths NOT returned here will be:
 * - Rendered dynamically on first request
 * - Streamed via Suspense
 */
export async function generateStaticParams({
    pageLocale,
}: GeneratePageStaticParamsProps) {
    const locale = toContentfulLocale(pageLocale);
    return generateTopicPaths(locale);
}

/**
 * Page component with Suspense for dynamic paths
 * 
 * For paths in generateStaticParams: Fully static (ISR)
 * For paths not in generateStaticParams: Suspense streams the content
 */
export default async function Page({
    params,
    locale,
}: PageProps<any> & RootsPageProps) {
    return (
        <Suspense fallback={<PageSkeleton />}>
            <PageContent params={params} locale={locale} />
        </Suspense>
    );
}