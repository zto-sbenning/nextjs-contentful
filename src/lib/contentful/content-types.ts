import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";

/**
 * Fields type definition for content type 'TypeAssemblySection'
 * @name TypeAssemblySectionFields
 * @type {TypeAssemblySectionFields}
 * @memberof TypeAssemblySection
 */
export interface TypeAssemblySectionFields {
    /**
     * Field type definition for field 'displayName' (Display Name)
     * @name Display Name
     * @localized false
     */
    displayName: EntryFieldTypes.Symbol;
    /**
     * Field type definition for field 'variant' (Variant)
     * @name Variant
     * @localized true
     */
    variant: EntryFieldTypes.Symbol;
    /**
     * Field type definition for field 'title' (Title)
     * @name Title
     * @localized true
     */
    title?: EntryFieldTypes.Symbol;
    /**
     * Field type definition for field 'description' (Description)
     * @name Description
     * @localized true
     */
    description?: EntryFieldTypes.RichText;
    /**
     * Field type definition for field 'asset' (Asset)
     * @name Asset
     * @localized true
     */
    asset?: EntryFieldTypes.AssetLink;
    /**
     * Field type definition for field 'ctaLabel' (CTA - Label)
     * @name CTA - Label
     * @localized true
     */
    ctaLabel?: EntryFieldTypes.Symbol;
    /**
     * Field type definition for field 'ctaLink' (CTA - Link)
     * @name CTA - Link
     * @localized true
     */
    ctaLink?: EntryFieldTypes.Symbol;
    /**
     * Field type definition for field 'ctaReference' (CTA - Reference)
     * @name CTA - Reference
     * @localized false
     */
    ctaReference?: EntryFieldTypes.EntryLink<EntrySkeletonType>;
    /**
     * Field type definition for field 'ctaTarget' (CTA - Target)
     * @name CTA - Target
     * @localized false
     */
    ctaTarget: EntryFieldTypes.Symbol<"blank" | "self">;
    /**
     * Field type definition for field 'active' (Active)
     * @name Active
     * @localized true
     */
    active: EntryFieldTypes.Boolean;
    /**
     * Field type definition for field 'ctaActive' (CTA - Active)
     * @name CTA - Active
     * @localized true
     */
    ctaActive?: EntryFieldTypes.Boolean;
}

/**
 * Entry skeleton type definition for content type 'assemblySection' (Assembly - Section)
 * @name TypeAssemblySectionSkeleton
 * @type {TypeAssemblySectionSkeleton}
 * @author 4Y0K01rlOwTVtk8ktFPYxH
 * @since 2025-12-23T09:15:10.787Z
 * @version 3
 */
export type TypeAssemblySectionSkeleton = EntrySkeletonType<TypeAssemblySectionFields, "assemblySection">;
/**
 * Entry type definition for content type 'assemblySection' (Assembly - Section)
 * @name TypeAssemblySection
 * @type {TypeAssemblySection}
 * @author Samuel Benning<samuel.benning@zento.fr>
 * @since 2025-12-23T09:15:10.787Z
 * @version 3
 * @link https://app.contentful.com/spaces/zc3pnfs68jvd/environments/master/content_types/assemblySection
 */
export type TypeAssemblySection<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeAssemblySectionSkeleton, Modifiers, Locales>;

export function isTypeAssemblySection<Modifiers extends ChainModifiers, Locales extends LocaleCode>(entry: Entry<EntrySkeletonType, Modifiers, Locales>): entry is TypeAssemblySection<Modifiers, Locales> {
    return entry.sys.contentType.sys.id === 'assemblySection'
}

export type TypeAssemblySectionWithoutLinkResolutionResponse = TypeAssemblySection<"WITHOUT_LINK_RESOLUTION">;
export type TypeAssemblySectionWithoutUnresolvableLinksResponse = TypeAssemblySection<"WITHOUT_UNRESOLVABLE_LINKS">;
export type TypeAssemblySectionWithAllLocalesResponse<Locales extends LocaleCode = LocaleCode> = TypeAssemblySection<"WITH_ALL_LOCALES", Locales>;
export type TypeAssemblySectionWithAllLocalesAndWithoutLinkResolutionResponse<Locales extends LocaleCode = LocaleCode> = TypeAssemblySection<"WITHOUT_LINK_RESOLUTION" | "WITH_ALL_LOCALES", Locales>;
export type TypeAssemblySectionWithAllLocalesAndWithoutUnresolvableLinksResponse<Locales extends LocaleCode = LocaleCode> = TypeAssemblySection<"WITHOUT_UNRESOLVABLE_LINKS" | "WITH_ALL_LOCALES", Locales>;

