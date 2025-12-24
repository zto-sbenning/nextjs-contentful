import {
    FallbackResolver,
    richTextFromMarkdown
} from "@contentful/rich-text-from-markdown";
import { getRichTextEntityLinks, EntityLinks } from "@contentful/rich-text-links";
import {
    Document,
    Block,
    Inline,
    Text as RichTextText,
    BLOCKS,
    MARKS,
    INLINES,
    TopLevelBlock,
} from "@contentful/rich-text-types";
import {
    documentToReactComponents,
    Options,
    NodeRenderer,
    RenderNode,
    RenderMark,
} from '@contentful/rich-text-react-renderer';
import { ReactNode, Fragment } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/design-system/utils";
import { type LinkedAsset, type LinkedEntry } from "../types";

// =============================================================================
// TYPES
// =============================================================================

// Re-export pour compatibilité avec les imports existants
export type { LinkedAsset, LinkedEntry };

/**
 * Rich Text links structure (from GraphQL or REST with includes)
 */
export interface RichTextLinks {
    assets?: {
        block?: LinkedAsset[];
        hyperlink?: LinkedAsset[];
    };
    entries?: {
        block?: LinkedEntry[];
        inline?: LinkedEntry[];
        hyperlink?: LinkedEntry[];
    };
}

/**
 * Custom class names for Rich Text elements.
 * All elements receive a base `rt-*` class that can be targeted via CSS.
 * These classNames are merged using `cn()` for easy overriding.
 */
export interface RichTextClassNames {
    // Marks
    bold?: string;
    italic?: string;
    underline?: string;
    code?: string;
    superscript?: string;
    subscript?: string;
    strikethrough?: string;
    // Headings
    h1?: string;
    h2?: string;
    h3?: string;
    h4?: string;
    h5?: string;
    h6?: string;
    // Blocks
    paragraph?: string;
    ulList?: string;
    olList?: string;
    listItem?: string;
    blockquote?: string;
    hr?: string;
    // Tables
    tableWrapper?: string;
    table?: string;
    tableBody?: string;
    tableRow?: string;
    tableCell?: string;
    tableHeaderCell?: string;
    // Assets
    figure?: string;
    image?: string;
    figcaption?: string;
    video?: string;
    fileBlock?: string;
    fileLink?: string;
    fileLinkIcon?: string;
    fileLinkText?: string;
    fileDescription?: string;
    // Entries
    embeddedEntry?: string;
    embeddedEntryLabel?: string;
    embeddedEntryContent?: string;
    embeddedEntryPre?: string;
    embeddedResource?: string;
    embeddedResourceLabel?: string;
    embeddedResourceText?: string;
    inlineEntry?: string;
    inlineResource?: string;
    // Links
    link?: string;
    externalLink?: string;
    entryLink?: string;
    assetLink?: string;
    resourceLink?: string;
    // Errors
    error?: string;
    notFound?: string;
}

/**
 * Props for the RichText component
 */
export type RichTextProps = {
    /** Rich Text content as Document or Markdown string */
    content: string | Document;
    /** Custom rendering options */
    options?: Options;
    /** Resolved links for embedded entries/assets */
    links?: RichTextLinks;
    /** Custom class name for the wrapper */
    className?: string;
    /** Custom class names for individual elements */
    classNames?: RichTextClassNames;
    /** Custom entry renderer by content type */
    entryRenderers?: Record<string, (entry: LinkedEntry, children?: ReactNode) => ReactNode>;
    /** Custom asset renderer */
    assetRenderer?: (asset: LinkedAsset) => ReactNode;
};

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Creates a Map from asset/entry arrays for O(1) lookup
 */
function createLinksMap<T extends { sys: { id: string } }>(items?: T[]): Map<string, T> {
    const map = new Map<string, T>();
    if (items) {
        for (const item of items) {
            map.set(item.sys.id, item);
        }
    }
    return map;
}

/**
 * Gets the ID from a node's target
 */
function getTargetId(node: Block | Inline): string | undefined {
    return node.data?.target?.sys?.id;
}

/**
 * Checks if content type is video
 */
function isVideoContentType(contentType?: string): boolean {
    return contentType?.startsWith('video/') ?? false;
}

