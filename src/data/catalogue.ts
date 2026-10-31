import type { Category, Product, Variant } from "@/lib/commerce";
import decorativeFlowers from "./products/decorative_flowers.png";
import diyHolder01 from "./products/diy_holder_01.png";
import diyHolder02 from "./products/diy_holder_02.png";
import diyHolder03 from "./products/diy_holder_03.png";
import diyHolder04 from "./products/diy_holder_04.png";
import diyHolder05 from "./products/diy_holder_05.png";
import diyPaintKit from "./products/diy_paint_kit.png";
import diyShell from "./products/diy_shell.png";
import productIdols from "./products/lakshmi_ganesh_idols.png";
import plant01 from "./products/plant_01.png";
import plant02 from "./products/plant_02.png";
import plant03 from "./products/plant_03.png";
import plant04 from "./products/plant_04.png";
import plant05 from "./products/plant_05.png";
import productTealights from "./products/tealight_candles.png";
import hero from "./products/hero-image.png";
import giftBox from "./cactus_studios_mockup_images/06_curated_gift_box.png";
import bulkGifts from "./cactus_studios_mockup_images/07_bulk_gifts.png";
import jadeCard from "./cactus_studios_mockup_images/08_jade_product_card.png";
import syngoniumPink from "./cactus_studios_mockup_images/12_syngonium_pink.png";
import jadeDetail from "./cactus_studios_mockup_images/14_jade_product_detail.png";
import candleDetail from "./cactus_studios_mockup_images/15_flower_candle_large.png";
import jadeCart from "./cactus_studios_mockup_images/16_cart_jade_thumbnail.png";

export const categories: { name: Category | "Bulk Orders"; subtitle: string; image: string; position?: string }[] = [
  { name: "Plants", subtitle: "Bulk-grown gifts. Lasting joy.", image: plant05.src },
  { name: "Candles", subtitle: "Handmade candle collections.", image: decorativeFlowers.src },
  { name: "Tealights", subtitle: "Festive tealight collections.", image: productTealights.src },
  { name: "DIY / Trinkets", subtitle: "Create a celebration of your own.", image: diyPaintKit.src },
  { name: "Idols", subtitle: "Traditional handmade designs.", image: productIdols.src },
  { name: "Curated Gifts", subtitle: "Thoughtfully put together.", image: giftBox.src },
  { name: "Bulk Orders", subtitle: "Many gifts. Personal care.", image: bulkGifts.src },
];
export const heroImage = hero.src;
export const bulkImage = bulkGifts.src;
export const potSizes: Variant = { id: "potSize", label: "Pot size", options: [{ value: "3", label: '3"', adjustment: 0 }, { value: "4", label: '4"', adjustment: 0 }, { value: "5", label: '5"', adjustment: 0 }] };
const plantTypes: Variant = { id: "plant", label: "Plant", options: [{ value: "jade", label: "Jade", adjustment: 0 }, { value: "pothos", label: "Pothos", adjustment: 50 }, { value: "syngonium", label: "Syngonium", adjustment: 100 }] };
const designs: Variant = { id: "color", label: "Preferred color", options: [{ value: "ivory", label: "Ivory preferred", adjustment: 0 }, { value: "rose", label: "Rose preferred", adjustment: 0 }, { value: "sage", label: "Sage preferred", adjustment: 0 }] };
const kitTypes: Variant = { id: "kit", label: "Kit type", options: [{ value: "lakshmi", label: "Lakshmi", adjustment: 0 }, { value: "ganesha", label: "Ganesha", adjustment: 0 }, { value: "set", label: "Lakshmi + Ganesha", adjustment: 250 }, { value: "trinket", label: "Trinket", adjustment: -50 }] };
const giftFinish: Variant = { id: "finish", label: "Gift finish", options: [{ value: "natural", label: "Natural kraft", adjustment: 0 }, { value: "festive", label: "Festive wrap", adjustment: 100 }] };

