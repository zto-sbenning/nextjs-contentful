import { ElementType } from "react";
import DOMPurify from 'isomorphic-dompurify';
import { ellipsisClassNames, TextAs, TextProps } from "./text/types";
import { cn } from "../utils";
import ClientText from './text/ClientText';

export default function Text<TAs extends TextAs = 'span'>(props: TextProps<TAs>) {
    const {
        as,
        ztEllipsis = [
            "h1", "h2", "h3", "h4", "h5", "h6"
        ].includes(as ?? "") ? 2 : 'none',
        ztShowMore,
        ztSanitize = true,
        className,
        children,
        ...restProps
    } = props;

    const needsClientInteractivity = ztEllipsis !== 'none' && ztShowMore !== undefined;

    if (needsClientInteractivity) {
        return <ClientText {...props} />;
    }

    /** Capture du composant à utiliser */
    const isWysiwyg = as === 'wysiwyg';
    const Component = (as === 'wysiwyg' ? 'div' : (as ?? 'span')) as ElementType;

    /** Sanitise le HTML si nécessaire */
    const htmlContent = isWysiwyg && typeof children === 'string' && ztSanitize
        ? DOMPurify.sanitize(children)
        : children as string;

    return (
        <Component
            className={cn(ellipsisClassNames[ztEllipsis], className)}
            {...restProps}
            {...(isWysiwyg && typeof children === 'string'
                ? { dangerouslySetInnerHTML: { __html: htmlContent } }
                : { children })}
        />
    );
}