# Cactus Studios

A Next.js App Router product catalogue with TypeScript, Tailwind CSS, a data-driven product list, a local order basket and guest WhatsApp order handoff. No customer accounts or payments are implemented.

## Run

Use Node.js 20.19 or newer (Node 22 LTS recommended).

```sh
npm install
npm run dev
```

Open http://localhost:3000. If that port is in use, run `npm run dev -- --port 3001`.

## Catalogue & Images

Edit `src/data/catalogue.ts` to add products, variants, collection prices, minimum quantities, and availability. Plants are contact-priced bulk products with a 50-unit minimum. Candles and tealights accept 6, 12, or custom quantities from 24; displayed collection prices come from the catalogue while other quantities are confirmed on WhatsApp.

Product and category photography uses the supplied images in `src/data/products` and `src/data/cactus_studios_mockup_images`. The order basket stores selected variants and recalculates quantity rules from the product catalogue.

The included catalogue/prices are initial sample merchandising data and need business approval. Product families without individual supplied photos share the matching category image, including candle designs, idol/DIY products and curated gifts. Confirm that each image accurately represents the item and add individual photos as available. Original idol shapes are not generated or altered. Confirm stock, included materials, product safety, taxes, fulfilment policies and contact email before launch.

## Customer Flow

Browse -> choose variants and quantities -> add to order basket -> enter name, Indian phone and delivery address -> review -> WhatsApp -> personal confirmation from the studio.

WhatsApp messages are generated at click time for `+91 9966998768`. They include customer details, variants, quantities, known collection prices, contact-pricing notices, and bulk payment terms when applicable. No payment is collected. A WhatsApp handoff is not an order confirmation, and the basket remains available after the handoff.

`src/lib/commerce.ts` owns pricing, quantity validation, cart identity and WhatsApp message formatting. `src/components` contains reusable Header, ProductCard, ProductDetail, VariantSelector, QuantitySelector, Cart, CartItem, OrderSummary and guest WhatsApp order form components.

## Checks

```sh
npm test
npm run typecheck
npm run lint
npm run build
```

Manual release gates: all categories, variant prices, plant minimum of 50, candle/tealight collection validation, two configurations of one product, quantity changes/removal and basket persistence, empty basket, invalid guest details, WhatsApp message and recipient, bulk payment terms, keyboard navigation, 320/375/390/430px, tablet and desktop layouts, accurate photography and business-approved prices.

Product images are bundled locally and do not depend on external image hosts. Google Fonts requires an internet connection; fonts have readable local fallbacks.