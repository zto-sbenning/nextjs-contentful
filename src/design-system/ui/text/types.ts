import { MotionProps } from "framer-motion";
import { ComponentProps, Dispatch, ReactNode, SetStateAction } from "react";

export type TextAs =
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'h5'
    | 'h6'
    | 'p'
    | 'span'
    | 'wysiwyg';

export type TextIntrinsicProps<TAs extends TextAs = 'span'> =
    TAs extends 'wysiwyg'
    ? ComponentProps<'div'>
    : ComponentProps<Exclude<TAs, 'wysiwyg'>>;

export const ellipsisClassNames = {
    1: 'line-clamp-1',
    2: 'line-clamp-2',
    3: 'line-clamp-3',
    4: 'line-clamp-4',
    5: 'line-clamp-5',
    6: 'line-clamp-6',
    none: 'line-clamp-none',
} as const;
export type EllipsisClassNamesKey = keyof typeof ellipsisClassNames;

export type TextShowMore = {
    btn?: (
        expanded: boolean,
        setExpanded: Dispatch<SetStateAction<boolean>>,
    ) => ReactNode;
    className?: string;
    animate?: boolean;
    transition?: MotionProps['transition'];
};

export type TextProps<TAs extends TextAs = 'span'> = {
    as?: TAs;
    ztEllipsis?: EllipsisClassNamesKey;
    ztShowMore?: TextShowMore;
    /**
     * Sanitise le HTML avec DOMPurify quand as="wysiwyg"
     * @default true
     */
    ztSanitize?: boolean;
} & TextIntrinsicProps<TAs>;