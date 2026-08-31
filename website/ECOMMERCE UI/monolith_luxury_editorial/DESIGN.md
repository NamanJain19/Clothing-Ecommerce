---
name: Monolith Luxury Editorial
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f4'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1a1c1c'
  on-surface-variant: '#4c4546'
  inverse-surface: '#2f3131'
  inverse-on-surface: '#f0f1f1'
  outline: '#7e7576'
  outline-variant: '#cfc4c5'
  surface-tint: '#5e5e5e'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#1b1b1b'
  on-primary-container: '#848484'
  inverse-primary: '#c6c6c6'
  secondary: '#5d5f5f'
  on-secondary: '#ffffff'
  secondary-container: '#dcdddd'
  on-secondary-container: '#5f6161'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#1a1c1c'
  on-tertiary-container: '#838484'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2e2e2'
  primary-fixed-dim: '#c6c6c6'
  on-primary-fixed: '#1b1b1b'
  on-primary-fixed-variant: '#474747'
  secondary-fixed: '#e2e2e2'
  secondary-fixed-dim: '#c6c6c7'
  on-secondary-fixed: '#1a1c1c'
  on-secondary-fixed-variant: '#454747'
  tertiary-fixed: '#e2e2e2'
  tertiary-fixed-dim: '#c6c6c6'
  on-tertiary-fixed: '#1a1c1c'
  on-tertiary-fixed-variant: '#454747'
  background: '#f9f9f9'
  on-background: '#1a1c1c'
  surface-variant: '#e2e2e2'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 72px
    fontWeight: '400'
    lineHeight: 84px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 48px
    fontWeight: '400'
    lineHeight: 56px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 40px
    fontWeight: '400'
    lineHeight: 48px
  headline-md:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '400'
    lineHeight: 40px
  body-lg:
    fontFamily: Montserrat
    fontSize: 18px
    fontWeight: '300'
    lineHeight: 32px
    letterSpacing: 0.01em
  body-md:
    fontFamily: Montserrat
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-caps:
    fontFamily: Montserrat
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.15em
  button:
    fontFamily: Montserrat
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.1em
spacing:
  unit: 8px
  container-max: 1440px
  gutter: 32px
  margin-desktop: 64px
  margin-mobile: 20px
  section-gap: 128px
---

## Brand & Style

This design system embodies the "Quiet Luxury" movement, prioritizing structural integrity, excessive whitespace, and high-contrast visuals. The brand personality is authoritative yet understated, catering to an audience that values curation over noise. 

The aesthetic is **Minimalist-Editorial**. It draws inspiration from high-end print magazines, utilizing asymmetrical layouts and "breathing room" to elevate product photography. The UI acts as a silent frame for the content, ensuring that the interface never competes with the fashion itself. All movements should be slow and intentional, utilizing ease-in-out transitions to mimic the grace of a physical boutique experience.

## Colors

The palette is strictly monochromatic to ensure timelessness. 

- **Primary (#000000):** Used for all high-level typography, primary CTAs, and structural borders. It represents the "Ink" of the editorial experience.
- **Secondary (#F5F5F5):** A soft, warm grey used for large background sections to prevent the "harshness" of pure white on high-density displays.
- **Tertiary (#E5E5E5):** Reserved for subtle dividers, disabled states, and secondary UI containers.
- **Neutral (#FFFFFF):** The canvas. Used for primary content containers and button text when placed on black backgrounds.

Accent colors are strictly forbidden; any color in the UI should originate solely from the product photography.

## Typography

The typographic hierarchy relies on the tension between the classic Serif and the modern Sans-Serif.

1.  **Headlines (Playfair Display):** Should always be set with standard or tight tracking. Use for storytelling and product titles.
2.  **Body (Montserrat):** Set with light weights (300/400) and generous line heights to ensure legibility and a sense of "air."
3.  **Labels & Navigation:** Always use uppercase Montserrat with wide letter spacing (0.1em+) to create a formal, architectural feel. 

Avoid bold weights for Serif fonts; authority is established through size and scale rather than thickness.

## Layout & Spacing

This design system utilizes a **Fixed Grid** philosophy for desktop to maintain strict editorial proportions.

- **Desktop:** 12-column grid, 1440px max-width, 64px outside margins. Use "offset" layouts where images span 7 columns and text spans 4 to create visual interest.
- **Mobile:** 4-column grid with 20px margins.
- **Rhythm:** Vertical spacing is aggressive. Use `section-gap` (128px) between different content blocks to signal a change in the narrative. 

Content should never feel "cramped." If in doubt, add more whitespace. The goal is to make the user feel they are scrolling through a physical coffee-table book.

## Elevation & Depth

Depth is achieved through **Tonal Layering** rather than shadows. This system rejects the use of drop shadows to maintain a flat, high-fashion print aesthetic.

- **Level 0 (Base):** Neutral white or Secondary grey backgrounds.
- **Level 1 (Cards/Overlays):** Use pure white surfaces against the secondary grey background with a 1px solid border (#E5E5E5).
- **Modals:** Use a high-density backdrop blur (20px+) with a 60% opacity white overlay. This creates a "frosted glass" effect that feels like a physical vellum sheet.
- **Interactions:** Use subtle shifts in background color (e.g., White to #F5F5F5) rather than lifting elements off the Z-axis.

## Shapes

The shape language is strictly **Sharp (0px)**. 

Every element—buttons, input fields, product images, and cards—must have 90-degree corners. This evokes a sense of architectural precision and luxury tailoring. Avoid any rounded corners or "pill" shapes, as they detract from the serious, high-end nature of the brand.

## Components

- **Buttons:** Primary buttons are solid Black with White text, uppercase. Secondary buttons are transparent with a 1px solid Black border (Ghost style). Hover states should involve a simple color inversion.
- **Product Cards:** Full-bleed imagery with a sharp 1px border. Product names in Playfair Display (Headline-md) and prices in Montserrat (Label-caps). No shadows.
- **Navigation:** Top-tier navigation is centered and minimal. Links use `label-caps` with a 1px underline that appears only on hover.
- **Input Fields:** A single 1px bottom border (#000000) with a placeholder in `body-md` (light grey). No enclosing boxes.
- **Chips/Filters:** Simple text links with a horizontal divider or a small "+" symbol. Do not use contained pill shapes.
- **Quantity Selectors:** Minimalist "+" and "-" icons with no surrounding box, separated by the numeric value in `body-md`.