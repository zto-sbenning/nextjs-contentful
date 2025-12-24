import type { Entry, EntrySkeletonType, LocaleCode, UnresolvedLink } from "contentful";
import { DEFAULT_LOCALE } from "../types";

type WithAllLocalesEntry<
    TEntry extends Entry<EntrySkeletonType, "WITH_ALL_LOCALES", Locales>,
    Locales extends LocaleCode
> = TEntry;

type FieldValueForLocale<
    TEntry extends Entry<EntrySkeletonType, "WITH_ALL_LOCALES", LocaleCode>,
    TKey extends keyof TEntry["fields"]
> = NonNullable<TEntry["fields"][TKey]> extends { [locale: string]: infer V }
    ? V | undefined
    : NonNullable<TEntry["fields"][TKey]> | undefined;

export interface GetFieldForLocaleOptions {
    fallback?: boolean;
    defaultLocale?: string;
}

export function getFieldForLocale<
    Locales extends LocaleCode,
    TEntry extends WithAllLocalesEntry<Entry<EntrySkeletonType, "WITH_ALL_LOCALES", Locales>, Locales>,
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