/**
 * Fields type definition for content type 'TypeConfigNavigationNode'
 * @name TypeConfigNavigationNodeFields
 * @type {TypeConfigNavigationNodeFields}
 * @memberof TypeConfigNavigationNode
 */
export interface TypeConfigNavigationNodeFields {
    /**
     * Field type definition for field 'displayName' (Display Name)
     * @name Display Name
     * @localized false
     */
    displayName: EntryFieldTypes.Symbol;
    /**
     * Field type definition for field 'label' (Label)
     * @name Label
     * @localized true
     */
    label: EntryFieldTypes.Symbol;
    /**
     * Field type definition for field 'link' (Link)
     * @name Link
     * @localized true
     */
    link?: EntryFieldTypes.Symbol;
    /**
     * Field type definition for field 'linkedEntry' (Linked Entry)
     * @name Linked Entry
     * @localized false
     */
    linkedEntry?: EntryFieldTypes.EntryLink<TypeTopicCollectionSkeleton | TypeTopicLandingSkeleton | TypeTopicProjectSkeleton | TypeTopicTechnologySkeleton>;
    /**
     * Field type definition for field 'order' (Order)
     * @name Order
     * @localized false
     */
    order?: EntryFieldTypes.Integer;
    /**
     * Field type definition for field 'parent' (Parent)
     * @name Parent
     * @localized false
     */
    parent?: EntryFieldTypes.EntryLink<TypeConfigNavigationNodeSkeleton>;
}

/**
 * Entry skeleton type definition for content type 'configNavigationNode' (Config - Navigation Node)
 * @name TypeConfigNavigationNodeSkeleton
 * @type {TypeConfigNavigationNodeSkeleton}
 * @author 4Y0K01rlOwTVtk8ktFPYxH
 * @since 2025-12-23T10:30:10.430Z
 * @version 3
 */
export type TypeConfigNavigationNodeSkeleton = EntrySkeletonType<TypeConfigNavigationNodeFields, "configNavigationNode">;
/**
 * Entry type definition for content type 'configNavigationNode' (Config - Navigation Node)
 * @name TypeConfigNavigationNode
 * @type {TypeConfigNavigationNode}
 * @author Samuel Benning<samuel.benning@zento.fr>
 * @since 2025-12-23T10:30:10.430Z
 * @version 3
 * @link https://app.contentful.com/spaces/zc3pnfs68jvd/environments/master/content_types/configNavigationNode
 */
export type TypeConfigNavigationNode<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeConfigNavigationNodeSkeleton, Modifiers, Locales>;

export function isTypeConfigNavigationNode<Modifiers extends ChainModifiers, Locales extends LocaleCode>(entry: Entry<EntrySkeletonType, Modifiers, Locales>): entry is TypeConfigNavigationNode<Modifiers, Locales> {
    return entry.sys.contentType.sys.id === 'configNavigationNode'
}

export type TypeConfigNavigationNodeWithoutLinkResolutionResponse = TypeConfigNavigationNode<"WITHOUT_LINK_RESOLUTION">;
export type TypeConfigNavigationNodeWithoutUnresolvableLinksResponse = TypeConfigNavigationNode<"WITHOUT_UNRESOLVABLE_LINKS">;
export type TypeConfigNavigationNodeWithAllLocalesResponse<Locales extends LocaleCode = LocaleCode> = TypeConfigNavigationNode<"WITH_ALL_LOCALES", Locales>;
export type TypeConfigNavigationNodeWithAllLocalesAndWithoutLinkResolutionResponse<Locales extends LocaleCode = LocaleCode> = TypeConfigNavigationNode<"WITHOUT_LINK_RESOLUTION" | "WITH_ALL_LOCALES", Locales>;
export type TypeConfigNavigationNodeWithAllLocalesAndWithoutUnresolvableLinksResponse<Locales extends LocaleCode = LocaleCode> = TypeConfigNavigationNode<"WITHOUT_UNRESOLVABLE_LINKS" | "WITH_ALL_LOCALES", Locales>;

/**
 * Fields type definition for content type 'TypeConfigPageTemplate'
 * @name TypeConfigPageTemplateFields
 * @type {TypeConfigPageTemplateFields}
 * @memberof TypeConfigPageTemplate
 */
