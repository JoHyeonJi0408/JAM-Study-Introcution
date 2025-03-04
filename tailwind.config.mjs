/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      animation: {
        typewriter: "typewriter 2s steps(20, end) infinite",
        dots: "dots 1s steps(5, end) infinite",
        rainbow: "rainbow 3s ease-in-out infinite"
      },
      keyframes: {
        typewriter: {
          "0%, 100%": { width: "0" },
          "50%": { width: "100%" }
        },
        dots: {
          "0%, 20%": { content: "' '" },
          "40%": { content: "'.'" },
          "60%": { content: "'..'" },
          "80%, 100%": { content: "'...'" }
        },
        rainbow: {
          "0%": {
            backgroundPosition: "-100% 0%",
            backgroundSize: "200% 100%",
          },
          "50%": {
            backgroundPosition: "100% 0%",
            backgroundSize: "200% 100%",
          },
          "100%": {
            backgroundPosition: "-100% 0%",
            backgroundSize: "200% 100%",
          },
        }
      }
    },
  },
  plugins: [],
};
