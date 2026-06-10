/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#FBFBF5",
        surface: "#FFFFFF",
        ink: {
          DEFAULT: "#000000",
          700: "#1F1F23",
          500: "#3F3F46",
          400: "#71717A",
          300: "#A1A1AA",
        },
        mint: {
          DEFAULT: "#C1FBD4",
          deep: "#0C6B44",
          wash: "#EBFDF2",
        },
        pistachio: "#D4F9E0",
        hairline: {
          DEFAULT: "#E4E4E7",
          soft: "#ECECEE",
          alt: "#DEE3E9",
        },
        cobalt: {
          DEFAULT: "#0064E0",
          deep: "#0052B8",
        },
        alert: {
          wash: "#FDECEC",
          deep: "#B3261E",
        },
      },
      borderRadius: {
        showcase: "32px",
        field: "16px",
        cell: "8px",
      },
      boxShadow: {
        cube: "rgba(20, 22, 26, 0.15) 0px 4px 12px, rgba(20, 22, 26, 0.10) 0px 16px 40px",
        toast: "rgba(20, 22, 26, 0.15) 0px 4px 12px",
      },
      fontFamily: {
        sans: [
          "Pretendard Variable",
          "Pretendard",
          "-apple-system",
          "BlinkMacSystemFont",
          "system-ui",
          "Segoe UI",
          "Apple SD Gothic Neo",
          "Noto Sans KR",
          "sans-serif",
        ],
      },
      letterSpacing: {
        snug: "-0.02em",
        label: "0.08em",
      },
      keyframes: {
        "slide-in-right": {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "toast-up": {
          "0%": { opacity: "0", transform: "translate(-50%, 12px)" },
          "100%": { opacity: "1", transform: "translate(-50%, 0)" },
        },
        "bubble-in": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "slide-in-right": "slide-in-right 0.36s cubic-bezier(0.22, 1, 0.36, 1)",
        "fade-in": "fade-in 0.28s ease-out",
        "toast-up": "toast-up 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
        "bubble-in": "bubble-in 0.4s cubic-bezier(0.22, 1, 0.36, 1) both",
      },
    },
  },
  plugins: [],
};