export interface TypeConfigPageTemplateFields {
    /**
     * Field type definition for field 'displayName' (Display Name)
     * @name Display Name
     * @localized false
     */
    displayName: EntryFieldTypes.Symbol;
    /**
     * Field type definition for field 'templateId' (Template ID)
     * @name Template ID
     * @localized false
     */
    templateId: EntryFieldTypes.Symbol;
    /**
     * Field type definition for field 'urlPattern' (URL Pattern)
     * @name URL Pattern
     * @localized true
     */
    urlPattern: EntryFieldTypes.Symbol;
    /**
     * Field type definition for field 'sections' (Sections)
     * @name Sections
     * @localized true
     */
    sections?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeAssemblySectionSkeleton>>;
}

/**
 * Entry skeleton type definition for content type 'configPageTemplate' (Config - Page Template)
 * @name TypeConfigPageTemplateSkeleton
 * @type {TypeConfigPageTemplateSkeleton}
 * @author 4Y0K01rlOwTVtk8ktFPYxH
 * @since 2025-12-23T10:12:31.062Z
 * @version 1
 */
export type TypeConfigPageTemplateSkeleton = EntrySkeletonType<TypeConfigPageTemplateFields, "configPageTemplate">;
/**
 * Entry type definition for content type 'configPageTemplate' (Config - Page Template)
 * @name TypeConfigPageTemplate
 * @type {TypeConfigPageTemplate}
 * @author Samuel Benning<samuel.benning@zento.fr>
 * @since 2025-12-23T10:12:31.062Z
 * @version 1
 * @link https://app.contentful.com/spaces/zc3pnfs68jvd/environments/master/content_types/configPageTemplate
 */
export type TypeConfigPageTemplate<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeConfigPageTemplateSkeleton, Modifiers, Locales>;

export function isTypeConfigPageTemplate<Modifiers extends ChainModifiers, Locales extends LocaleCode>(entry: Entry<EntrySkeletonType, Modifiers, Locales>): entry is TypeConfigPageTemplate<Modifiers, Locales> {
    return entry.sys.contentType.sys.id === 'configPageTemplate'
}

export type TypeConfigPageTemplateWithoutLinkResolutionResponse = TypeConfigPageTemplate<"WITHOUT_LINK_RESOLUTION">;
export type TypeConfigPageTemplateWithoutUnresolvableLinksResponse = TypeConfigPageTemplate<"WITHOUT_UNRESOLVABLE_LINKS">;
export type TypeConfigPageTemplateWithAllLocalesResponse<Locales extends LocaleCode = LocaleCode> = TypeConfigPageTemplate<"WITH_ALL_LOCALES", Locales>;
export type TypeConfigPageTemplateWithAllLocalesAndWithoutLinkResolutionResponse<Locales extends LocaleCode = LocaleCode> = TypeConfigPageTemplate<"WITHOUT_LINK_RESOLUTION" | "WITH_ALL_LOCALES", Locales>;
export type TypeConfigPageTemplateWithAllLocalesAndWithoutUnresolvableLinksResponse<Locales extends LocaleCode = LocaleCode> = TypeConfigPageTemplate<"WITHOUT_UNRESOLVABLE_LINKS" | "WITH_ALL_LOCALES", Locales>;

/**
 * Fields type definition for content type 'TypeFacetListingConfig'
 * @name TypeFacetListingConfigFields
 * @type {TypeFacetListingConfigFields}
 * @memberof TypeFacetListingConfig
 */
export interface TypeFacetListingConfigFields {
    /**
     * Field type definition for field 'displayName' (Display Name)
     * @name Display Name
     * @localized false
     */
    displayName: EntryFieldTypes.Symbol;
    /**
     * Field type definition for field 'topicType' (Topic Type)
     * @name Topic Type
     * @localized false
     */
    topicType: EntryFieldTypes.Symbol<"landing" | "project" | "technology">;
    /**
     * Field type definition for field 'filters' (Filters)
     * @name Filters
     * @localized false
     */
    filters?: EntryFieldTypes.Object;
    /**
     * Field type definition for field 'sort' (Sort)
     * @name Sort
     * @localized false
     */
    sort?: EntryFieldTypes.Symbol;
    /**
     * Field type definition for field 'limit' (Limit)
     * @name Limit
     * @localized false
     */
    limit?: EntryFieldTypes.Integer;
    /**
     * Field type definition for field 'pagination' (Pagination)
     * @name Pagination
     * @localized false
     */
    pagination?: EntryFieldTypes.Boolean;
}

