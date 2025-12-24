/**
 * Debug components for Contentful page inspection
 * 
 * @example
 * ```tsx
 * import { DebugOverlay, type PageDebugInfo } from '@/components/internal/debug';
 * 
 * // In a Server Component
 * const debugInfo: PageDebugInfo = {
 *   contentType: "topicLanding",
 *   entryId: topic.sys.id,
 *   displayName: getFieldForLocale(topic, "displayName", locale),
 *   template: urlPattern,
 *   locale: locale,
 *   isPreview: isPreviewMode
 * };
 * 
 * return (
 *   <div>
 *     <DebugOverlay info={debugInfo} />
 *     {children}
 *   </div>
 * );
 * ```
 */

export { default as DebugOverlay } from './DebugOverlay';
export type { PageDebugInfo } from './types';
