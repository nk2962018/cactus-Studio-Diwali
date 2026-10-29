import type { Category, Product, Variant } from "@/lib/commerce";
import hero from "./cactus_studios_mockup_images/01_hero_plants_and_idol.png";
import jadeCategory from "./cactus_studios_mockup_images/02_jade_plant.png";
import candleCategory from "./cactus_studios_mockup_images/03_flower_candle.png";
import tealights from "./cactus_studios_mockup_images/04_tealight_set.png";
import idols from "./cactus_studios_mockup_images/05_lakshmi_ganesha_idols.png";
import giftBox from "./cactus_studios_mockup_images/06_curated_gift_box.png";
import bulkGifts from "./cactus_studios_mockup_images/07_bulk_gifts.png";
import jadeCard from "./cactus_studios_mockup_images/08_jade_product_card.png";
import bamboo from "./cactus_studios_mockup_images/09_bamboo_product_card.png";
import goldenPothos from "./cactus_studios_mockup_images/10_golden_pothos.png";
import silverPothos from "./cactus_studios_mockup_images/11_silver_pothos.png";
import syngoniumPink from "./cactus_studios_mockup_images/12_syngonium_pink.png";
import syngoniumGreen from "./cactus_studios_mockup_images/13_syngonium_green.png";
import jadeDetail from "./cactus_studios_mockup_images/14_jade_product_detail.png";
import candleDetail from "./cactus_studios_mockup_images/15_flower_candle_large.png";
import jadeCart from "./cactus_studios_mockup_images/16_cart_jade_thumbnail.png";
import candleCart from "./cactus_studios_mockup_images/17_cart_candle_thumbnail.png";
import tealightCart from "./cactus_studios_mockup_images/18_cart_tealight_thumbnail.png";

export const categories: { name: Category | "Bulk Orders"; subtitle: string; image: string; position?: string }[] = [
  { name: "Plants", subtitle: "Little gifts. Lasting joy.", image: jadeCategory.src },
  { name: "Candles", subtitle: "A little handmade warmth.", image: candleCategory.src },
  { name: "Tealights", subtitle: "Festive tealight sets", image: tealights.src },
  { name: "Idols & DIY", subtitle: "Tradition, with your own touch.", image: idols.src },
  { name: "Curated Gifts", subtitle: "Thoughtfully put together.", image: giftBox.src },
  { name: "Bulk Orders", subtitle: "More people. More happiness.", image: bulkGifts.src },
];
export const heroImage = hero.src;
export const bulkImage = bulkGifts.src;
export const potSizes: Variant = { id: "potSize", label: "Pot size", options: [{ value: "2", label: '2"', adjustment: 0 }, { value: "3", label: '3"', adjustment: 150 }, { value: "4", label: '4"', adjustment: 300 }] };
const plantTypes: Variant = { id: "plant", label: "Plant", options: [{ value: "jade", label: "Jade", adjustment: 0 }, { value: "pothos", label: "Pothos", adjustment: 50 }, { value: "syngonium", label: "Syngonium", adjustment: 100 }] };
const candlePacks: Variant = { id: "pack", label: "Pack size", options: [{ value: "2", label: "2", adjustment: 0 }, { value: "6", label: "6", adjustment: 200 }, { value: "12", label: "12", adjustment: 550 }, { value: "24", label: "24", adjustment: 1200 }, { value: "bulk", label: "Bulk (50)", adjustment: 2500 }] };
const designs: Variant = { id: "design", label: "Design", options: [{ value: "classic", label: "Classic ivory", adjustment: 0 }, { value: "rose", label: "Dusty rose", adjustment: 40 }, { value: "sage", label: "Sage green", adjustment: 40 }] };
const tealightPacks: Variant = { id: "pack", label: "Pack size", options: [{ value: "6", label: "6", adjustment: 0 }, { value: "12", label: "12", adjustment: 150 }, { value: "24", label: "24", adjustment: 450 }, { value: "50", label: "50", adjustment: 1050 }, { value: "100", label: "100", adjustment: 2200 }] };
const kitTypes: Variant = { id: "kit", label: "Kit type", options: [{ value: "lakshmi", label: "Lakshmi", adjustment: 0 }, { value: "ganesha", label: "Ganesha", adjustment: 0 }, { value: "set", label: "Lakshmi + Ganesha", adjustment: 250 }, { value: "trinket", label: "Trinket", adjustment: -50 }] };
const giftFinish: Variant = { id: "finish", label: "Gift finish", options: [{ value: "natural", label: "Natural kraft", adjustment: 0 }, { value: "festive", label: "Festive wrap", adjustment: 100 }] };

