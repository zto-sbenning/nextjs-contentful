import {
    FallbackResolver,
    richTextFromMarkdown
} from "@contentful/rich-text-from-markdown";
import { getRichTextEntityLinks } from "@contentful/rich-text-links";
import { Document } from "@contentful/rich-text-types";
import { documentToReactComponents, Options } from '@contentful/rich-text-react-renderer';
import {
    BLOCKS,
    MARKS,
    INLINES,
} from '@contentful/rich-text-types';
import { ReactNode } from "react";

export type RichTextProps = {
    content: string | Document;
    options?: Options;
}


/**
The renderNode keys should be one of the following BLOCKS and INLINES properties as defined in @contentful/rich-text-types:

BLOCKS

DOCUMENT
PARAGRAPH
HEADING_1
HEADING_2
HEADING_3
HEADING_4
HEADING_5
HEADING_6
UL_LIST
OL_LIST
LIST_ITEM
QUOTE
HR
EMBEDDED_ENTRY
EMBEDDED_ASSET
EMBEDDED_RESOURCE
INLINES

EMBEDDED_ENTRY (this is different from the BLOCKS.EMBEDDED_ENTRY)
EMBEDDED_RESOURCE
HYPERLINK
ENTRY_HYPERLINK
ASSET_HYPERLINK
RESOURCE_HYPERLINK
The renderMark keys should be one of the following MARKS properties as defined in @contentful/rich-text-types:

BOLD
ITALIC
UNDERLINE
CODE
 */
const DEFAULT_RICHTEXT_OPTIONS: Options = {
    renderNode: {
        // All block types and inline types can be customized here
    },
    renderMark: {
        // All mark types can be customized here
    },
    renderText: (text) => {
        return text.split('\n').reduce((children, textSegment, index) => {
            const nbspText = textSegment.replace(/  +/g, (match) => {
                return '\u00A0'.repeat(match.length - 1) + ' ';
            });
            return [...children, index > 0 && <br key={index} />, nbspText];
        }, [] as Iterable<ReactNode>);
    },
};

export async function RichText({
    content,
    options = DEFAULT_RICHTEXT_OPTIONS,
}: RichTextProps) {
    const document = typeof content === 'string'
        ? await richTextFromMarkdown(content, fallbackResolver)
        : content;
    const links = getRichTextEntityLinks(document);

    return (
        <>
            {documentToReactComponents(document, options)}
        </>
    );
}


/**
Advanced
The library will convert automatically the following markdown nodes:

paragraph
heading
text
emphasis
strong
delete
inlineCode
link
thematicBreak
blockquote
list
listItem
table
tableRow
tableCell
If the markdown content has unsupported nodes like image ![image](url) you can add a callback as a second argument and it will get called everytime an unsupported node is found. The return value of the callback will be the rich text representation of that node.

Example:
const { richTextFromMarkdown } = require('@contentful/rich-text-from-markdown');

// define your own type for unsupported nodes like asset
const document = await richTextFromMarkdown(
  "![image]('https://example.com/image.jpg')",
  (node) => ({
    nodeType: 'embedded-[entry|asset]-[block|inline]',
    content: [],
    data: {
      target: {
        sys: {
          type: 'Link',
          linkType: 'Entry|Asset',
          id: '.........',
        },
      },
    },
  }),
);
 */
const fallbackResolver: FallbackResolver = async node => {
    return null;
}
