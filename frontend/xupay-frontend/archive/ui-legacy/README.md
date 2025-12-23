# Archive: UI Legacy Components

This directory contains archived UI and marketing components that were removed from the active UI layer as part of a cleanup and redesign effort.

Why archived:
- Components were large, visually inconsistent, or duplicate a simpler implementation.
- We are rebuilding the visual layer with a small, modern, desktop-first design system.

Moved items:
- `src/components/home/*` (Hero, Navbar, FeaturesGrid, CTA, SocialProof, ParticleBackground, Footer, FeatureCard, etc.)
- `src/components/layout/AuthMarketingPanel.tsx`

If you need to restore or inspect any of the archived files, they are preserved here with full Git history.

Next steps:
1. Scaffold a minimal design system under `src/components/ui/` (Container, MinimalHeader, MinimalFooter, Buttons).
2. Replace `src/app/page.tsx` with a small, modern landing page (desktop-first) that uses the new components.
3. Add stories and run visual QA.

If anything here was moved by mistake, let me know and I will restore it immediately.
