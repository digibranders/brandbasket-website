// lib/fonts.ts
import { Red_Hat_Display, Red_Hat_Mono, Red_Hat_Text } from "next/font/google";

const display = Red_Hat_Display({ subsets: ["latin"], style: ["normal", "italic"], variable: "--font-red-hat-display", display: "swap" });
const text = Red_Hat_Text({ subsets: ["latin"], variable: "--font-red-hat-text", display: "swap" });
const mono = Red_Hat_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-red-hat-mono", display: "swap" });

/** Font variable classes for `<html>`. Both documents use it: the root layout and global-error, which replaces it. */
export const fontVariables = `${display.variable} ${text.variable} ${mono.variable}`;
