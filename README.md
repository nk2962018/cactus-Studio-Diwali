# Cactus Studios

A Next.js App Router storefront with TypeScript, Tailwind CSS, a configuration-driven catalogue, Supabase phone OTP and profile storage, a local persistent bag and WhatsApp order handoff. No payments or order-management backend are implemented.

## Run

Use Node.js 20.19 or newer (Node 22 LTS recommended).

```sh
npm install
npm run dev
```

Open http://localhost:3000. If that port is in use, run `npm run dev -- --port 3001`.

## Enable Real Phone Login

1. Create a Supabase project.
2. Enable Phone authentication in Supabase Auth and configure a supported SMS provider, including Indian SMS/DLT requirements where applicable. Use six-digit OTPs. Configure appropriate expiry, resend limits, rate limits and SMS spending limits before launch.
3. Apply `supabase/schema.sql` in the Supabase SQL editor once. The profile table has owner-only row-level security. Phone comes from the authenticated user, not editable profile data.
4. Create `.env.local` using `.env.example` and set your project URL and public anon key. Never put a service-role key in the browser or repository.
5. Add your production domain and localhost to Supabase's allowed site/redirect URLs, then restart Next.js.
6. Test with a real phone: send OTP, reject an invalid OTP, verify the correct OTP, save a profile, refresh, close/reopen the browser, log out, and log in again. Supabase supports configured test phone numbers for staging; never ship test OTPs or an authentication bypass.

Without configuration the catalogue, variants, bag and bulk enquiry work. Phone login displays an honest unavailable state and checkout remains gated. Real SMS delivery, auth persistence and database RLS need a configured Supabase project to verify end to end.

## Catalogue & Images

Edit `src/data/catalogue.ts` to add products, variant groups, option price adjustments, image URLs and availability. Prices are INR per selected item/pack; changing pack size changes the unit configuration, while quantity multiplies that configuration. Bulk candle packs are explicitly 50 pieces. Curated gift quantity uses the quantity stepper; distinct plant, pot and gift-finish options are preserved.

All storefront photography comes from `src/data/cactus_studios_mockup_images`. The catalogue imports the 18 supplied PNGs directly, including category photos, the hero, plant listings, large Jade/candle detail photos and dedicated cart thumbnails. Bulk banners and enquiries use the supplied bulk-gift image. Optional `detailImage` and `cartImage` fields select the appropriate asset without changing product or cart identity. Saved carts resolve current catalogue imagery without losing their configurations.

The included catalogue/prices are initial sample merchandising data and need business approval. Product families without individual supplied photos share the matching category image, including candle designs, idol/DIY products and curated gifts. Confirm that each image accurately represents the item and add individual photos as available. Original idol shapes are not generated or altered. Confirm stock, included materials, product safety, taxes, fulfilment policies and contact email before launch.

## Customer Flow

Browse -> choose variants -> add to bag -> phone OTP -> delivery details -> optional saved address -> review -> WhatsApp -> personal confirmation from the studio.

WhatsApp messages are generated at click time for `+91 9966998768`, with customer details, every variation, custom notes, quantities, unit prices, line totals and subtotal. Delivery is explicitly excluded until confirmed by the studio; no invented zero delivery charge is used. A WhatsApp handoff is not an order confirmation and the bag is deliberately retained. Customer delivery/profile data is not stored in localStorage; Supabase persists authentication and the bag is stored locally. Bulk forms are not stored and submit directly through WhatsApp, without requiring login.

`src/lib/commerce.ts` owns pricing, cart identity, validation and message formatting. `src/components` contains reusable Header, ProductCard, ProductDetail, VariantSelector, QuantitySelector, Cart, CartItem, Login, UserProfile, AddressForm, OrderSummary and WhatsAppOrderButton components. Delivery pricing and a future order/payment service can be added at these domain boundaries without rewriting product components.

## Checks

```sh
npm test
npm run typecheck
npm run lint
npm run build
```

Manual release gates: real phone OTP and invalid/expired code handling; logout and session persistence; profile save/reload and owner-only RLS; all categories, multiple variants and dynamic prices; two configurations of one product; quantity changes/removal and bag persistence; empty bag; invalid delivery fields and prefill; optional email; order-message contents and recipient; bulk enquiry; keyboard navigation; 320/375/390/430px, tablet and desktop layouts; accurate photography and business-approved prices.

Product images are bundled locally and do not depend on external image hosts. Google Fonts requires an internet connection; fonts have readable local fallbacks.