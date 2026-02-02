module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        bg: {
          base: "var(--color-bg-base)",
        },
        text: {
          base: "var(--color-text-base)",
          muted: "var(--color-text-muted)",
          heading: "var(--color-text-heading)",
        },
        border: {
          base: "var(--color-border-base)",
        },
      },
    },
  }, 
  plugins: [],
};