const plants = [
  { id: "jade", name: "Jade Plant", description: "A little green. A lot of good wishes.", detail: "A cheerful succulent and a thoughtful symbol of good fortune. Hand-potted in a simple nursery pot, ready to find a sunny corner in someone's home.", image: jadeCard.src, price: 249 },
  { id: "bamboo", name: "Lucky Bamboo", description: "Good fortune, beautifully rooted.", detail: "An easy-to-love living gift for new beginnings. Keep in gentle, indirect light and refresh its water regularly.", image: bamboo.src, price: 299 },
  { id: "golden-pothos", name: "Golden Pothos", description: "A golden touch for their favourite corner.", detail: "Heart-shaped leaves with golden variegation. A forgiving companion for first-time plant parents, in a simple everyday pot.", image: goldenPothos.src, price: 249 },
  { id: "silver-pothos", name: "Silver Pothos", description: "Soft silver leaves. Quiet everyday joy.", detail: "Delicate silver-patterned foliage, hand-potted with care. Happiest in bright, indirect light with soil allowed to dry between watering.", image: silverPothos.src, price: 299 },
  { id: "syngonium-pink", name: "Syngonium Pink", description: "A gentle blush of something beautiful.", detail: "Soft pink, arrow-shaped foliage for a lovely little living gift. A simple pot keeps the attention on its beautiful leaves.", image: syngoniumPink.src, price: 299 },
  { id: "syngonium-green", name: "Syngonium Green", description: "Fresh beginnings, in a little green pot.", detail: "Lush arrowhead foliage and an easygoing nature. An everyday reminder of your festive wishes, long after Diwali.", image: syngoniumGreen.src, price: 249 },
];
export const products: Product[] = [
  ...plants.map((plant, index): Product => ({ id: plant.id, name: plant.name, category: "Plants", description: plant.description, detail: plant.detail, images: [plant.image], ...(plant.id === "jade" ? { detailImage: jadeDetail.src, cartImage: jadeCart.src } : {}), basePrice: plant.price, variants: [potSizes], available: true, featured: index === 0 })),
  ...["Flower Candles", "Heart Candles", "Handmade Soy Wax Candles", "Premium Festive Candles", "Decorative Diwali Candles"].map((name, index): Product => ({ id: ["flower-candles", "heart-candles", "soy-candles", "premium-candles", "diwali-candles"][index], name, category: "Candles", description: "Hand-poured warmth for moments that matter.", detail: "Small-batch, handmade candles in soft festive tones. Each piece is finished by hand, so little variations are part of its charm. Place on a heat-safe surface and never leave a burning candle unattended.", images: [candleCategory.src], detailImage: candleDetail.src, cartImage: candleCart.src, basePrice: 199 + index * 50, variants: [designs, candlePacks], available: true, featured: index === 0 })),
  ...["Handmade Tealights", "Decorative Tealights", "Diwali Tealight Sets", "Festive Tealight Packs"].map((name, index): Product => ({ id: ["handmade-tealights", "decorative-tealights", "diwali-tealights", "festive-tealights"][index], name, category: "Tealights", description: "Little pools of light. A whole lot of festive feeling.", detail: "Handmade tealights to brighten a table, a doorway, or a thoughtful gift box. Keep away from children, pets and flammable materials. Never leave a flame unattended.", images: [tealights.src], cartImage: tealightCart.src, basePrice: 199 + index * 30, variants: [tealightPacks], available: true })),
  ...["Lakshmi Idol", "Ganesha Idol", "Lakshmi & Ganesha Set", "Paint Yourself Idol Kit", "Paint Yourself Trinket Kit"].map((name, index): Product => ({ id: ["lakshmi", "ganesha", "divine-set", "diy-idol", "diy-trinket"][index], name, category: "Idols & DIY", description: index > 2 ? "A little colour. A celebration made your own." : "A thoughtful expression of festive blessings.", detail: index > 2 ? "Includes a raw white idol or trinket, paints, brushes and DIY instructions. A mindful festive activity to enjoy together." : "Handmade in the original Cactus Studios design. A thoughtful gift for festive blessings.", images: [idols.src], basePrice: index === 2 ? 699 : index > 2 ? 449 : 399, variants: index > 2 ? [kitTypes] : [], available: true })),
  ...[
    { id: "green-box", name: "Green Diwali Box", description: "A living gift, a little light, a lasting smile.", detail: "Your choice of plant, handmade tealights and thoughtful gift packaging. A little box of greener celebrations.", price: 699, variants: [plantTypes, potSizes, giftFinish] },
    { id: "glow-box", name: "Festive Glow Box", description: "All the warmth of Diwali, beautifully boxed.", detail: "Handmade candles, tealights and festive packaging, brought together for a celebration that glows.", price: 799, variants: [designs, giftFinish] },
    { id: "divine-box", name: "Divine Diwali Box", description: "Blessings and a beautiful little glow.", detail: "A handmade Lakshmi or Ganesha idol, tealights and gift packaging. Original studio idol designs only.", price: 899, variants: [{ id: "idol", label: "Idol", options: [{ value: "lakshmi", label: "Lakshmi", adjustment: 0 }, { value: "ganesha", label: "Ganesha", adjustment: 0 }, { value: "both", label: "Both", adjustment: 300 }] }, giftFinish] },
    { id: "creative-box", name: "Creative Diwali Box", description: "For the joy of making something together.", detail: "A raw white DIY idol or trinket, paints, brushes, instructions and beautiful packaging.", price: 749, variants: [kitTypes, giftFinish] },
    { id: "premium-hamper", name: "Premium Diwali Hamper", description: "A little bit of everything. A whole lot of thought.", detail: "A plant, handmade candles, tealights, an original studio idol and premium packaging. Add a personal gift note for someone special.", price: 1799, variants: [plantTypes, potSizes, giftFinish] },
  ].map((gift): Product => ({ id: gift.id, name: gift.name, category: "Curated Gifts", description: gift.description, detail: gift.detail, images: [giftBox.src], basePrice: gift.price, variants: gift.variants, available: true, customizable: true, featured: gift.id === "green-box" })),
];
export const getProduct = (id: string) => products.find(product => product.id === id);