const plants: { id: string; name: string; description: string; detail: string; image: string; additionalImages?: string[] }[] = [
  { id: "jade", name: "Jade Plant", description: "A little green. A lot of good wishes.", detail: "A cheerful succulent and a thoughtful symbol of good fortune. Hand-potted in a simple nursery pot, ready to find a sunny corner in someone's home.", image: jadeCard.src },
  { id: "bamboo", name: "Lucky Bamboo", description: "Good fortune, beautifully rooted.", detail: "An easy-to-love living gift for new beginnings. Keep in gentle, indirect light and refresh its water regularly.", image: plant02.src },
  { id: "golden-pothos", name: "Golden Pothos", description: "A golden touch for their favourite corner.", detail: "Heart-shaped leaves with golden variegation. A forgiving companion for first-time plant parents, in a simple everyday pot.", image: plant04.src },
  { id: "silver-pothos", name: "Silver Pothos", description: "Soft silver leaves. Quiet everyday joy.", detail: "Delicate silver-patterned foliage, hand-potted with care. Happiest in bright, indirect light with soil allowed to dry between watering.", image: plant01.src, additionalImages: [plant03.src] },
  { id: "syngonium-pink", name: "Syngonium Pink", description: "A gentle blush of something beautiful.", detail: "Soft pink, arrow-shaped foliage for a lovely little living gift. A simple pot keeps the attention on its beautiful leaves.", image: syngoniumPink.src },
  { id: "syngonium-green", name: "Syngonium Green", description: "Fresh beginnings, in a little green pot.", detail: "Lush arrowhead foliage and an easygoing nature. An everyday reminder of your festive wishes, long after Diwali.", image: plant05.src },
];
const handmadeDisclaimer = "Colors, patterns and finishes may vary slightly from the images due to handmade production and material availability.";
const candleCollectionPrices = (index: number) => ({ 6: 399 + index * 50, 12: 749 + index * 50, 24: 1399 + index * 50, 50: 2699 + index * 50 });
const tealightCollectionPrices = (index: number) => ({ 6: 199 + index * 30, 12: 349 + index * 30, 24: 649 + index * 30, 50: 1249 + index * 30 });
export const products: Product[] = [
  ...plants.map((plant, index): Product => ({ id: plant.id, name: plant.name, category: "Plants", productType: "plant", pricingType: "contact", bulkOnly: true, minimumQuantity: 50, availableSizes: potSizes.options.map(option => `${option.label} pot`), description: plant.description, detail: plant.detail, images: [plant.image, ...(plant.additionalImages ?? [])], ...(plant.id === "jade" ? { detailImage: jadeDetail.src, cartImage: jadeCart.src } : {}), variants: [potSizes], available: true, featured: index === 0 })),
  ...["Flower Candles", "Heart Candles", "Handmade Soy Wax Candles", "Premium Festive Candles", "Decorative Diwali Candles"].map((name, index): Product => ({ id: ["flower-candles", "heart-candles", "soy-candles", "premium-candles", "diwali-candles"][index], name, category: "Candles", productType: "candle", pricingType: "collection", minimumQuantity: 6, minimumCustomQuantity: 24, availableCollections: [6, 12], collectionPrices: candleCollectionPrices(index), availableColors: designs.options.map(option => option.label), disclaimer: handmadeDisclaimer, description: "Hand-poured warmth for moments that matter.", detail: "Small-batch, handmade candles in soft festive tones. Each piece is finished by hand. Place on a heat-safe surface and never leave a burning candle unattended.", images: [decorativeFlowers.src], detailImage: candleDetail.src, cartImage: decorativeFlowers.src, variants: [designs], available: true, featured: index === 0 })),
  ...["Handmade Tealights", "Decorative Tealights", "Diwali Tealight Sets", "Festive Tealight Packs"].map((name, index): Product => ({ id: ["handmade-tealights", "decorative-tealights", "diwali-tealights", "festive-tealights"][index], name, category: "Tealights", productType: "tealight", pricingType: "collection", minimumQuantity: 6, minimumCustomQuantity: 24, availableCollections: [6, 12], collectionPrices: tealightCollectionPrices(index), disclaimer: handmadeDisclaimer, description: "Little pools of light. A whole lot of festive feeling.", detail: "Handmade tealights to brighten a table, a doorway, or a thoughtful gift box. Keep away from children, pets and flammable materials. Never leave a flame unattended.", images: [productTealights.src], cartImage: productTealights.src, variants: [], available: true })),
  ...["Lakshmi Idol", "Ganesha Idol", "Lakshmi & Ganesha Set", "Paint Yourself Idol Kit", "Paint Yourself Trinket Kit"].map((name, index): Product => ({ id: ["lakshmi", "ganesha", "divine-set", "diy-idol", "diy-trinket"][index], name, category: index > 2 ? "DIY / Trinkets" : "Idols", productType: index > 2 ? "diy" : "idol", pricingType: "fixed", minimumQuantity: 1, disclaimer: index > 2 ? handmadeDisclaimer : undefined, description: index > 2 ? "A little colour. A celebration made your own." : "A thoughtful expression of festive blessings.", detail: index > 2 ? "Includes a raw white idol or trinket, paints, brushes and DIY instructions. A mindful festive activity to enjoy together." : "Handmade in the original Cactus Studios design. A thoughtful gift for festive blessings.", images: index > 2 ? [index === 3 ? diyPaintKit.src : diyShell.src, diyHolder01.src, diyHolder02.src, diyHolder03.src, diyHolder04.src, diyHolder05.src] : [productIdols.src], basePrice: index === 3 ? 449 : index === 2 ? 699 : 399, variants: index > 2 ? [kitTypes] : [], available: true })),
  ...[
    { id: "green-box", name: "Green Diwali Box", description: "A living gift, a little light, a lasting smile.", detail: "Your choice of plant, handmade tealights and thoughtful gift packaging. A little box of greener celebrations.", price: 699, variants: [plantTypes, potSizes, giftFinish] },
    { id: "glow-box", name: "Festive Glow Box", description: "All the warmth of Diwali, beautifully boxed.", detail: "Handmade candles, tealights and festive packaging, brought together for a celebration that glows.", price: 799, variants: [designs, giftFinish] },
    { id: "divine-box", name: "Divine Diwali Box", description: "Blessings and a beautiful little glow.", detail: "A handmade Lakshmi or Ganesha idol, tealights and gift packaging. Original studio idol designs only.", price: 899, variants: [{ id: "idol", label: "Idol", options: [{ value: "lakshmi", label: "Lakshmi", adjustment: 0 }, { value: "ganesha", label: "Ganesha", adjustment: 0 }, { value: "both", label: "Both", adjustment: 300 }] }, giftFinish] },
    { id: "creative-box", name: "Creative Diwali Box", description: "For the joy of making something together.", detail: "A raw white DIY idol or trinket, paints, brushes, instructions and beautiful packaging.", price: 749, variants: [kitTypes, giftFinish] },
    { id: "premium-hamper", name: "Premium Diwali Hamper", description: "A little bit of everything. A whole lot of thought.", detail: "A plant, handmade candles, tealights, an original studio idol and premium packaging. Add a personal gift note for someone special.", price: 1799, variants: [plantTypes, potSizes, giftFinish] },
  ].map((gift): Product => ({ id: gift.id, name: gift.name, category: "Curated Gifts", productType: "gift", pricingType: "fixed", description: gift.description, detail: gift.detail, images: [giftBox.src], basePrice: gift.price, variants: gift.variants, available: true, customizable: true, featured: gift.id === "green-box" })),
];
export const getProduct = (id: string) => products.find(product => product.id === id);