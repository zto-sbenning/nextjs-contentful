import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * Custom tailwind-merge configuration for the Design System.
 * It defines a "typography" class group to handle conflicts between
 * custom typography classes (e.g., text-title-m vs text-body-s).
 */
const customTwMerge = extendTailwindMerge({
    extend: {
        /*
        classGroups: {
            // Custom group for our composite typography classes
            "typography": [
                {
                    "text": [
                        // Titles
                        "title-2xl", "title-xl", "title-lg", "title-m", "title-s", "title-xs", "title-2xs", "title-3xs",
                        // Body regular
                        "body-2xl", "body-xl", "body-lg", "body-m", "body-s", "body-xs", "body-2xs", "body-3xs",
                        // Body bold
                        "body-2xl-bold", "body-xl-bold", "body-lg-bold", "body-m-bold", "body-s-bold", "body-xs-bold", "body-2xs-bold", "body-3xs-bold"
                    ]
                }
            ],
        },
        */
        /*
        conflictingClassGroups: {
            "typography": ["typography"]
        }
        */
    },
} as any);

export function cn(...inputs: ClassValue[]) {
    return customTwMerge(clsx(inputs));
}