/**
 * Checks if content type is image
 */
function isImageContentType(contentType?: string): boolean {
    return contentType?.startsWith('image/') ?? false;
}

// =============================================================================
// RENDER MARKS - Text formatting (BOLD, ITALIC, UNDERLINE, CODE, etc.)
// =============================================================================

/**
 * Creates mark renderers for all Contentful MARKS with customizable classNames
 */
export function createDefaultRenderMark(classNames?: RichTextClassNames): RenderMark {
    return {
        [MARKS.BOLD]: (text) => (
            <strong className={cn("rt-bold", classNames?.bold)}>{text}</strong>
        ),

        [MARKS.ITALIC]: (text) => (
            <em className={cn("rt-italic", classNames?.italic)}>{text}</em>
        ),

        [MARKS.UNDERLINE]: (text) => (
            <u className={cn("rt-underline", classNames?.underline)}>{text}</u>
        ),

        [MARKS.CODE]: (text) => (
            <code className={cn("rt-code", "rounded px-1.5 py-0.5 font-mono text-sm", classNames?.code)}>
                {text}
            </code>
        ),

        [MARKS.SUPERSCRIPT]: (text) => (
            <sup className={cn("rt-superscript", classNames?.superscript)}>{text}</sup>
        ),

        [MARKS.SUBSCRIPT]: (text) => (
            <sub className={cn("rt-subscript", classNames?.subscript)}>{text}</sub>
        ),

        [MARKS.STRIKETHROUGH]: (text) => (
            <s className={cn("rt-strikethrough", classNames?.strikethrough)}>{text}</s>
        ),
    };
}

/**
 * Default mark renderers (no custom classNames)
 */
export const defaultRenderMark: RenderMark = createDefaultRenderMark();

// =============================================================================
// RENDER NODES - Block and Inline elements
// =============================================================================

/**
 * Creates default node renderers with optional linked content resolution
 */
