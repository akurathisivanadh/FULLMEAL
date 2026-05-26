@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
@import "tailwindcss";

@theme {
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-display: "Space Grotesk", ui-sans-serif, system-ui;
  --font-mono: "JetBrains Mono", ui-monospace, SFMono-Regular, monospace;

  --color-dark-bg: #050505;
  --color-dark-surface: #121212;
  --color-dark-surface-hover: rgba(255, 255, 255, 0.05);
  --color-dark-border: rgba(255, 255, 255, 0.1);
  
  --color-brand-primary: #D4FF00;
  --color-brand-secondary: #22d3ee;
  --color-brand-tertiary: #fb923c;
}

body {
  background-color: var(--color-dark-bg);
  color: #FFFFFF;
}