/**
 * Entry skeleton type definition for content type 'facetListingConfig' (Facet - Listing Config)
 * @name TypeFacetListingConfigSkeleton
 * @type {TypeFacetListingConfigSkeleton}
 * @author 4Y0K01rlOwTVtk8ktFPYxH
 * @since 2025-12-23T10:16:32.541Z
 * @version 1
 */
export type TypeFacetListingConfigSkeleton = EntrySkeletonType<TypeFacetListingConfigFields, "facetListingConfig">;
/**
 * Entry type definition for content type 'facetListingConfig' (Facet - Listing Config)
 * @name TypeFacetListingConfig
 * @type {TypeFacetListingConfig}
 * @author Samuel Benning<samuel.benning@zento.fr>
 * @since 2025-12-23T10:16:32.541Z
 * @version 1
 * @link https://app.contentful.com/spaces/zc3pnfs68jvd/environments/master/content_types/facetListingConfig
 */
export type TypeFacetListingConfig<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeFacetListingConfigSkeleton, Modifiers, Locales>;

export function isTypeFacetListingConfig<Modifiers extends ChainModifiers, Locales extends LocaleCode>(entry: Entry<EntrySkeletonType, Modifiers, Locales>): entry is TypeFacetListingConfig<Modifiers, Locales> {
    return entry.sys.contentType.sys.id === 'facetListingConfig'
}

export type TypeFacetListingConfigWithoutLinkResolutionResponse = TypeFacetListingConfig<"WITHOUT_LINK_RESOLUTION">;
export type TypeFacetListingConfigWithoutUnresolvableLinksResponse = TypeFacetListingConfig<"WITHOUT_UNRESOLVABLE_LINKS">;
export type TypeFacetListingConfigWithAllLocalesResponse<Locales extends LocaleCode = LocaleCode> = TypeFacetListingConfig<"WITH_ALL_LOCALES", Locales>;
export type TypeFacetListingConfigWithAllLocalesAndWithoutLinkResolutionResponse<Locales extends LocaleCode = LocaleCode> = TypeFacetListingConfig<"WITHOUT_LINK_RESOLUTION" | "WITH_ALL_LOCALES", Locales>;
export type TypeFacetListingConfigWithAllLocalesAndWithoutUnresolvableLinksResponse<Locales extends LocaleCode = LocaleCode> = TypeFacetListingConfig<"WITHOUT_UNRESOLVABLE_LINKS" | "WITH_ALL_LOCALES", Locales>;

/**
 * Fields type definition for content type 'TypeFacetSeo'
 * @name TypeFacetSeoFields
 * @type {TypeFacetSeoFields}
 * @memberof TypeFacetSeo
 */
export interface TypeFacetSeoFields {
    /**
     * Field type definition for field 'metaTitle' (Meta Title)
     * @name Meta Title
     * @localized true
     */
    metaTitle: EntryFieldTypes.Symbol;
    /**
     * Field type definition for field 'metaDescription' (Meta Description)
     * @name Meta Description
     * @localized true
     */
    metaDescription?: EntryFieldTypes.Text;
    /**
     * Field type definition for field 'noIndex' (No Index)
     * @name No Index
     * @localized true
     */
    noIndex?: EntryFieldTypes.Boolean;
    /**
     * Field type definition for field 'noFollow' (No Follow)
     * @name No Follow
     * @localized true
     */
    noFollow?: EntryFieldTypes.Boolean;
}

/**
 * Entry skeleton type definition for content type 'facetSeo' (Facet - SEO)
 * @name TypeFacetSeoSkeleton
 * @type {TypeFacetSeoSkeleton}
 * @author 4Y0K01rlOwTVtk8ktFPYxH
 * @since 2025-12-23T10:18:35.762Z
 * @version 1
 */
export type TypeFacetSeoSkeleton = EntrySkeletonType<TypeFacetSeoFields, "facetSeo">;
/**
 * Entry type definition for content type 'facetSeo' (Facet - SEO)
 * @name TypeFacetSeo
 * @type {TypeFacetSeo}
 * @author Samuel Benning<samuel.benning@zento.fr>
 * @since 2025-12-23T10:18:35.762Z
 * @version 1
 * @link https://app.contentful.com/spaces/zc3pnfs68jvd/environments/master/content_types/facetSeo
 */
