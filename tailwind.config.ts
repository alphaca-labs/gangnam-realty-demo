import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#FFFFFF',
        sidebar: '#F7F7F8',
        'sidebar-hover': '#ECECF1',
        'user-msg': '#F7F7F8',
        'ai-msg': '#FFFFFF',
        primary: '#1B4D8E',
        'primary-light': '#E3F2FD',
        accent: '#10A37F',
        'text-primary': '#1A1A2E',
        'text-secondary': '#6B7280',
        border: '#E5E7EB',
        'input-bg': '#FFFFFF',
        'input-border': '#D1D5DB',
      },
      fontFamily: {
        sans: ['Pretendard', 'Inter', 'sans-serif'],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
