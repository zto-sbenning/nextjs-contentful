import { cva } from 'class-variance-authority';
import Image from 'next/image';
import Link from 'next/link';
import type { Asset, UnresolvedLink } from 'contentful';
import { cn } from '@/design-system/utils';
import Text from '@/design-system/ui/Text';
import { RichText, type RichTextClassNames } from '@/lib/contentful/RichText';
import { getFieldForLocale } from '@/lib/contentful/field';
import type { 
    TypeAssemblySectionWithAllLocalesResponse,
    TypeAssemblySectionWithAllLocalesAndWithoutUnresolvableLinksResponse 
} from '@/lib/contentful/content-types';

// =============================================================================
// TYPES
// =============================================================================

/** Variants disponibles pour AssemblySection */
export type SectionVariant = 'hero' | 'feature' | 'cta-banner' | 'media-text';

/** Type flexible pour accepter les sections avec ou sans link resolution */
type AssemblySectionEntry = 
    | TypeAssemblySectionWithAllLocalesResponse
    | TypeAssemblySectionWithAllLocalesAndWithoutUnresolvableLinksResponse;

/** Type flexible pour l'asset avec locales */
type LocalizedAsset = Asset<"WITH_ALL_LOCALES", string>;

export interface AssemblySectionProps {
    /** L'entry AssemblySection résolue avec toutes les locales */
    entry: AssemblySectionEntry;
    /** La locale à utiliser pour extraire les champs */
    locale: string;
    /** Classes CSS additionnelles */
    className?: string;
}

// =============================================================================
// HELPERS
// =============================================================================

/**
 * Type guard pour vérifier si un asset est résolu (pas un UnresolvedLink)
 */
function isResolvedAsset(
    asset: LocalizedAsset | UnresolvedLink<"Asset"> | undefined
): asset is LocalizedAsset {
    return asset !== undefined && asset.sys.type !== "Link";
}

// =============================================================================
// CVA - Section Variants
// =============================================================================

const sectionVariants = cva(
    // Base classes communes à tous les variants
    'relative w-full',
    {
        variants: {
            variant: {
                /**
                 * HERO - Grande section d'accroche
                 * Fond sombre (primary), texte clair, grand titre centré
                 */
                hero: [
                    'min-h-[70vh] flex items-center justify-center',
                    'bg-primary-900 text-white',
                    'py-20 px-6 md:px-12 lg:px-24',
                ].join(' '),

                /**
                 * FEATURE - Mise en avant d'une fonctionnalité
                 * Fond clair, layout image/texte côte à côte
                 */
                feature: [
                    'bg-neutral-50 text-neutral-900',
                    'py-16 px-6 md:px-12 lg:px-24',
                ].join(' '),

                /**
                 * CTA-BANNER - Bandeau d'incitation à l'action
                 * Fond accent (secondary), centré, CTA proéminent
                 */
                'cta-banner': [
                    'bg-secondary-600 text-white',
                    'py-12 px-6 md:px-12 lg:px-24',
                    'text-center',
                ].join(' '),

                /**
                 * MEDIA-TEXT - Bloc polyvalent texte + média
                 * Fond neutre, layout flexible
                 */
                'media-text': [
                    'bg-white text-neutral-800',
                    'py-16 px-6 md:px-12 lg:px-24',
                ].join(' '),
            },
        },
        defaultVariants: {
            variant: 'hero',
        },
    }
);

const containerVariants = cva('mx-auto w-full', {
    variants: {
        variant: {
            hero: 'max-w-4xl text-center',
            feature: 'max-w-7xl grid md:grid-cols-2 gap-8 md:gap-12 items-center',
            'cta-banner': 'max-w-3xl',
            'media-text': 'max-w-7xl grid md:grid-cols-2 gap-8 md:gap-12 items-center',
        },
    },
    defaultVariants: {
        variant: 'hero',
    },
});

const titleVariants = cva('font-title font-bold', {
    variants: {
        variant: {
            hero: 'text-4xl md:text-5xl lg:text-6xl mb-6',
            feature: 'text-2xl md:text-3xl lg:text-4xl mb-4',
            'cta-banner': 'text-2xl md:text-3xl lg:text-4xl mb-4',
            'media-text': 'text-2xl md:text-3xl mb-4',
        },
    },
    defaultVariants: {
        variant: 'hero',
    },
});

