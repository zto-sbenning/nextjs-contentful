/**
 * Types pour le composant DebugOverlay
 * 
 * Ces types définissent les informations de page Contentful
 * affichées dans l'overlay de debug.
 */

import type { TopicContentType, SupportedLocale } from "@/lib/types";

/**
 * Informations de debug d'une page Contentful
 */
export interface PageDebugInfo {
    /** Type du topic (topicLanding, topicProject, etc.) */
    contentType: TopicContentType | string;
    /** Contentful sys.id de l'entry */
    entryId: string;
    /** Nom d'affichage de la page */
    displayName: string | null;
    /** URL pattern du template utilisé */
    template: string | null;
    /** Locale courante */
    locale: SupportedLocale | string;
    /** Mode preview actif */
    isPreview: boolean;
}
