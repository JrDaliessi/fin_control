import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["selector", '[data-theme="dark"]'],
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/shared/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        accent: "rgb(var(--accent) / <alpha-value>)",
        background: "rgb(var(--background) / <alpha-value>)",
        border: "rgb(var(--border) / <alpha-value>)",
        danger: "rgb(var(--expense) / <alpha-value>)",
        "danger-foreground": "rgb(var(--danger-foreground) / <alpha-value>)",
        "danger-surface": "rgb(var(--danger-surface) / <alpha-value>)",
        disabled: "rgb(var(--disabled) / <alpha-value>)",
        expense: "rgb(var(--expense) / <alpha-value>)",
        "focus-ring": "rgb(var(--focus-ring) / <alpha-value>)",
        foreground: "rgb(var(--foreground) / <alpha-value>)",
        income: "rgb(var(--income) / <alpha-value>)",
        "muted-foreground": "rgb(var(--muted-foreground) / <alpha-value>)",
        navigation: "rgb(var(--navigation) / <alpha-value>)",
        "navigation-accent": "rgb(var(--navigation-accent) / <alpha-value>)",
        "navigation-foreground": "rgb(var(--navigation-foreground) / <alpha-value>)",
        "navigation-muted": "rgb(var(--navigation-muted) / <alpha-value>)",
        primary: "rgb(var(--primary) / <alpha-value>)",
        "primary-foreground": "rgb(var(--primary-foreground) / <alpha-value>)",
        "primary-hover": "rgb(var(--primary-hover) / <alpha-value>)",
        "success-surface": "rgb(var(--success-surface) / <alpha-value>)",
        surface: "rgb(var(--surface) / <alpha-value>)",
        "surface-elevated": "rgb(var(--surface-elevated) / <alpha-value>)",
        "surface-muted": "rgb(var(--surface-muted) / <alpha-value>)",
        warning: "rgb(var(--warning) / <alpha-value>)"
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "Arial", "Helvetica", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
