'use client';

import { useReportWebVitals } from 'next/web-vitals';

export type ReportWebVitalsProps = {
};

type ReportWebVitalsCallback = Parameters<typeof useReportWebVitals>[0];

const logWebVitals: ReportWebVitalsCallback = (metric) => {
    // Log all metrics with their details
    console.log({
        name: metric.name,
        value: metric.value,
        rating: metric.rating,
        delta: metric.delta,
        id: metric.id,
        navigationType: metric.navigationType,
        // Attribution data is available when webVitalsAttribution is enabled in next.config
        attribution: 'attribution' in metric ? metric.attribution : undefined,
    });
}

export function ReportWebVitals({
}: ReportWebVitalsProps) {
    useReportWebVitals(logWebVitals);
    return null;
}
