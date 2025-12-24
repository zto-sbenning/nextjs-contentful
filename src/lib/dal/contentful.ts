/**
 * Data Access Layer (DAL) pour Contentful (mode live/published)
 * 
 * Ce module centralise tous les appels à l'API Contentful avec mise en cache granulaire.
 * Chaque fonction est indépendamment cachée, permettant:
 * - Réutilisation du cache à travers toute l'application
 * - Invalidation ciblée par tags
 * - Pas de mise en cache des erreurs (seules les valeurs de retour sont cachées)
 * 
 * Note: Pour le mode preview, voir src/lib/dal/contentfulPreview.ts
 * 
 * @see https://nextjs.org/docs/app/building-your-application/data-fetching/fetching
 */
import { cacheLife, cacheTag } from "next/cache";
import { getContentfulClient } from "../contentful/client";
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
 * Récupère un topic par son slug et content type
 * 
 * Cache granulaire par: contentType + slug + locale
 * Tags: "topic", contentType, "contentType:slug:valeur"
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
    cacheLife("hours");
    cacheTag("topic", contentType, `${contentType}:slug:${slug}:${locale}`);

    const client = getContentfulClient();

    const entries = await client.getEntries<TopicSkeleton, SupportedLocale>({
        content_type: contentType,
        [`fields.slug.${locale}`]: slug,
        [`fields.active.${locale}`]: true,
        include: 10, // Include the pageTemplate reference
        limit: 1
    });

    return entries.items[0] ?? null;
}

/**
 * Récupère un topic par son ID système Contentful
 * 
 * Utile pour les références directes (mode live uniquement)
 * Pour le mode preview, voir contentfulPreview.ts
 * 
 * @param entryId - L'ID Contentful de l'entrée
 * @returns Le topic trouvé ou null
 */
export async function getTopicById(entryId: string) {
    "use cache";
    cacheLife("hours");
    cacheTag("topic", `topic:id:${entryId}`);

    const client = getContentfulClient();

    try {
        const entry = await client.getEntry<TopicSkeleton, SupportedLocale>(entryId, {
            include: 10,
        });
        return entry;
    } catch (error) {
        // Entry not found or access denied
        console.error(`Error fetching topic by ID ${entryId}:`, error);
        return null;
    }
}

/**
 * Récupère tous les topics d'un type donné
 * 
 * Utile pour generateStaticParams et les listings
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
    cacheLife("hours");
    cacheTag("topic", contentType, `${contentType}:list:${locale}`);

    const client = getContentfulClient();

    const entries = await client.getEntries<TopicSkeleton, SupportedLocale>({
        content_type: contentType,
        [`fields.active.${locale}`]: true,
        include: 10,
        limit
    });

    return entries.items;
}
