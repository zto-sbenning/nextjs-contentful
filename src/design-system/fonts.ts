import { Space_Grotesk, Inter } from "next/font/google";

const spaceGrotesk = Space_Grotesk({
    variable: "--font-space-grotesk",
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
});

const inter = Inter({
    variable: "--font-inter",
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700"],
});

// Helper for layout.tsx to inject all font variables
export const fonts = [spaceGrotesk, inter];
export const fontVariables = fonts.map((f) => f.variable).join(" ");

// The default font class to apply to the body
export const defaultFontClassName = "font-inter";