export type TypeFacetSeo<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeFacetSeoSkeleton, Modifiers, Locales>;

export function isTypeFacetSeo<Modifiers extends ChainModifiers, Locales extends LocaleCode>(entry: Entry<EntrySkeletonType, Modifiers, Locales>): entry is TypeFacetSeo<Modifiers, Locales> {
    return entry.sys.contentType.sys.id === 'facetSeo'
}

export type TypeFacetSeoWithoutLinkResolutionResponse = TypeFacetSeo<"WITHOUT_LINK_RESOLUTION">;
export type TypeFacetSeoWithoutUnresolvableLinksResponse = TypeFacetSeo<"WITHOUT_UNRESOLVABLE_LINKS">;
export type TypeFacetSeoWithAllLocalesResponse<Locales extends LocaleCode = LocaleCode> = TypeFacetSeo<"WITH_ALL_LOCALES", Locales>;
export type TypeFacetSeoWithAllLocalesAndWithoutLinkResolutionResponse<Locales extends LocaleCode = LocaleCode> = TypeFacetSeo<"WITHOUT_LINK_RESOLUTION" | "WITH_ALL_LOCALES", Locales>;
export type TypeFacetSeoWithAllLocalesAndWithoutUnresolvableLinksResponse<Locales extends LocaleCode = LocaleCode> = TypeFacetSeo<"WITHOUT_UNRESOLVABLE_LINKS" | "WITH_ALL_LOCALES", Locales>;

/**
 * Fields type definition for content type 'TypeTopicCollection'
 * @name TypeTopicCollectionFields
 * @type {TypeTopicCollectionFields}
 * @memberof TypeTopicCollection
 */
export interface TypeTopicCollectionFields {
    /**
     * Field type definition for field 'displayName' (Display Name)
     * @name Display Name
     * @localized false
     */
    displayName: EntryFieldTypes.Symbol;
    /**
     * Field type definition for field 'title' (Title)
     * @name Title
     * @localized true
     */
    title: EntryFieldTypes.Symbol;
    /**
     * Field type definition for field 'description' (Description)
     * @name Description
     * @localized true
     */
    description?: EntryFieldTypes.RichText;
    /**
     * Field type definition for field 'slug' (Slug)
     * @name Slug
     * @localized true
     */
    slug: EntryFieldTypes.Symbol;
    /**
     * Field type definition for field 'active' (Active)
     * @name Active
     * @localized true
     */
    active: EntryFieldTypes.Boolean;
    /**
     * Field type definition for field 'channels' (Channels)
     * @name Channels
     * @localized true
     */
    channels?: EntryFieldTypes.Array<EntryFieldTypes.Symbol>;
    /**
     * Field type definition for field 'pageTemplate' (Page Template)
     * @name Page Template
     * @localized false
     */
    pageTemplate: EntryFieldTypes.EntryLink<TypeConfigPageTemplateSkeleton>;
    /**
     * Field type definition for field 'seo' (SEO)
     * @name SEO
     * @localized false
     */
    seo: EntryFieldTypes.EntryLink<TypeFacetSeoSkeleton>;
    /**
     * Field type definition for field 'listingConfig' (Listing Config)
     * @name Listing Config
     * @localized false
     */
    listingConfig: EntryFieldTypes.EntryLink<TypeFacetListingConfigSkeleton>;
}

/**
 * Entry skeleton type definition for content type 'topicCollection' (Topic - Collection)
 * @name TypeTopicCollectionSkeleton
 * @type {TypeTopicCollectionSkeleton}
 * @author 4Y0K01rlOwTVtk8ktFPYxH
 * @since 2025-12-23T10:26:02.284Z
 * @version 3
 */
export type TypeTopicCollectionSkeleton = EntrySkeletonType<TypeTopicCollectionFields, "topicCollection">;
/**
 * Entry type definition for content type 'topicCollection' (Topic - Collection)
 * @name TypeTopicCollection
 * @type {TypeTopicCollection}
 * @author Samuel Benning<samuel.benning@zento.fr>
 * @since 2025-12-23T10:26:02.284Z
 * @version 3
 * @link https://app.contentful.com/spaces/zc3pnfs68jvd/environments/master/content_types/topicCollection
 */
export type TypeTopicCollection<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeTopicCollectionSkeleton, Modifiers, Locales>;

