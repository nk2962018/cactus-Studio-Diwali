export type VariantOption = { value: string; label: string; adjustment: number };
export type Variant = { id: string; label: string; options: VariantOption[] };
export type Category = "Plants" | "Candles" | "Tealights" | "DIY / Trinkets" | "Idols" | "Curated Gifts";
export type ProductType = "plant" | "candle" | "tealight" | "diy" | "idol" | "gift";
export type PricingType = "fixed" | "collection" | "contact";
export type Product = {
  id: string;
  name: string;
  category: Category;
  description: string;
  detail: string;
  images: string[];
  detailImage?: string;
  cartImage?: string;
  productType: ProductType;
  pricingType: PricingType;
  basePrice?: number;
  collectionPrices?: Record<number, number>;
  availableCollections?: number[];
  availableSizes?: string[];
  availableColors?: string[];
  minimumQuantity?: number;
  minimumCustomQuantity?: number;
  bulkOnly?: boolean;
  disclaimer?: string;
  variants: Variant[];
  available: boolean;
  featured?: boolean;
  customizable?: boolean;
  imagePosition?: string;
};
export type Selection = Record<string, string>;
export type CartLine = {
  key: string;
  productId: string;
  name: string;
  variants: Selection;
  variantLabels: Record<string, string>;
  quantity: number;
  unitPrice: number;
  totalPrice: number | null;
  pricingType: PricingType;
  collectionSize?: number;
  bulkOnly: boolean;
  minimumQuantity: number;
  image: string;
  customization: string;
};
export type DeliveryDetails = {
  name: string;
  phone: string;
  email: string;
  address: string;
  address2?: string;
  landmark: string;
  pincode: string;
  instructions: string;
};
export const emptyDelivery: DeliveryDetails = { name: "", phone: "", email: "", address: "", address2: "", landmark: "", pincode: "", instructions: "" };
export const money = (amount: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);
export const defaults = (product: Product): Selection => Object.fromEntries(product.variants.map(variant => [variant.id, variant.options[0].value]));
export function priceFor(product: Product, selection: Selection): number {
  if (product.basePrice === undefined || product.pricingType !== "fixed") throw new Error("This product is priced on request.");
  return product.basePrice + product.variants.reduce((total, variant) => {
    const option = variant.options.find(candidate => candidate.value === selection[variant.id]);
    if (!option) throw new Error(`Please select ${variant.label}`);
    return total + option.adjustment;
  }, 0);
}
export function validOrderQuantity(product: Product, quantity: number): boolean {
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 9999) return false;
  if (product.bulkOnly) return quantity >= (product.minimumQuantity ?? 50);
  if (product.pricingType === "collection") return quantity === 6 || quantity === 12 || quantity >= (product.minimumCustomQuantity ?? 24);
  return true;
}
export function collectionSizeFor(quantity: number): number | undefined {
  if (quantity === 6 || quantity === 12) return quantity;
  return quantity >= 50 ? 50 : quantity >= 24 ? 24 : undefined;
}
export function makeLine(product: Product, selection: Selection, quantity: number, customization = ""): CartLine {
  if (!product.available) throw new Error("This product is not available.");
  if (!validOrderQuantity(product, quantity)) {
    if (product.bulkOnly) throw new Error("Plants are available for bulk orders only. Minimum order quantity is 50.");
    if (product.pricingType === "collection") throw new Error("Choose 6 or 12 pieces, or enter a custom quantity of at least 24 pieces.");
    throw new Error("Quantity must be a whole number between 1 and 9,999.");
  }
  const variants = Object.fromEntries(product.variants.map(variant => [variant.id, selection[variant.id]]));
  const variantLabels = Object.fromEntries(product.variants.map(variant => [variant.label, variant.options.find(option => option.value === selection[variant.id])?.label ?? ""]));
  const note = customization.trim().slice(0, 300);
  const collectionSize = product.pricingType === "collection" ? collectionSizeFor(quantity) : undefined;
  const unitPrice = product.pricingType === "fixed" ? priceFor(product, variants) : 0;
  const totalPrice = product.pricingType === "fixed" ? unitPrice * quantity : product.pricingType === "collection" && collectionSize === quantity ? product.collectionPrices?.[collectionSize] ?? null : null;
  return { key: JSON.stringify([product.id, Object.entries(variants).sort(), note, collectionSize]), productId: product.id, name: product.name, variants, variantLabels, quantity, unitPrice, totalPrice, pricingType: product.pricingType, collectionSize, bulkOnly: !!product.bulkOnly, minimumQuantity: product.minimumQuantity ?? 1, image: product.cartImage ?? product.images[0] ?? "", customization: note };
}
export function addLine(lines: CartLine[], incoming: CartLine): CartLine[] {
  const existing = lines.find(line => line.key === incoming.key);
  return existing ? lines.map(line => line.key === incoming.key ? { ...line, quantity: Math.min(9999, line.quantity + incoming.quantity), totalPrice: line.totalPrice !== null && incoming.totalPrice !== null ? line.totalPrice + incoming.totalPrice : null } : line) : [...lines, incoming];
}
export const cartTotal = (lines: CartLine[]) => lines.reduce((total, line) => total + (line.totalPrice ?? 0), 0);
export const hasContactPricing = (lines: CartLine[]) => lines.some(line => line.totalPrice === null);
export function normalizeIndianPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  const national = digits.length === 12 && digits.startsWith("91") ? digits.slice(2) : digits;
  return /^[6-9]\d{9}$/.test(national) ? `+91${national}` : "";
}
export function validateDelivery(details: DeliveryDetails): string | null {
  if (details.name.trim().length < 2) return "Please enter your full name.";
  if (!normalizeIndianPhone(details.phone)) return "Please enter a valid Indian mobile number.";
  if (details.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(details.email)) return "Please enter a valid email address.";
  if (details.address.trim().length < 8) return "Please enter your complete delivery address.";
  if (details.pincode && !/^[1-9]\d{5}$/.test(details.pincode)) return "Please enter a valid six-digit Indian pincode.";
  return null;
}
export function orderMessage(details: DeliveryDetails, lines: CartLine[]): string {
  const error = validateDelivery(details);
  if (error) throw new Error(error);
  if (!lines.length) throw new Error("Your bag is empty.");
  for (const line of lines) {
    if (line.bulkOnly && line.quantity < line.minimumQuantity) throw new Error("Plants are available for bulk orders only. Minimum order quantity is 50.");
    if (line.pricingType === "collection" && line.collectionSize === 50 && line.quantity < 50) throw new Error("Bulk orders start at 50 pieces.");
    if (line.pricingType === "collection" && line.quantity !== 6 && line.quantity !== 12 && line.quantity < 24) throw new Error("Custom quantities must be 24 pieces or more.");
  }
  const bulkOrder = lines.some(line => line.bulkOnly || line.quantity >= 50);
  const orderLines = lines.flatMap((line, index) => ["", `${index + 1}. ${line.name}`, ...Object.entries(line.variantLabels).map(([label, value]) => `${label}: ${value}`), ...(line.collectionSize ? [`Collection: ${line.collectionSize} pieces`] : []), ...(line.customization ? [`Customization: ${line.customization}`] : []), `Quantity: ${line.quantity} pieces`, `Price: ${line.totalPrice === null ? "To be confirmed on WhatsApp" : money(line.totalPrice)}`]);
  return ["Hello Cactus Studio,", "", "I would like to place an order.", "", "Customer Details:", `Name: ${details.name.trim()}`, `Phone: ${normalizeIndianPhone(details.phone)}`, ...(details.email ? [`Email: ${details.email.trim()}`] : []), "", "Delivery Address:", details.address.trim(), ...(details.address2 ? [details.address2.trim()] : []), ...(details.landmark ? [`Landmark: ${details.landmark.trim()}`] : []), ...(details.pincode ? [`Pincode: ${details.pincode}`] : []), ...(details.instructions ? [`Special instructions: ${details.instructions.trim()}`] : []), "", "Order:", ...orderLines, "", `Order Type: ${bulkOrder ? "Bulk" : "Regular"}`, ...(cartTotal(lines) > 0 ? [`Priced items subtotal: ${money(cartTotal(lines))}`] : []), ...(hasContactPricing(lines) ? ["Bulk pricing will be shared on WhatsApp."] : []), ...(bulkOrder ? ["", "Bulk Order Payment Terms: A 40% security amount is required to confirm and process bulk orders. The remaining 60% is payable after delivery. Final pricing, delivery timelines and payment details will be confirmed with Cactus Studio before the order is processed."] : []), "", "Please confirm availability, pricing and delivery details.", "Thank you."].join("\n");
}
export const whatsappUrl = (message: string) => `https://wa.me/919966998768?text=${encodeURIComponent(message)}`;