/**
 * Types et constantes centralisés pour l'application
 * 
 * Ce module rassemble tous les types partagés à travers l'application,
 * notamment les locales, les types de contenu Contentful, et les helpers associés.
 * 
 * @see roots.config.js pour la configuration source des locales
 */

import type { LocaleCode } from "contentful";
import {
    type TypeTopicLandingSkeleton,
    type TypeTopicProjectSkeleton,
    type TypeTopicTechnologySkeleton,
    type TypeTopicCollectionSkeleton,
} from "./contentful/content-types";

// Re-export roots.config values for TypeScript usage
// Note: roots.config.js is the source of truth, consumed by next-roots
import rootsConfig from "@@/roots.config";

// =============================================================================
// LOCALES
// =============================================================================

/**
 * Liste des locales supportées par l'application
 * Dérivée de roots.config.js
 */
export const SUPPORTED_LOCALES = ["en-US", "fr-FR"] as const;

/**
 * Locale par défaut de l'application
 */
export const DEFAULT_LOCALE: SupportedLocale = rootsConfig.defaultLocale as SupportedLocale;

/**
 * Type union des locales supportées
 * Utiliser ce type pour tous les paramètres/variables de locale
 */
export type SupportedLocale = typeof SUPPORTED_LOCALES[number];

/**
 * Type pour les locales Contentful (alias pour compatibilité)
 */
export type ContentfulLocale = SupportedLocale & LocaleCode;

/**
 * Type guard pour vérifier si une string est une locale supportée
 */
export function isSupportedLocale(locale: string): locale is SupportedLocale {
    return SUPPORTED_LOCALES.includes(locale as SupportedLocale);
}

/**
 * Convertit une locale en locale Contentful valide
 * Retourne la locale par défaut si invalide
 */
export function toContentfulLocale(locale: string): SupportedLocale {
    return isSupportedLocale(locale) ? locale : DEFAULT_LOCALE;
}

// =============================================================================
// TOPIC CONTENT TYPES
// =============================================================================

/**
 * Type union de tous les skeletons de Topic
 */
export type TopicSkeleton =
    | TypeTopicLandingSkeleton
    | TypeTopicProjectSkeleton
    | TypeTopicTechnologySkeleton
    | TypeTopicCollectionSkeleton;

/**
 * Topic content types disponibles dans Contentful
 */
export const TOPIC_CONTENT_TYPES = [
    "topicLanding",
    "topicProject",
    "topicTechnology",
    "topicCollection",
] as const;

/**
 * Type des content types de Topic
 */
export type TopicContentType = typeof TOPIC_CONTENT_TYPES[number];

/**
 * Type guard pour vérifier si un content type est un Topic
 */
export function isTopicContentType(contentType: string): contentType is TopicContentType {
    return TOPIC_CONTENT_TYPES.includes(contentType as TopicContentType);
}

// =============================================================================
// RE-EXPORTS POUR CONVENANCE
// =============================================================================

// Re-export des helpers de field.ts pour un import centralisé
export { getFieldForLocale, isResolvedEntry } from "./contentful/field";
export type { GetFieldForLocaleOptions } from "./contentful/field";

// Re-export de ParsedSegments
export type { ParsedSegments } from "./segments/parseSegments";
export { default as parseSegments } from "./segments/parseSegments";

// =============================================================================
// CONTENTFUL LIGHTWEIGHT TYPES
// =============================================================================

/**
 * Structure légère d'un asset Contentful résolu
 * Utilisable pour cards, galleries, previews, Rich Text, etc.
 */
export interface LinkedAsset {
    sys: {
        id: string;
    };
    fields?: {
        title?: string;
        description?: string;
        file?: {
            url: string;
            fileName?: string;
            contentType?: string;
            details?: {
                size?: number;
                image?: {
                    width: number;
                    height: number;
                };
            };
        };
    };
}

/**
 * Structure légère d'une entry Contentful résolue
 * Utilisable pour navigation, listings, breadcrumbs, Rich Text, etc.
 */
export interface LinkedEntry {
    sys: {
        id: string;
        contentType?: {
            sys: {
                id: string;
            };
        };
    };
    fields?: Record<string, unknown>;
}