export function isTypeTopicCollection<Modifiers extends ChainModifiers, Locales extends LocaleCode>(entry: Entry<EntrySkeletonType, Modifiers, Locales>): entry is TypeTopicCollection<Modifiers, Locales> {
    return entry.sys.contentType.sys.id === 'topicCollection'
}

export type TypeTopicCollectionWithoutLinkResolutionResponse = TypeTopicCollection<"WITHOUT_LINK_RESOLUTION">;
export type TypeTopicCollectionWithoutUnresolvableLinksResponse = TypeTopicCollection<"WITHOUT_UNRESOLVABLE_LINKS">;
export type TypeTopicCollectionWithAllLocalesResponse<Locales extends LocaleCode = LocaleCode> = TypeTopicCollection<"WITH_ALL_LOCALES", Locales>;
export type TypeTopicCollectionWithAllLocalesAndWithoutLinkResolutionResponse<Locales extends LocaleCode = LocaleCode> = TypeTopicCollection<"WITHOUT_LINK_RESOLUTION" | "WITH_ALL_LOCALES", Locales>;
export type TypeTopicCollectionWithAllLocalesAndWithoutUnresolvableLinksResponse<Locales extends LocaleCode = LocaleCode> = TypeTopicCollection<"WITHOUT_UNRESOLVABLE_LINKS" | "WITH_ALL_LOCALES", Locales>;

/**
 * Fields type definition for content type 'TypeTopicLanding'
 * @name TypeTopicLandingFields
 * @type {TypeTopicLandingFields}
 * @memberof TypeTopicLanding
 */
export interface TypeTopicLandingFields {
    /**
     * Field type definition for field 'displayName' (Display Name)
     * @name Display Name
     * @localized false
     */
    displayName: EntryFieldTypes.Symbol;
    /**
     * Field type definition for field 'title' (Title)
     * @name Title
     * @localized true
     */
    title: EntryFieldTypes.Symbol;
    /**
     * Field type definition for field 'description' (Description)
     * @name Description
     * @localized true
     */
    description?: EntryFieldTypes.RichText;
    /**
     * Field type definition for field 'slug' (Slug)
     * @name Slug
     * @localized true
     */
    slug: EntryFieldTypes.Symbol;
    /**
     * Field type definition for field 'active' (Active)
     * @name Active
     * @localized true
     */
    active: EntryFieldTypes.Boolean;
    /**
     * Field type definition for field 'channels' (Channels)
     * @name Channels
     * @localized true
     */
    channels?: EntryFieldTypes.Array<EntryFieldTypes.Symbol>;
    /**
     * Field type definition for field 'pageTemplate' (Page Template)
     * @name Page Template
     * @localized false
     */
    pageTemplate: EntryFieldTypes.EntryLink<TypeConfigPageTemplateSkeleton>;
    /**
     * Field type definition for field 'seo' (SEO)
     * @name SEO
     * @localized false
     */
    seo: EntryFieldTypes.EntryLink<TypeFacetSeoSkeleton>;
}

/**
 * Entry skeleton type definition for content type 'topicLanding' (Topic - Landing)
 * @name TypeTopicLandingSkeleton
 * @type {TypeTopicLandingSkeleton}
 * @author 4Y0K01rlOwTVtk8ktFPYxH
 * @since 2025-12-23T09:06:56.584Z
 * @version 5
 */
export type TypeTopicLandingSkeleton = EntrySkeletonType<TypeTopicLandingFields, "topicLanding">;
/**
 * Entry type definition for content type 'topicLanding' (Topic - Landing)
 * @name TypeTopicLanding
 * @type {TypeTopicLanding}
 * @author Samuel Benning<samuel.benning@zento.fr>
 * @since 2025-12-23T09:06:56.584Z
 * @version 5
 * @link https://app.contentful.com/spaces/zc3pnfs68jvd/environments/master/content_types/topicLanding
 */
export type TypeTopicLanding<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeTopicLandingSkeleton, Modifiers, Locales>;

export function isTypeTopicLanding<Modifiers extends ChainModifiers, Locales extends LocaleCode>(entry: Entry<EntrySkeletonType, Modifiers, Locales>): entry is TypeTopicLanding<Modifiers, Locales> {
    return entry.sys.contentType.sys.id === 'topicLanding'
}

