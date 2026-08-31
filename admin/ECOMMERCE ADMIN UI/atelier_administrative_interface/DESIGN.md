---
name: Atelier Administrative Interface
colors:
  surface: '#fcf8fa'
  surface-dim: '#dcd9db'
  surface-bright: '#fcf8fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f4'
  surface-container: '#f0edee'
  surface-container-high: '#eae7e9'
  surface-container-highest: '#e5e2e3'
  on-surface: '#1b1b1d'
  on-surface-variant: '#45464c'
  inverse-surface: '#303031'
  inverse-on-surface: '#f3f0f1'
  outline: '#76777d'
  outline-variant: '#c6c6cd'
  surface-tint: '#575e70'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#141b2b'
  on-primary-container: '#7d8497'
  inverse-primary: '#c0c6db'
  secondary: '#585f6c'
  on-secondary: '#ffffff'
  secondary-container: '#dce2f3'
  on-secondary-container: '#5e6572'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#261906'
  on-tertiary-container: '#968065'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dce2f7'
  primary-fixed-dim: '#c0c6db'
  on-primary-fixed: '#141b2b'
  on-primary-fixed-variant: '#404758'
  secondary-fixed: '#dce2f3'
  secondary-fixed-dim: '#c0c7d6'
  on-secondary-fixed: '#151c27'
  on-secondary-fixed-variant: '#404754'
  tertiary-fixed: '#f9debf'
  tertiary-fixed-dim: '#dcc2a4'
  on-tertiary-fixed: '#261906'
  on-tertiary-fixed-variant: '#55442d'
  background: '#fcf8fa'
  on-background: '#1b1b1d'
  surface-variant: '#e5e2e3'
typography:
  display:
    fontFamily: Inter
    fontSize: 30px
    fontWeight: '600'
    lineHeight: 38px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.01em
  caption:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
  space-2xl: 3rem
  container-margin: 2rem
  gutter: 1.5rem
---

## Brand & Style

This design system is built for internal high-end retail operations, prioritizing clarity, efficiency, and a premium aesthetic. The brand personality is "Quiet Authority"—it is confident, functional, and unobtrusive. 

The style utilizes **Modern Minimalism** with a focus on high-quality typography and structured whitespace. It draws inspiration from industry-leading utility dashboards like Stripe and Linear, moving away from decorative elements to favor a "content-first" hierarchy. The interface relies on a clean contrast between the canvas and elevated surface cards to organize complex inventory and order data without overwhelming the user.

## Colors

The palette is strictly functional, utilizing a grayscale foundation to allow product photography and status indicators to stand out. 

- **Canvas:** Use `#F7F7F7` for the main application background to provide a soft contrast against white cards.
- **Surface:** Use `#FFFFFF` for all primary containers, data tables, and input groups.
- **Typography:** Primary text uses `#111827` (almost black) for maximum legibility. Secondary text and metadata use `#6B7280`.
- **Accents:** Semantic colors (Success, Warning, Danger) are used sparingly for status badges, validation states, and destructive actions.

## Typography

This system uses **Inter** exclusively. It is a highly legible neo-grotesque font designed for computer screens. 

- **Headlines:** Use Semi-Bold (`600`) weights with slight negative letter-spacing to create a "compact" premium look.
- **Body:** Standard body text is `14px` for high-density administrative tasks. 
- **Labels:** Use Medium (`500`) weights for form labels and table headers to distinguish them from data.
- **Scaling:** On mobile, reduce `display` and `headline-lg` by one scale tier (e.g., `display` becomes `24px`).

## Layout & Spacing

The layout follows a **Fixed-Fluid hybrid grid**. Side navigation is fixed at `280px`, while the main content area expands to a maximum of `1440px` before centering.

- **Rhythm:** Use a base 4px/8px grid system. 
- **Margins:** Main page content should have a `32px` (`space-xl`) margin from the edges.
- **Grouping:** Use `16px` (`space-md`) for internal card padding and `24px` (`space-lg`) for spacing between distinct sections or cards.
- **Mobile:** Downscale side margins to `16px` and stack all multi-column form layouts into a single column.

## Elevation & Depth

To maintain a minimal aesthetic, depth is created through **Tonal Separation** and **Low-Contrast Outlines** rather than heavy shadows.

- **Level 0 (Canvas):** `#F7F7F7`. Background for the entire application.
- **Level 1 (Cards):** `#FFFFFF` with a `1px` solid border of `#E5E7EB`. Use a very subtle ambient shadow: `0 1px 3px 0 rgba(0, 0, 0, 0.05)`.
- **Level 2 (Dropdowns/Modals):** `#FFFFFF` with a more pronounced shadow: `0 10px 15px -3px rgba(0, 0, 0, 0.1)`.
- **Interactive:** Hover states on clickable items should use a subtle background shift to `#F9FAFB` rather than an elevation change.

## Shapes

The design system uses a "Rounded" geometry to soften the technical nature of an admin dashboard.

- **Small elements:** Buttons, inputs, and checkboxes use `8px` (`rounded-md`).
- **Large elements:** Main content cards and modals use `12px` (`rounded-lg`).
- **Badges:** Status chips and tags use a fully rounded "pill" shape for distinct visual categorization.

## Components

### Buttons
- **Primary:** Background `#111827`, Text `#FFFFFF`. Solid, no border.
- **Secondary:** Background `#FFFFFF`, Border `1px solid #E5E7EB`, Text `#111827`.
- **Danger:** Background `#FEE2E2` (Soft Red), Text `#EF4444`. No border.

### Input Fields
- Heights should be standardized at `40px` for standard and `32px` for compact.
- Use a `1px` border of `#E5E7EB`. On focus, use a `2px` ring of `#111827` (or a very dark gray).

### Cards
- White background, `1px` border, and `24px` internal padding. 
- Headers within cards should have a bottom border separating the title from the content.

### Data Tables
- Use `14px` Medium weight for headers with a `#6B7280` color.
- Row height should be a minimum of `56px` to maintain a luxury, spacious feel.
- Use horizontal dividers only; avoid vertical grid lines.

### Status Badges
- Small, pill-shaped tags with soft background tints and high-contrast text (e.g., Success: Light Green bg, Dark Green text).