const ctaVariants = cva(
    'inline-flex items-center justify-center font-semibold transition-all duration-200 rounded-lg',
    {
        variants: {
            variant: {
                hero: [
                    'bg-white text-primary-900 hover:bg-primary-100',
                    'px-8 py-4 text-lg',
                    'shadow-lg hover:shadow-xl',
                ].join(' '),
                feature: [
                    'bg-primary-600 text-white hover:bg-primary-700',
                    'px-6 py-3 text-base',
                ].join(' '),
                'cta-banner': [
                    'bg-white text-secondary-700 hover:bg-secondary-50',
                    'px-8 py-4 text-lg',
                    'shadow-lg hover:shadow-xl',
                ].join(' '),
                'media-text': [
                    'bg-primary-600 text-white hover:bg-primary-700',
                    'px-6 py-3 text-base',
                ].join(' '),
            },
        },
        defaultVariants: {
            variant: 'hero',
        },
    }
);

// =============================================================================
// Rich Text ClassNames par variant
// =============================================================================

const richTextClassNamesByVariant: Record<SectionVariant, RichTextClassNames> = {
    hero: {
        paragraph: 'text-lg md:text-xl text-primary-100 mb-8 leading-relaxed',
        bold: 'text-white',
        link: 'text-primary-200 hover:text-white underline',
    },
    feature: {
        paragraph: 'text-base md:text-lg text-neutral-600 mb-6 leading-relaxed',
        bold: 'text-neutral-900',
        link: 'text-primary-600 hover:text-primary-700 underline',
    },
    'cta-banner': {
        paragraph: 'text-lg text-secondary-100 mb-6 leading-relaxed',
        bold: 'text-white',
        link: 'text-secondary-200 hover:text-white underline',
    },
    'media-text': {
        paragraph: 'text-base text-neutral-600 mb-4 leading-relaxed',
        bold: 'text-neutral-800',
        link: 'text-primary-600 hover:text-primary-700 underline',
        h1: 'text-2xl font-bold text-neutral-900 mb-4 mt-6',
        h2: 'text-xl font-bold text-neutral-900 mb-3 mt-5',
        h3: 'text-lg font-bold text-neutral-900 mb-3 mt-4',
        ulList: 'list-disc ml-6 mb-4 text-neutral-600',
        olList: 'list-decimal ml-6 mb-4 text-neutral-600',
    },
};

// =============================================================================
// HELPER - Normaliser le variant
// =============================================================================

function normalizeVariant(variant: string | undefined): SectionVariant {
    const validVariants: SectionVariant[] = ['hero', 'feature', 'cta-banner', 'media-text'];
    
    // Fallback pour les anciens variants
    if (variant === 'primary' || variant === 'secondary') {
        return 'hero';
    }
    
    if (variant && validVariants.includes(variant as SectionVariant)) {
        return variant as SectionVariant;
    }
    
    return 'hero';
}

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

interface SectionAssetProps {
    asset: LocalizedAsset;
    locale: string;
    variant: SectionVariant;
    className?: string;
}

function SectionAsset({ asset, locale, variant, className }: SectionAssetProps) {
    if (!asset?.fields?.file) return null;

    const fileByLocale = asset.fields.file;
    const file = fileByLocale[locale] ?? fileByLocale['en-US'];
    
    if (!file?.url) return null;

    const titleByLocale = asset.fields.title;
    const descriptionByLocale = asset.fields.description;
    
    const title = titleByLocale?.[locale] ?? titleByLocale?.['en-US'];
    const description = descriptionByLocale?.[locale] ?? descriptionByLocale?.['en-US'];

    const url = file.url.startsWith('//') ? `https:${file.url}` : file.url;
    const contentType = file.contentType;
    const imageDetails = file.details?.image;

    const isVideo = contentType?.startsWith('video/');
    const isImage = contentType?.startsWith('image/');

    const assetClasses = cn(
        'w-full h-auto object-cover',
        {
            'rounded-lg shadow-xl': variant === 'feature' || variant === 'media-text',
        },
        className
    );

    if (isVideo) {
        return (
            <video
                src={url}
                controls
                className={assetClasses}
                aria-label={title || description || 'Video'}
            />
        );
    }

    if (isImage) {
        // Pour hero, l'image est en background
        if (variant === 'hero') {
            return (
                <div className="absolute inset-0 overflow-hidden">
                    <Image
                        src={url}
                        alt={description || title || ''}
                        fill
                        className="object-cover opacity-30"
                        priority
                    />
                    <div className="absolute inset-0 bg-linear-to-b from-primary-900/50 to-primary-900/90" />
                </div>
            );
        }

        return (
            <Image
                src={url}
                alt={description || title || ''}
                width={imageDetails?.width || 800}
                height={imageDetails?.height || 600}
                className={assetClasses}
            />
        );
    }

    return null;
}

