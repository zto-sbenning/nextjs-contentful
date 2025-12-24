import type { ChainModifiers, Entry, EntrySkeletonType, LocaleCode, UnresolvedLink } from "contentful";
import { DEFAULT_LOCALE } from "../types";

/**
 * Type helper pour les entries avec locales
 * Accepte "WITH_ALL_LOCALES" seul ou combiné avec d'autres modifiers
 */
type WithAllLocalesModifiers = "WITH_ALL_LOCALES" | `${"WITHOUT_UNRESOLVABLE_LINKS" | "WITHOUT_LINK_RESOLUTION"} | WITH_ALL_LOCALES` | ChainModifiers;

type FieldValueForLocale<
    TEntry extends Entry<EntrySkeletonType, ChainModifiers, LocaleCode>,
    TKey extends keyof TEntry["fields"]
> = NonNullable<TEntry["fields"][TKey]> extends { [locale: string]: infer V }
    ? V | undefined
    : NonNullable<TEntry["fields"][TKey]> | undefined;

export interface GetFieldForLocaleOptions {
    fallback?: boolean;
    defaultLocale?: string;
}

export function getFieldForLocale<
    TEntry extends Entry<EntrySkeletonType, ChainModifiers, LocaleCode>,
    TKey extends keyof TEntry["fields"]
>(
    entry: TEntry,
    field: TKey,
    locale: string,
    options?: GetFieldForLocaleOptions
): FieldValueForLocale<TEntry, TKey> {
    const rawField = entry.fields[field as string] as unknown;

    if (rawField == null) {
        return undefined as FieldValueForLocale<TEntry, TKey>;
    }

    const defaultLocale = options?.defaultLocale ?? DEFAULT_LOCALE;

    // Localized-style value: object keyed by locale codes
    if (typeof rawField === "object" && !Array.isArray(rawField)) {
        const byLocale = rawField as Record<string, unknown>;

        if (locale in byLocale) {
            return byLocale[locale] as FieldValueForLocale<TEntry, TKey>;
        }

        if ((options?.fallback !== false) && defaultLocale in byLocale) {
            return byLocale[defaultLocale] as FieldValueForLocale<TEntry, TKey>;
        }

        return undefined as FieldValueForLocale<TEntry, TKey>;
    }

    // Non-localized scalar value: return as-is
    return rawField as FieldValueForLocale<TEntry, TKey>;
}


/**
 * Type guard to check if a Contentful link is a resolved Entry
 *
 * Utilise le discriminant officiel `sys.type` ("Entry" vs "Link").
 */
export function isResolvedEntry<T extends EntrySkeletonType, Locales extends string>(
    link: Entry<T, "WITH_ALL_LOCALES", Locales> | UnresolvedLink<"Entry">
): link is Entry<T, "WITH_ALL_LOCALES", Locales> {
    return link.sys.type === "Entry";
}