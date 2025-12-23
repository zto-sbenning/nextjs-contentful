import { MotionProps } from "framer-motion";
import {
    DependencyList,
    Dispatch,
    ReactNode,
    RefObject,
    SetStateAction
} from "react";

export type ObservableHookConfig<T extends HTMLElement | null = HTMLElement> = {
    /** Ref to the HTML element to observe. */
    ref: RefObject<T>;
    /** Whether to observe the element for changes. Defaults to true. */
    observe?: boolean;
    /** Optional debounce time in milliseconds. */
    debounce?: number;
    /** Optional throttle time in milliseconds. */
    throttle?: number;
    /** Optional dependencies to re-run the effect manually. */
    deps?: DependencyList;
    /** If true, uses useLayoutEffect instead of useEffect */
    layoutSensitive?: boolean;
};

