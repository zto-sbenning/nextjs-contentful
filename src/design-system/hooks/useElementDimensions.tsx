import { useState } from 'react';
import { useElementObserver } from './useElementObserver';
import type { ObservableHookConfig } from '../types';

export type ElementDimensions = {
    mounted: boolean;
    clientWidth: number;
    offsetWidth: number;
    scrollWidth: number;
    computedStyleWidth: string;
    boundingClientWidth: number;
    clientHeight: number;
    offsetHeight: number;
    scrollHeight: number;
    computedStyleHeight: string;
    boundingClientHeight: number;
};

export type UseElementDimensionsProps<T extends HTMLElement | null> =
    {} & ObservableHookConfig<T>;

export default function useElementDimensions<T extends HTMLElement | null>(
    config: UseElementDimensionsProps<T>
): ElementDimensions {
    const [dimensions, setDimensions] = useState<ElementDimensions>({
        mounted: false,
        clientWidth: 0,
        offsetWidth: 0,
        scrollWidth: 0,
        computedStyleWidth: '',
        boundingClientWidth: 0,
        clientHeight: 0,
        offsetHeight: 0,
        scrollHeight: 0,
        computedStyleHeight: '',
        boundingClientHeight: 0,
    });

    useElementObserver((el) => {
        const computed = globalThis.getComputedStyle(el);
        const rect = el.getBoundingClientRect();

        const next: ElementDimensions = {
            mounted: true,
            clientWidth: el.clientWidth,
            offsetWidth: el.offsetWidth,
            scrollWidth: el.scrollWidth,
            computedStyleWidth: computed.width,
            boundingClientWidth: rect.width,
            clientHeight: el.clientHeight,
            offsetHeight: el.offsetHeight,
            scrollHeight: el.scrollHeight,
            computedStyleHeight: computed.height,
            boundingClientHeight: rect.height,
        };

        setDimensions((previous) => {
            for (const key in next) {
                if (
                    next[key as keyof ElementDimensions] !==
                    previous[key as keyof ElementDimensions]
                ) {
                    return next;
                }
            }
            return previous;
        });
    }, config);

    return dimensions;
}
