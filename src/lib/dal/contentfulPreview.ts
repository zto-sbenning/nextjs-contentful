/**
 * Data Access Layer (DAL) pour Contentful (mode preview/draft)
 * 
 * Ce module centralise tous les appels à l'API Contentful Preview.
 * Utilisé pour la live preview des contenus non publiés.
 * 
 * Différences avec le DAL live (contentful.ts):
 * - Utilise le client preview (accès aux drafts)
 * - Cache très court ou désactivé pour refléter les changements en temps réel
 * - Ne filtre pas sur le champ "active" (preview = voir tout)
 * 
 * @see https://nextjs.org/docs/app/building-your-application/data-fetching/fetching
 */
import { cacheLife, cacheTag } from "next/cache";
import { getContentfulPreviewClient } from "../contentful/client";
import {
    type TopicSkeleton,
    type TopicContentType,
    type SupportedLocale,
    TOPIC_CONTENT_TYPES,
} from "../types";

// Re-export pour compatibilité avec les imports existants
export { TOPIC_CONTENT_TYPES };
export type { TopicContentType };

/**
 * Récupère un topic par son slug et content type (mode preview)
 * 
 * Cache très court pour la preview (quelques secondes)
 * Tags: "preview", "topic-preview", contentType
 * 
 * @param contentType - Le type de contenu à chercher
 * @param slug - Le slug du topic
 * @param locale - La locale (en-US ou fr-FR)
 * @returns Le topic trouvé ou null
 */
export async function getTopicBySlug(
    contentType: TopicContentType,
    slug: string,
    locale: SupportedLocale
) {
    "use cache";
    cacheLife("seconds");
    cacheTag("preview", "topic-preview", contentType, `preview:${contentType}:slug:${slug}:${locale}`);

    const client = getContentfulPreviewClient();

    const entries = await client.getEntries<TopicSkeleton, SupportedLocale>({
        content_type: contentType,
        [`fields.slug.${locale}`]: slug,
        [`fields.active.${locale}`]: true,
        include: 2,
        limit: 1
    });

    return entries.items[0] ?? null;
}

/**
 * Récupère un topic par son ID système Contentful (mode preview)
 * 
 * Utile pour les références directes et la live preview par ID
 * 
 * @param entryId - L'ID Contentful de l'entrée
 * @returns Le topic trouvé ou null
 */
export async function getTopicById(entryId: string) {
    "use cache";
    cacheLife("seconds");
    cacheTag("preview", "topic-preview", `preview:topic:id:${entryId}`);

    const client = getContentfulPreviewClient();

    try {
        const entry = await client.getEntry<TopicSkeleton, SupportedLocale>(entryId, {
            include: 2,
        });
        return entry;
    } catch (error) {
        // Entry not found or access denied
        console.error(`[Preview] Error fetching topic by ID ${entryId}:`, error);
        return null;
    }
}

/**
 * Récupère tous les topics d'un type donné (mode preview)
 * 
 * Utile pour les listings en mode preview
 * 
 * @param contentType - Le type de contenu
 * @param locale - La locale (en-US ou fr-FR)
 * @param limit - Nombre maximum de résultats
 * @returns Liste des topics
 */
export async function getTopicsByType(
    contentType: TopicContentType,
    locale: SupportedLocale,
    limit: number = 100
) {
    "use cache";
    cacheLife("seconds");
    cacheTag("preview", "topic-preview", contentType, `preview:${contentType}:list:${locale}`);

    const client = getContentfulPreviewClient();

    const entries = await client.getEntries<TopicSkeleton, SupportedLocale>({
        content_type: contentType,
        [`fields.active.${locale}`]: true,
        include: 2,
        limit
    });

    return entries.items;
}
