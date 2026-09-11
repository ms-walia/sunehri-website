# Sunehri — coded site (two directions)

Real, production-ready implementations of the two directions from the Claude
Design handoff (`organic-honey-whatsapp-store/`). Plain HTML/CSS, no build
step, no framework — open either `index.html` directly or serve the folder
with any static host.

- **`light/`** — Direction 1A: cream & amber, warm and editorial.
- **`dark/`** — Direction 1B: dark and product-forward, high contrast.

Each is a fully independent, self-contained page (own markup + stylesheet) —
not a shared template — matching the distinct copy, section order, and
imagery of its source design.

## Before you launch

- **Photos are placeholders.** Every image is a real, appropriately-licensed
  stock photo from Wikimedia Commons (with an on-page credit link, as their
  licenses require) standing in for your own product photography. Replace
  the `src` on each `<img>` with real photos of your jars, hives, and
  beekeeper before going live, and remove the corresponding `<figcaption
  class="credit">` once the photo is yours.
- **Instagram link is a placeholder (`href="#"`).** Fill in your real handle
  in the footer of both pages once you have one.
- **WhatsApp number** is `+91 78142 14645` and the email is
  `hello@sunehri.in`, taken from the design — update every `wa.me/917814214645`
  link and the footer contact block if either changes.

## Structure

```
sunehri-website/
  light/
    index.html
    styles.css
  dark/
    index.html
    styles.css
```

Both pages are mobile-first (the original design target) and scale up to a
centered card on larger screens. The FAQ sections use native
`<details>/<summary>` so they're real, accessible accordions — no JS
required anywhere on either page.
