import { useEffect, useLayoutEffect, useRef } from 'react';
import type { ObservableHookConfig } from '../types';

/**
 * A hook that observes an element for changes (resizes) and triggers a callback.
 * It handles debounce, throttle, and initial execution.
 */
export function useElementObserver<T extends HTMLElement | null>(
    callback: (element: NonNullable<T>) => void,
    {
        ref,
        deps = [],
        observe = true,
        debounce = 0,
        throttle = 0,
        layoutSensitive = true,
    }: ObservableHookConfig<T>
) {
    const callbackRef = useRef(callback);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const lastCallRef = useRef(0);

    // Keep the callback ref up to date.
    // We use useLayoutEffect to ensure the ref is updated before the main effect runs
    // (or at least before any async operations in it might reference the old callback).
    useLayoutEffect(() => {
        callbackRef.current = callback;
    });

    const effect = layoutSensitive ? useLayoutEffect : useEffect;

    effect(() => {
        const el = ref.current;
        if (!el) return;

        const rawHandler = () => {
            // We cast to NonNullable<T> because we checked !el above.
            // If T is HTMLElement | null, el is HTMLElement.
            callbackRef.current(el as NonNullable<T>);
        };

        let handler = rawHandler;

        if (debounce > 0) {
            handler = () => {
                if (timeoutRef.current) clearTimeout(timeoutRef.current);
                timeoutRef.current = setTimeout(rawHandler, debounce);
            };
        } else if (throttle > 0) {
            handler = () => {
                const now = Date.now();
                if (now - lastCallRef.current >= throttle) {
                    lastCallRef.current = now;
                    rawHandler();
                }
            };
        }

        handler(); // Initial run

        if (!observe) return;

        const observer = new ResizeObserver(handler);
        observer.observe(el);

        return () => {
            observer.disconnect();
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [ref.current, observe, debounce, throttle, ...deps]);
}