export type TypeTopicLandingWithoutLinkResolutionResponse = TypeTopicLanding<"WITHOUT_LINK_RESOLUTION">;
export type TypeTopicLandingWithoutUnresolvableLinksResponse = TypeTopicLanding<"WITHOUT_UNRESOLVABLE_LINKS">;
export type TypeTopicLandingWithAllLocalesResponse<Locales extends LocaleCode = LocaleCode> = TypeTopicLanding<"WITH_ALL_LOCALES", Locales>;
export type TypeTopicLandingWithAllLocalesAndWithoutLinkResolutionResponse<Locales extends LocaleCode = LocaleCode> = TypeTopicLanding<"WITHOUT_LINK_RESOLUTION" | "WITH_ALL_LOCALES", Locales>;
export type TypeTopicLandingWithAllLocalesAndWithoutUnresolvableLinksResponse<Locales extends LocaleCode = LocaleCode> = TypeTopicLanding<"WITHOUT_UNRESOLVABLE_LINKS" | "WITH_ALL_LOCALES", Locales>;

/**
 * Fields type definition for content type 'TypeTopicProject'
 * @name TypeTopicProjectFields
 * @type {TypeTopicProjectFields}
 * @memberof TypeTopicProject
 */
export interface TypeTopicProjectFields {
    /**
     * Field type definition for field 'displayName' (Display Name)
     * @name Display Name
     * @localized false
     */
    displayName: EntryFieldTypes.Symbol;
    /**
     * Field type definition for field 'title' (Title)
     * @name Title
     * @localized true
     */
    title: EntryFieldTypes.Symbol;
    /**
     * Field type definition for field 'description' (Description)
     * @name Description
     * @localized true
     */
    description?: EntryFieldTypes.RichText;
    /**
     * Field type definition for field 'slug' (Slug)
     * @name Slug
     * @localized true
     */
    slug: EntryFieldTypes.Symbol;
    /**
     * Field type definition for field 'active' (Active)
     * @name Active
     * @localized true
     */
    active: EntryFieldTypes.Boolean;
    /**
     * Field type definition for field 'channels' (Channels)
     * @name Channels
     * @localized true
     */
    channels?: EntryFieldTypes.Array<EntryFieldTypes.Symbol>;
    /**
     * Field type definition for field 'pageTemplate' (Page Template)
     * @name Page Template
     * @localized false
     */
    pageTemplate: EntryFieldTypes.EntryLink<TypeConfigPageTemplateSkeleton>;
    /**
     * Field type definition for field 'seo' (SEO)
     * @name SEO
     * @localized false
     */
    seo: EntryFieldTypes.EntryLink<TypeFacetSeoSkeleton>;
}

/**
 * Entry skeleton type definition for content type 'topicProject' (Topic - Project)
 * @name TypeTopicProjectSkeleton
 * @type {TypeTopicProjectSkeleton}
 * @author 4Y0K01rlOwTVtk8ktFPYxH
 * @since 2025-12-23T09:05:54.732Z
 * @version 3
 */
export type TypeTopicProjectSkeleton = EntrySkeletonType<TypeTopicProjectFields, "topicProject">;
/**
 * Entry type definition for content type 'topicProject' (Topic - Project)
 * @name TypeTopicProject
 * @type {TypeTopicProject}
 * @author Samuel Benning<samuel.benning@zento.fr>
 * @since 2025-12-23T09:05:54.732Z
 * @version 3
 * @link https://app.contentful.com/spaces/zc3pnfs68jvd/environments/master/content_types/topicProject
 */
export type TypeTopicProject<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeTopicProjectSkeleton, Modifiers, Locales>;

export function isTypeTopicProject<Modifiers extends ChainModifiers, Locales extends LocaleCode>(entry: Entry<EntrySkeletonType, Modifiers, Locales>): entry is TypeTopicProject<Modifiers, Locales> {
    return entry.sys.contentType.sys.id === 'topicProject'
}

export type TypeTopicProjectWithoutLinkResolutionResponse = TypeTopicProject<"WITHOUT_LINK_RESOLUTION">;
export type TypeTopicProjectWithoutUnresolvableLinksResponse = TypeTopicProject<"WITHOUT_UNRESOLVABLE_LINKS">;
export type TypeTopicProjectWithAllLocalesResponse<Locales extends LocaleCode = LocaleCode> = TypeTopicProject<"WITH_ALL_LOCALES", Locales>;
export type TypeTopicProjectWithAllLocalesAndWithoutLinkResolutionResponse<Locales extends LocaleCode = LocaleCode> = TypeTopicProject<"WITHOUT_LINK_RESOLUTION" | "WITH_ALL_LOCALES", Locales>;
export type TypeTopicProjectWithAllLocalesAndWithoutUnresolvableLinksResponse<Locales extends LocaleCode = LocaleCode> = TypeTopicProject<"WITHOUT_UNRESOLVABLE_LINKS" | "WITH_ALL_LOCALES", Locales>;

