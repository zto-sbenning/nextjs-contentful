import { useState } from 'react';
import { useElementObserver } from '../../hooks/useElementObserver';
import { ObservableHookConfig } from '../../types';

export type UseContentClampedProps<T extends HTMLElement | null> =
    {} & ObservableHookConfig<T>;

/**
 * Detects if the content of a referenced element is visually clamped.
 *
 * This is useful to detect if text is visually truncated (e.g. by `line-clamp`)
 * by comparing the element's `scrollHeight` to its `clientHeight`.
 *
 * Automatically updates when the element resizes.
 */
export default function useContentClamped<T extends HTMLElement | null>(
    /** Configuration for observing the element. */
    config: UseContentClampedProps<T>,
) {
    const [clamped, setClamped] = useState(false);

    useElementObserver((el) => {
        const intrinsicHeight = el.scrollHeight;
        const renderedHeight = el.clientHeight;
        setClamped(intrinsicHeight > renderedHeight);
    }, config);

    return clamped;
}