export function createDefaultRenderNode(
    links?: RichTextLinks,
    customRenderers?: {
        entryRenderers?: Record<string, (entry: LinkedEntry, children?: ReactNode) => ReactNode>;
        assetRenderer?: (asset: LinkedAsset) => ReactNode;
    },
    classNames?: RichTextClassNames
): RenderNode {
    // Create lookup maps for O(1) access
    const assetBlockMap = createLinksMap(links?.assets?.block);
    const assetHyperlinkMap = createLinksMap(links?.assets?.hyperlink);
    const entryBlockMap = createLinksMap(links?.entries?.block);
    const entryInlineMap = createLinksMap(links?.entries?.inline);
    const entryHyperlinkMap = createLinksMap(links?.entries?.hyperlink);

    return {
        // =========================================================================
        // DOCUMENT
        // =========================================================================
        [BLOCKS.DOCUMENT]: (node, children) => <Fragment>{children}</Fragment>,

        // =========================================================================
        // HEADINGS
        // =========================================================================
        [BLOCKS.HEADING_1]: (node, children) => (
            <h1 className={cn("rt-h1", "mb-4 mt-8 text-4xl font-bold", classNames?.h1)}>{children}</h1>
        ),

        [BLOCKS.HEADING_2]: (node, children) => (
            <h2 className={cn("rt-h2", "mb-3 mt-6 text-3xl font-bold", classNames?.h2)}>{children}</h2>
        ),

        [BLOCKS.HEADING_3]: (node, children) => (
            <h3 className={cn("rt-h3", "mb-3 mt-5 text-2xl font-bold", classNames?.h3)}>{children}</h3>
        ),

        [BLOCKS.HEADING_4]: (node, children) => (
            <h4 className={cn("rt-h4", "mb-2 mt-4 text-xl font-bold", classNames?.h4)}>{children}</h4>
        ),

        [BLOCKS.HEADING_5]: (node, children) => (
            <h5 className={cn("rt-h5", "mb-2 mt-4 text-lg font-bold", classNames?.h5)}>{children}</h5>
        ),

        [BLOCKS.HEADING_6]: (node, children) => (
            <h6 className={cn("rt-h6", "mb-2 mt-4 text-base font-bold", classNames?.h6)}>{children}</h6>
        ),

        // =========================================================================
        // PARAGRAPH
        // =========================================================================
        [BLOCKS.PARAGRAPH]: (node, children) => (
            <p className={cn("rt-paragraph", "mb-4 leading-relaxed", classNames?.paragraph)}>{children}</p>
        ),

        // =========================================================================
        // LISTS
        // =========================================================================
        [BLOCKS.UL_LIST]: (node, children) => (
            <ul className={cn("rt-ul", "mb-4 ml-6 list-disc space-y-1", classNames?.ulList)}>{children}</ul>
        ),

        [BLOCKS.OL_LIST]: (node, children) => (
            <ol className={cn("rt-ol", "mb-4 ml-6 list-decimal space-y-1", classNames?.olList)}>{children}</ol>
        ),

        [BLOCKS.LIST_ITEM]: (node, children) => (
            <li className={cn("rt-li", "leading-relaxed", classNames?.listItem)}>{children}</li>
        ),

        // =========================================================================
        // QUOTE
        // =========================================================================
        [BLOCKS.QUOTE]: (node, children) => (
            <blockquote className={cn("rt-blockquote", "my-4 border-l-4 pl-4 italic", classNames?.blockquote)}>
                {children}
            </blockquote>
        ),

        // =========================================================================
        // HORIZONTAL RULE
        // =========================================================================
        [BLOCKS.HR]: () => (
            <hr className={cn("rt-hr", "my-8", classNames?.hr)} />
        ),

        // =========================================================================
        // TABLES
        // =========================================================================
        [BLOCKS.TABLE]: (node, children) => (
            <div className={cn("rt-table-wrapper", "my-4 overflow-x-auto", classNames?.tableWrapper)}>
                <table className={cn("rt-table", "min-w-full border-collapse", classNames?.table)}>
                    <tbody className={cn("rt-tbody", classNames?.tableBody)}>{children}</tbody>
                </table>
            </div>
        ),

        [BLOCKS.TABLE_ROW]: (node, children) => (
            <tr className={cn("rt-tr", classNames?.tableRow)}>
                {children}
            </tr>
        ),

        [BLOCKS.TABLE_CELL]: (node, children) => (
            <td className={cn("rt-td", "px-4 py-2", classNames?.tableCell)}>
                {children}
            </td>
        ),

        [BLOCKS.TABLE_HEADER_CELL]: (node, children) => (
            <th className={cn("rt-th", "px-4 py-2 font-semibold", classNames?.tableHeaderCell)}>
                {children}
            </th>
        ),

        // =========================================================================
        // EMBEDDED ASSET (Images, Videos, Files)
        // =========================================================================
        [BLOCKS.EMBEDDED_ASSET]: (node) => {
            const assetId = getTargetId(node);
            if (!assetId) {
                return <div className={cn("rt-error", classNames?.error)}>[Missing asset reference]</div>;
            }

            const asset = assetBlockMap.get(assetId);
            if (!asset?.fields?.file) {
                return <div className={cn("rt-not-found", classNames?.notFound)}>[Asset not found: {assetId}]</div>;
            }

            // Use custom renderer if provided
            if (customRenderers?.assetRenderer) {
                return customRenderers.assetRenderer(asset);
            }

            const { url, contentType, fileName } = asset.fields.file;
            const { title, description } = asset.fields;
            const imageDetails = asset.fields.file.details?.image;

            // Handle images
            if (isImageContentType(contentType)) {
                return (
                    <figure className={cn("rt-figure", "my-6", classNames?.figure)}>
                        <Image
                            src={url.startsWith('//') ? `https:${url}` : url}
                            alt={description || title || fileName || 'Image'}
                            width={imageDetails?.width || 800}
                            height={imageDetails?.height || 600}
                            className={cn("rt-image", classNames?.image)}
                        />
                        {(title || description) && (
                            <figcaption className={cn("rt-figcaption", "mt-2 text-center text-sm", classNames?.figcaption)}>
                                {title || description}
                            </figcaption>
                        )}
                    </figure>
                );
            }

            // Handle videos
            if (isVideoContentType(contentType)) {
                return (
                    <figure className={cn("rt-figure", "my-6", classNames?.figure)}>
                        <video
                            src={url.startsWith('//') ? `https:${url}` : url}
                            controls
                            className={cn("rt-video", "w-full", classNames?.video)}
                        >
                            Your browser does not support the video tag.
                        </video>
                        {(title || description) && (
                            <figcaption className={cn("rt-figcaption", "mt-2 text-center text-sm", classNames?.figcaption)}>
                                {title || description}
                            </figcaption>
                        )}
                    </figure>
                );
            }

            // Handle other file types (PDF, documents, etc.)
            return (
                <div className={cn("rt-file-block", "my-4 p-4", classNames?.fileBlock)}>
                    <a
                        href={url.startsWith('//') ? `https:${url}` : url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn("rt-file-link", "flex items-center gap-2 underline", classNames?.fileLink)}
                    >
                        <span className={cn("rt-file-link-icon", classNames?.fileLinkIcon)}>📎</span>
                        <span className={cn("rt-file-link-text", classNames?.fileLinkText)}>{title || fileName || 'Download file'}</span>
                    </a>
                    {description && (
                        <p className={cn("rt-file-description", "mt-1 text-sm", classNames?.fileDescription)}>{description}</p>
                    )}
                </div>
            );
        },

        // =========================================================================
        // EMBEDDED ENTRY (Block level - Custom content types)
        // =========================================================================
        [BLOCKS.EMBEDDED_ENTRY]: (node, children) => {
            const entryId = getTargetId(node);
            if (!entryId) {
                return <div className={cn("rt-error", classNames?.error)}>[Missing entry reference]</div>;
            }

            const entry = entryBlockMap.get(entryId);
            if (!entry) {
                return <div className={cn("rt-not-found", classNames?.notFound)}>[Entry not found: {entryId}]</div>;
            }

            const contentTypeId = entry.sys.contentType?.sys?.id;

            // Use custom renderer if provided for this content type
            if (contentTypeId && customRenderers?.entryRenderers?.[contentTypeId]) {
                return customRenderers.entryRenderers[contentTypeId](entry, children);
            }

            // Default: render as a styled block
            return (
                <div className={cn("rt-embedded-entry", "my-4 p-4", classNames?.embeddedEntry)}>
                    <span className={cn("rt-embedded-entry-label", "text-xs font-medium uppercase", classNames?.embeddedEntryLabel)}>
                        {contentTypeId || 'Embedded Entry'}
                    </span>
                    <div className={cn("rt-embedded-entry-content", "mt-2", classNames?.embeddedEntryContent)}>
                        {/* Try to render a title or name field if available */}
                        {entry.fields && (
                            <pre className={cn("rt-embedded-entry-pre", "overflow-auto text-sm", classNames?.embeddedEntryPre)}>
                                {JSON.stringify(entry.fields, null, 2)}
                            </pre>
                        )}
                    </div>
                </div>
            );
        },

        // =========================================================================
        // EMBEDDED RESOURCE (Cross-space references)
        // =========================================================================
        [BLOCKS.EMBEDDED_RESOURCE]: (node) => {
            const resourceLink = node.data?.target;
            return (
                <div className={cn("rt-embedded-resource", "my-4 p-4", classNames?.embeddedResource)}>
                    <span className={cn("rt-embedded-resource-label", "text-xs font-medium uppercase", classNames?.embeddedResourceLabel)}>Embedded Resource</span>
                    <p className={cn("rt-embedded-resource-text", "mt-1 text-sm", classNames?.embeddedResourceText)}>
                        Resource URN: {resourceLink?.sys?.urn || 'Unknown'}
                    </p>
                </div>
            );
        },

        // =========================================================================
        // INLINE HYPERLINKS
        // =========================================================================
        [INLINES.HYPERLINK]: (node, children) => {
            const uri = node.data?.uri as string;
            const isExternal = uri?.startsWith('http') || uri?.startsWith('//');

            if (isExternal) {
                return (
                    <a
                        href={uri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn("rt-link rt-external-link", "underline", classNames?.externalLink ?? classNames?.link)}
                    >
                        {children}
                    </a>
                );
            }

            return (
                <Link
                    href={(uri || '#') as '/'}
                    className={cn("rt-link", "underline", classNames?.link)}
                >
                    {children}
                </Link>
            );
        },

        // =========================================================================
        // ENTRY HYPERLINK (Link to another Contentful entry)
        // =========================================================================
        [INLINES.ENTRY_HYPERLINK]: (node, children) => {
            const entryId = getTargetId(node);
            if (!entryId) {
                return <span className={cn("rt-error", classNames?.error)}>{children}</span>;
            }

            const entry = entryHyperlinkMap.get(entryId);
            const contentTypeId = entry?.sys.contentType?.sys?.id;

            // Use custom renderer if provided
            if (contentTypeId && customRenderers?.entryRenderers?.[contentTypeId]) {
                return customRenderers.entryRenderers[contentTypeId](entry!, children);
            }

            // Try to build a URL from slug field
            const slug = entry?.fields?.slug as string | undefined;
            const href = slug ? `/${slug}` : `#entry-${entryId}`;

            return (
                <Link
                    href={href as '/'}
                    className={cn("rt-link rt-entry-link", "underline", classNames?.entryLink ?? classNames?.link)}
                >
                    {children}
                </Link>
            );
        },

        // =========================================================================
        // ASSET HYPERLINK (Link to a Contentful asset)
        // =========================================================================
        [INLINES.ASSET_HYPERLINK]: (node, children) => {
            const assetId = getTargetId(node);
            if (!assetId) {
                return <span className={cn("rt-error", classNames?.error)}>{children}</span>;
            }

            const asset = assetHyperlinkMap.get(assetId);
            const url = asset?.fields?.file?.url;

            return (
                <a
                    href={url ? (url.startsWith('//') ? `https:${url}` : url) : '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn("rt-link rt-asset-link", "underline", classNames?.assetLink ?? classNames?.link)}
                >
                    {children}
                </a>
            );
        },

        // =========================================================================
        // EMBEDDED ENTRY INLINE (Inline embedded entries)
        // =========================================================================
        [INLINES.EMBEDDED_ENTRY]: (node, children) => {
            const entryId = getTargetId(node);
            if (!entryId) {
                return <span className={cn("rt-error", classNames?.error)}>[Missing inline entry]</span>;
            }

            const entry = entryInlineMap.get(entryId);
            if (!entry) {
                return <span className={cn("rt-not-found", classNames?.notFound)}>[Entry: {entryId}]</span>;
            }

            const contentTypeId = entry.sys.contentType?.sys?.id;

            // Use custom renderer if provided
            if (contentTypeId && customRenderers?.entryRenderers?.[contentTypeId]) {
                return customRenderers.entryRenderers[contentTypeId](entry, children);
            }

            // Default inline rendering
            return (
                <span className={cn("rt-inline-entry", "rounded px-1 py-0.5 text-sm", classNames?.inlineEntry)}>
                    [{contentTypeId || 'entry'}]
                </span>
            );
        },

        // =========================================================================
        // RESOURCE HYPERLINK (Cross-space resource links)
        // =========================================================================
        [INLINES.RESOURCE_HYPERLINK]: (node, children) => {
            const urn = node.data?.target?.sys?.urn;
            return (
                <a
                    href={`#resource-${urn || 'unknown'}`}
                    className={cn("rt-link rt-resource-link", "underline", classNames?.resourceLink ?? classNames?.link)}
                    title={`Resource: ${urn}`}
                >
                    {children}
                </a>
            );
        },

        // =========================================================================
        // EMBEDDED RESOURCE INLINE (Cross-space inline resources)
        // =========================================================================
        [INLINES.EMBEDDED_RESOURCE]: (node) => {
            const urn = node.data?.target?.sys?.urn;
            return (
                <span
                    className={cn("rt-inline-resource", "rounded px-1 py-0.5 text-sm", classNames?.inlineResource)}
                    title={`Resource: ${urn}`}
                >
                    [Resource]
                </span>
            );
        },
    };
}

// =============================================================================
// RENDER TEXT - Handles newlines and whitespace
// =============================================================================

/**
 * Custom text renderer that handles newlines and preserves multiple spaces
 */
export const defaultRenderText = (text: string): ReactNode => {
    return text.split('\n').reduce((children, textSegment, index) => {
        // Preserve multiple spaces by replacing with non-breaking spaces
        const nbspText = textSegment.replace(/  +/g, (match) => {
            return '\u00A0'.repeat(match.length - 1) + ' ';
        });
        return [...children, index > 0 && <br key={index} />, nbspText];
    }, [] as ReactNode[]);
};

// =============================================================================
// FALLBACK RESOLVER - Markdown to Rich Text conversion
// =============================================================================

/**
 * MIME type mapping for common image formats
 */
const MIME_TYPES: Record<string, string> = {
    bmp: 'image/bmp',
    gif: 'image/gif',
    jpeg: 'image/jpeg',
    jpg: 'image/jpeg',
    png: 'image/png',
    svg: 'image/svg+xml',
    svgz: 'image/svg+xml',
    tif: 'image/tiff',
    tiff: 'image/tiff',
    webp: 'image/webp',
    avif: 'image/avif',
    ico: 'image/x-icon',
    '': 'application/octet-stream',
};

/**
 * Gets MIME type from URL extension
 */
function getMimeType(url: string): string {
    const index = url.lastIndexOf('.');
    const extension = index === -1 ? '' : url.substring(index + 1).toLowerCase();
    return MIME_TYPES[extension] || 'application/octet-stream';
}

/**
 * Extracts filename from URL
 */
function getFileName(url: string): string {
    const index = url.lastIndexOf('/');
    return index === -1 ? url : url.substring(index + 1);
}

/**
 * Options for fallback resolver behavior
 */
export interface FallbackResolverOptions {
    /** Callback to handle image nodes - return asset ID or null to use placeholder */
    onImage?: (node: {
        type: 'image';
        url: string;
        alt?: string;
        title?: string;
    }) => Promise<string | null>;

    /** Callback to handle HTML nodes */
    onHtml?: (node: {
        type: 'html';
        value: string;
    }) => Promise<TopLevelBlock | null>;

    /** Callback to handle unknown node types */
    onUnknown?: (node: unknown) => Promise<TopLevelBlock | null>;
}

/**
 * Creates a fallback resolver for Markdown to Rich Text conversion.
 * 
 * The resolver handles unsupported Markdown nodes like:
 * - image: ![alt](url "title")
 * - html: Raw HTML blocks
 * - Other custom nodes
 * 
 * @param options - Configuration for handling different node types
 * @returns FallbackResolver function
 */
export function createFallbackResolver(options: FallbackResolverOptions = {}): FallbackResolver {
    return async (node) => {
        const mdNode = node as {
            type: string;
            url?: string;
            alt?: string;
            title?: string;
            value?: string;
        };

        // Handle image nodes
        if (mdNode.type === 'image' && mdNode.url) {
            // If custom handler provided, use it to get asset ID
            if (options.onImage) {
                const assetId = await options.onImage({
                    type: 'image',
                    url: mdNode.url,
                    alt: mdNode.alt,
                    title: mdNode.title,
                });

                if (assetId) {
                    return {
                        nodeType: BLOCKS.EMBEDDED_ASSET,
                        content: [],
                        data: {
                            target: {
                                sys: {
                                    type: 'Link',
                                    linkType: 'Asset',
                                    id: assetId,
                                },
                            },
                        },
                    };
                }
            }

            // Default: Return a paragraph with image info as placeholder
            // (Images need to be uploaded as Contentful assets)
            return {
                nodeType: BLOCKS.PARAGRAPH,
                content: [
                    {
                        nodeType: 'text',
                        value: `[Image: ${mdNode.alt || mdNode.title || getFileName(mdNode.url)}]`,
                        marks: [{ type: MARKS.ITALIC }],
                        data: {},
                    },
                ],
                data: {},
            } as TopLevelBlock;
        }

        // Handle HTML nodes
        if (mdNode.type === 'html' && mdNode.value) {
            if (options.onHtml) {
                const result = await options.onHtml({
                    type: 'html',
                    value: mdNode.value,
                });
                if (result) return result;
            }

            // Default: Strip HTML and return as paragraph
            const textContent = mdNode.value
                .replace(/<[^>]*>/g, '') // Remove HTML tags
                .trim();

            if (textContent) {
                return {
                    nodeType: BLOCKS.PARAGRAPH,
                    content: [
                        {
                            nodeType: 'text',
                            value: textContent,
                            marks: [],
                            data: {},
                        },
                    ],
                    data: {},
                } as TopLevelBlock;
            }

            return null;
        }

        // Handle unknown nodes
        if (options.onUnknown) {
            return options.onUnknown(node);
        }

        // Default: ignore unknown nodes
        return null;
    };
}

/**
 * Default fallback resolver (ignores unsupported nodes with placeholder)
 */
export const defaultFallbackResolver: FallbackResolver = createFallbackResolver();

// =============================================================================
// DEFAULT OPTIONS
// =============================================================================

/**
 * Creates complete rendering options
 */
export function createRichTextOptions(
    links?: RichTextLinks,
    customRenderers?: {
        entryRenderers?: Record<string, (entry: LinkedEntry, children?: ReactNode) => ReactNode>;
        assetRenderer?: (asset: LinkedAsset) => ReactNode;
    },
    classNames?: RichTextClassNames
): Options {
    return {
        renderNode: createDefaultRenderNode(links, customRenderers, classNames),
        renderMark: createDefaultRenderMark(classNames),
        renderText: defaultRenderText,
    };
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

/**
 * Renders Contentful Rich Text content with full feature support.
 * 
 * Features:
 * - All BLOCKS: Document, Paragraphs, Headings (1-6), Lists, Quotes, HR, Tables, Embedded entries/assets
 * - All INLINES: Hyperlinks, Entry hyperlinks, Asset hyperlinks, Embedded entries
 * - All MARKS: Bold, Italic, Underline, Code, Superscript, Subscript, Strikethrough
 * - Markdown to Rich Text conversion with fallback resolver
 * - Custom entry/asset renderers by content type
 * - All elements have `rt-*` classes for CSS targeting
 * - All classNames are overridable via the `classNames` prop
 * 
 * @example
 * ```tsx
 * // Basic usage with Document
 * <RichText content={richTextDocument} />
 * 
 * // With links from GraphQL
 * <RichText 
 *   content={richTextDocument} 
 *   links={richTextLinks} 
 * />
 * 
 * // With custom entry renderers
 * <RichText 
 *   content={richTextDocument}
 *   links={richTextLinks}
 *   entryRenderers={{
 *     videoEmbed: (entry) => <VideoPlayer url={entry.fields.url} />,
 *     callToAction: (entry) => <CTA {...entry.fields} />,
 *   }}
 * />
 * 
 * // With custom classNames (merged with cn())
 * <RichText 
 *   content={richTextDocument}
 *   classNames={{
 *     h1: "text-5xl text-primary",
 *     paragraph: "text-lg",
 *     link: "text-accent hover:text-accent-dark",
 *   }}
 * />
 * 
 * // From Markdown
 * <RichText content="# Hello **World**" />
 * ```
 */
export async function RichText({
    content,
    options,
    links,
    className,
    classNames,
    entryRenderers,
    assetRenderer,
}: RichTextProps) {
    // Convert Markdown to Document if needed
    const document = typeof content === 'string'
        ? await richTextFromMarkdown(content, defaultFallbackResolver)
        : content;

    // Get entity links from the document (useful for validation)
    const entityLinks = getRichTextEntityLinks(document);

    // Build rendering options
    const renderOptions = options ?? createRichTextOptions(links, {
        entryRenderers,
        assetRenderer,
    }, classNames);

    return (
        <div className={cn("rt-root", className)}>
            {documentToReactComponents(document, renderOptions)}
        </div>
    );
}

// =============================================================================
// EXPORTS FOR CUSTOMIZATION
// =============================================================================

export {
    BLOCKS,
    MARKS,
    INLINES,
    documentToReactComponents,
    getRichTextEntityLinks,
    richTextFromMarkdown,
};

export type {
    Document,
    Block,
    Inline,
    Options,
    NodeRenderer,
    RenderNode,
    RenderMark,
    FallbackResolver,
    EntityLinks,
};
