/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // ── DESIGN-meta.md exact color tokens ──────────────────────────────
        // Brand / Accent
        'meta-primary':       '#0064e0',   // cobalt — buy-CTA only
        'meta-primary-deep':  '#0457cb',   // pressed cobalt
        'meta-primary-soft':  '#0091ff',   // informational tint
        'meta-fb-blue':       '#1876f2',   // form focus / selected state
        'meta-link':          '#385898',   // legacy nav/footer links

        // Surface
        'meta-canvas':        '#ffffff',   // page background
        'meta-surface':       '#f1f4f7',   // card subdued bg, skeleton, search pill

        // Text
        'meta-ink-deep':      '#0a1317',   // H1, hero, nav logo
        'meta-ink':           '#1c1e21',   // body text, card headings
        'meta-ink-button':    '#000000',   // primary marketing CTA
        'meta-charcoal':      '#444950',   // tertiary body, form labels
        'meta-slate':         '#4b4c4f',   // subheadings, section headers
        'meta-steel':         '#5d6c7b',   // captions, footer links
        'meta-stone':         '#8595a4',   // disabled / muted labels
        'meta-disabled':      '#bcc0c4',   // disabled button bg

        // Borders
        'meta-hairline':      '#ced0d4',   // input borders, dividers
        'meta-hairline-soft': '#dee3e9',   // card borders, section breaks

        // Semantic
        'meta-success':       '#31a24c',   // approved, in-stock, present
        'meta-success-bg':    '#e6f4ea',   // success badge bg
        'meta-attention':     '#f2a918',   // pending, mid-priority
        'meta-attention-bg':  '#fef3c7',   // attention badge bg
        'meta-warning':       '#f7b928',   // promo banners
        'meta-critical':      '#e41e3f',   // rejected, error
        'meta-critical-bg':   '#fde8ec',   // critical badge bg
        'meta-critical-strong':'#f0284a',  // form error border / label
        'meta-on-primary':    '#ffffff',   // text on cobalt buttons
      },
      borderRadius: {
        // ── DESIGN-meta.md border-radius scale ─────────────────────────────
        'meta-xs':      '2px',
        'meta-sm':      '4px',
        'meta-md':      '6px',
        'meta-lg':      '8px',     // inputs, radio-option containers
        'meta-xl':      '16px',    // standard feature cards
        'meta-xxl':     '24px',    // warranty/accessory tiles, modals
        'meta-xxxl':    '32px',    // photographic feature cards, large promo
        'meta-feature': '40px',    // accessory hero panels
        'meta-full':    '100px',   // pill buttons (brand signature)
        // Keep full/circle for Tailwind
        'full':         '9999px',
      },
      fontSize: {
        // ── DESIGN-meta.md typography scale ────────────────────────────────
        'meta-hero':    ['64px',  { lineHeight: '1.16', fontWeight: '500' }],
        'meta-display': ['48px',  { lineHeight: '1.17', fontWeight: '500' }],
        'meta-h-lg':    ['36px',  { lineHeight: '1.28', fontWeight: '500' }],
        'meta-h-md':    ['28px',  { lineHeight: '1.21', fontWeight: '300' }],
        'meta-h-sm':    ['24px',  { lineHeight: '1.25', fontWeight: '500' }],
        'meta-sub-lg':  ['18px',  { lineHeight: '1.44', fontWeight: '700' }],
        'meta-sub-md':  ['18px',  { lineHeight: '1.44', fontWeight: '400' }],
        'meta-body-lg': ['16px',  { lineHeight: '1.50', letterSpacing: '-0.16px' }],
        'meta-body':    ['14px',  { lineHeight: '1.43', letterSpacing: '-0.14px' }],
        'meta-caption': ['12px',  { lineHeight: '1.33' }],
      },
      boxShadow: {
        'meta-panel': 'rgba(20, 22, 26, 0.3) 0px 1px 4px 0px',
        'meta-pill':  'rgba(0, 0, 0, 0.2) 1px 1px 0px 0px',
      },
      fontFamily: {
        heading: [
          'Oswald',
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'sans-serif',
        ],
        sans: [
          'Inter',
          'Optimistic VF',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'Noto Sans',
          'sans-serif',
        ],
        mono: ['SFMono-Regular', 'Consolas', 'Liberation Mono', 'Menlo', 'monospace'],
      },
      spacing: {
        // ── DESIGN-meta.md spacing tokens ──────────────────────────────────
        'meta-xxs':         '4px',
        'meta-xs':          '8px',
        'meta-sm':          '10px',
        'meta-md':          '12px',
        'meta-base':        '16px',
        'meta-lg':          '20px',
        'meta-xl':          '24px',
        'meta-xxl':         '32px',
        'meta-xxxl':        '40px',
        'meta-section-sm':  '48px',
        'meta-section':     '64px',
        'meta-section-lg':  '80px',
        'meta-hero-sp':     '120px',
      },
    },
  },
  plugins: [],
};
