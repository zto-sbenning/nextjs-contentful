'use client';
import {
    ElementType,
} from 'react';
import {
    motion,
} from 'framer-motion';
import DOMPurify from 'isomorphic-dompurify';
import { cn } from '../../utils';
import useOptimizedTextExpansion from './useOptimizedTextExpansion';
import { TextAs, TextProps } from './types';

export default function ClientText<TAs extends TextAs = 'span'>({
    as,
    ztEllipsis = [
        "h1", "h2", "h3", "h4", "h5", "h6"
    ].includes(as ?? "") ? 2 : 'none',
    ztShowMore,
    ztSanitize = true,
    className,
    children,
    ...props
}: TextProps<TAs>) {
    const {
        refs: { motionRef, contentRef },
        state: { ellipsisClassName, maxHeight },
        handlers: { onStart, onEnd },
        elements: { btn },
        config: { animate },
    } = useOptimizedTextExpansion({ ztEllipsis, ztShowMore, children });

    /** Capture du composant à utiliser */
    const isWysiwyg = as === 'wysiwyg';
    const Component = (
        as === 'wysiwyg' ? 'div' : (as ?? 'span')
    ) as ElementType;

    /** Sanitise le HTML si nécessaire */
    const htmlContent = isWysiwyg && typeof children === 'string' && ztSanitize
        ? DOMPurify.sanitize(children)
        : children as string;

    const content = <Component
        ref={contentRef}
        className={cn(ellipsisClassName, className)}
        {...props}
        {...(isWysiwyg && typeof children === 'string'
            ? { dangerouslySetInnerHTML: { __html: htmlContent } }
            : { children })}
    />;

    return animate ? (
        <>
            <motion.div
                ref={motionRef}
                className={cn(
                    ztShowMore?.className ?? '',
                    'overflow-hidden',
                )}
                animate={{ maxHeight }}
                transition={ztShowMore?.transition ?? { duration: 0.4 }}
                onAnimationStart={onStart}
                onAnimationComplete={onEnd}
            >
                {content}
            </motion.div>
            {btn}
        </>
    ) : (
        <>
            {content}
            {btn}
        </>
    );
}