interface SectionCtaProps {
    label: string | undefined;
    link: string | undefined;
    target: 'blank' | 'self' | undefined;
    active: boolean | undefined;
    variant: SectionVariant;
}

function SectionCta({ label, link, target, active, variant }: SectionCtaProps) {
    if (!active || !label || !link) return null;

    const isExternal = link.startsWith('http') || link.startsWith('//');
    const ctaClass = ctaVariants({ variant });

    if (isExternal || target === 'blank') {
        return (
            <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className={ctaClass}
            >
                {label}
            </a>
        );
    }

    return (
        <Link href={link as '/'} className={ctaClass}>
            {label}
        </Link>
    );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

/**
 * AssemblySection - Composant pour afficher une section Contentful
 * 
 * Supporte 4 variants :
 * - `hero` : Grande section d'accroche avec fond sombre
 * - `feature` : Mise en avant avec image/texte côte à côte
 * - `cta-banner` : Bandeau d'incitation centré
 * - `media-text` : Bloc polyvalent texte + média
 * 
 * @example
 * ```tsx
 * <AssemblySection 
 *   entry={sectionEntry} 
 *   locale="en-US" 
 * />
 * ```
 */
export default function AssemblySection({ entry, locale, className }: AssemblySectionProps) {
    // Extraire les champs avec getFieldForLocale
    const active = getFieldForLocale(entry, 'active', locale);
    
    // Ne pas rendre si la section n'est pas active
    if (active === false) return null;

    const rawVariant = getFieldForLocale(entry, 'variant', locale);
    const variant = normalizeVariant(rawVariant);
    
    const title = getFieldForLocale(entry, 'title', locale);
    const description = getFieldForLocale(entry, 'description', locale);
    const rawAsset = getFieldForLocale(entry, 'asset', locale);
    const ctaLabel = getFieldForLocale(entry, 'ctaLabel', locale);
    const ctaLink = getFieldForLocale(entry, 'ctaLink', locale);
    const ctaTarget = getFieldForLocale(entry, 'ctaTarget', locale);
    const ctaActive = getFieldForLocale(entry, 'ctaActive', locale);

    // Vérifier si l'asset est résolu (pas un UnresolvedLink)
    const asset = isResolvedAsset(rawAsset) ? rawAsset : undefined;

    const richTextClassNames = richTextClassNamesByVariant[variant];

    // Render selon le variant
    return (
        <section className={cn(sectionVariants({ variant }), className)}>
            {/* Background asset pour hero */}
            {variant === 'hero' && asset && (
                <SectionAsset asset={asset} locale={locale} variant={variant} />
            )}

            <div className={cn(containerVariants({ variant }), variant === 'hero' && 'relative z-10')}>
                {/* Layout pour feature et media-text : Image à gauche */}
                {(variant === 'feature' || variant === 'media-text') && asset && (
                    <div className="order-1 md:order-0">
                        <SectionAsset asset={asset} locale={locale} variant={variant} />
                    </div>
                )}

                {/* Contenu textuel */}
                <div className={cn(
                    variant === 'feature' || variant === 'media-text' ? 'order-2 md:order-0' : ''
                )}>
                    {title && (
                        <Text 
                            as="h2" 
                            className={titleVariants({ variant })}
                            ztEllipsis="none"
                        >
                            {title}
                        </Text>
                    )}

                    {description && (
                        <RichText 
                            content={description} 
                            classNames={richTextClassNames}
                        />
                    )}

                    <SectionCta
                        label={ctaLabel}
                        link={ctaLink}
                        target={ctaTarget}
                        active={ctaActive}
                        variant={variant}
                    />
                </div>
            </div>
        </section>
    );
}

// =============================================================================
// EXPORTS
// =============================================================================

export { sectionVariants, containerVariants, titleVariants, ctaVariants };