/**
 * Fields type definition for content type 'TypeTopicTechnology'
 * @name TypeTopicTechnologyFields
 * @type {TypeTopicTechnologyFields}
 * @memberof TypeTopicTechnology
 */
export interface TypeTopicTechnologyFields {
    /**
     * Field type definition for field 'displayName' (Display Name)
     * @name Display Name
     * @localized false
     */
    displayName: EntryFieldTypes.Symbol;
    /**
     * Field type definition for field 'title' (Title)
     * @name Title
     * @localized true
     */
    title: EntryFieldTypes.Symbol;
    /**
     * Field type definition for field 'description' (Description)
     * @name Description
     * @localized true
     */
    description?: EntryFieldTypes.RichText;
    /**
     * Field type definition for field 'slug' (Slug)
     * @name Slug
     * @localized true
     */
    slug: EntryFieldTypes.Symbol;
    /**
     * Field type definition for field 'active' (Active)
     * @name Active
     * @localized true
     */
    active: EntryFieldTypes.Boolean;
    /**
     * Field type definition for field 'channels' (Channels)
     * @name Channels
     * @localized true
     */
    channels?: EntryFieldTypes.Array<EntryFieldTypes.Symbol>;
    /**
     * Field type definition for field 'pageTemplate' (Page Template)
     * @name Page Template
     * @localized false
     */
    pageTemplate: EntryFieldTypes.EntryLink<TypeConfigPageTemplateSkeleton>;
    /**
     * Field type definition for field 'seo' (SEO)
     * @name SEO
     * @localized false
     */
    seo: EntryFieldTypes.EntryLink<TypeFacetSeoSkeleton>;
}

/**
 * Entry skeleton type definition for content type 'topicTechnology' (Topic - Technology)
 * @name TypeTopicTechnologySkeleton
 * @type {TypeTopicTechnologySkeleton}
 * @author 4Y0K01rlOwTVtk8ktFPYxH
 * @since 2025-12-23T09:05:10.599Z
 * @version 5
 */
export type TypeTopicTechnologySkeleton = EntrySkeletonType<TypeTopicTechnologyFields, "topicTechnology">;
/**
 * Entry type definition for content type 'topicTechnology' (Topic - Technology)
 * @name TypeTopicTechnology
 * @type {TypeTopicTechnology}
 * @author Samuel Benning<samuel.benning@zento.fr>
 * @since 2025-12-23T09:05:10.599Z
 * @version 5
 * @link https://app.contentful.com/spaces/zc3pnfs68jvd/environments/master/content_types/topicTechnology
 */
export type TypeTopicTechnology<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeTopicTechnologySkeleton, Modifiers, Locales>;

export function isTypeTopicTechnology<Modifiers extends ChainModifiers, Locales extends LocaleCode>(entry: Entry<EntrySkeletonType, Modifiers, Locales>): entry is TypeTopicTechnology<Modifiers, Locales> {
    return entry.sys.contentType.sys.id === 'topicTechnology'
}

export type TypeTopicTechnologyWithoutLinkResolutionResponse = TypeTopicTechnology<"WITHOUT_LINK_RESOLUTION">;
export type TypeTopicTechnologyWithoutUnresolvableLinksResponse = TypeTopicTechnology<"WITHOUT_UNRESOLVABLE_LINKS">;
export type TypeTopicTechnologyWithAllLocalesResponse<Locales extends LocaleCode = LocaleCode> = TypeTopicTechnology<"WITH_ALL_LOCALES", Locales>;
export type TypeTopicTechnologyWithAllLocalesAndWithoutLinkResolutionResponse<Locales extends LocaleCode = LocaleCode> = TypeTopicTechnology<"WITHOUT_LINK_RESOLUTION" | "WITH_ALL_LOCALES", Locales>;
export type TypeTopicTechnologyWithAllLocalesAndWithoutUnresolvableLinksResponse<Locales extends LocaleCode = LocaleCode> = TypeTopicTechnology<"WITHOUT_UNRESOLVABLE_LINKS" | "WITH_ALL_LOCALES", Locales>;
