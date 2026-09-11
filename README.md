# Sunehri — coded site (two directions)

Real, production-ready implementations of the two directions from the Claude
Design handoff (`organic-honey-whatsapp-store/`). Plain HTML/CSS/JS, no build
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
- **WhatsApp number** is `+91 98159 80350` and the email is
  `hello@sunehri.in` — update every `wa.me/919815980350` link and the footer
  contact block if either changes.

## Cart → one WhatsApp message

The three jar sizes (250g / 500g / 1kg) each have a quantity stepper instead
of a direct order link. Add a few, and a floating bar appears at the bottom
of the page showing item count and total — tap it to review the order in a
slide-up drawer (quantities still editable there), then **Order on
WhatsApp** composes one message listing every line item, quantities, and
the total, and opens it in WhatsApp. Every other "Order on WhatsApp" button
on the page (hero, header pill, footer) automatically points at that same
message once the cart has items, and falls back to the generic "I'd like to
order honey" greeting when it's empty.

There's no backend: the cart lives in the visitor's own browser
(`localStorage`, key `sunehri:cart`) and nothing is sent anywhere until they
tap the WhatsApp button themselves — still "no cart, no account" in the
sense the copy promises, just with a quantity picker ahead of the one
message. The gift duo / sampler trio bundles stay as their own direct
"ask on WhatsApp" links since they're custom-priced, not catalog items with
a fixed price.

## Structure

```
sunehri-website/
  light/
    index.html
    styles.css
    cart.js
  dark/
    index.html
    styles.css
    cart.js
```

Both pages are mobile-first (the original design target) and scale up to a
centered card on larger screens. The FAQ sections use native
`<details>/<summary>` — real, accessible accordions with no JS. `cart.js` is
the only script on either page and is identical in both folders (same three
products, same WhatsApp number) — update prices/products by editing the
`data-name`/`data-price` attributes on the `[data-product-id]` elements in
each `index.html`; nothing in `cart.js` itself needs to change for that.
