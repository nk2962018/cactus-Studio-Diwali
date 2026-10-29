export type VariantOption = { value: string; label: string; adjustment: number };
export type Variant = { id: string; label: string; options: VariantOption[] };
export type Category = "Plants" | "Candles" | "Tealights" | "Idols & DIY" | "Curated Gifts";
export type Product = {
  id: string;
  name: string;
  category: Category;
  description: string;
  detail: string;
  images: string[];
  detailImage?: string;
  cartImage?: string;
  basePrice: number;
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
  image: string;
  customization: string;
};
export type DeliveryDetails = {
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
};
export const emptyDelivery: DeliveryDetails = { name: "", phone: "", email: "", address: "", city: "", state: "", pincode: "" };
export const money = (amount: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);
export const defaults = (product: Product): Selection => Object.fromEntries(product.variants.map(variant => [variant.id, variant.options[0].value]));
export function priceFor(product: Product, selection: Selection): number {
  return product.basePrice + product.variants.reduce((total, variant) => {
    const option = variant.options.find(candidate => candidate.value === selection[variant.id]);
    if (!option) throw new Error(`Please select ${variant.label}`);
    return total + option.adjustment;
  }, 0);
}
export function makeLine(product: Product, selection: Selection, quantity: number, customization = ""): CartLine {
  if (!product.available) throw new Error("This product is not available.");
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 999) throw new Error("Quantity must be between 1 and 999.");
  const variants = Object.fromEntries(product.variants.map(variant => [variant.id, selection[variant.id]]));
  const variantLabels = Object.fromEntries(product.variants.map(variant => [variant.label, variant.options.find(option => option.value === selection[variant.id])?.label ?? ""]));
  const note = customization.trim().slice(0, 300);
  return { key: JSON.stringify([product.id, Object.entries(variants).sort(), note]), productId: product.id, name: product.name, variants, variantLabels, quantity, unitPrice: priceFor(product, variants), image: product.cartImage ?? product.images[0] ?? "", customization: note };
}
export function addLine(lines: CartLine[], incoming: CartLine): CartLine[] {
  const existing = lines.find(line => line.key === incoming.key);
  return existing ? lines.map(line => line.key === incoming.key ? { ...line, quantity: Math.min(999, line.quantity + incoming.quantity) } : line) : [...lines, incoming];
}
export const cartTotal = (lines: CartLine[]) => lines.reduce((total, line) => total + line.unitPrice * line.quantity, 0);
export function validateDelivery(details: DeliveryDetails): string | null {
  if (details.name.trim().length < 2) return "Please enter your full name.";
  if (!/^\+[1-9]\d{7,14}$/.test(details.phone)) return "Please login with a valid mobile number.";
  if (details.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(details.email)) return "Please enter a valid email address.";
  if (details.address.trim().length < 8) return "Please enter your complete delivery address.";
  if (!details.city.trim() || !details.state.trim()) return "Please enter your city and state.";
  if (!/^[1-9]\d{5}$/.test(details.pincode)) return "Please enter a valid six-digit Indian pincode.";
  return null;
}
export function orderMessage(details: DeliveryDetails, lines: CartLine[]): string {
  const error = validateDelivery(details);
  if (error) throw new Error(error);
  if (!lines.length) throw new Error("Your bag is empty.");
  return ["Hi Cactus Studios,", "", "I would like to place an order.", "", `Customer: ${details.name}`, `Phone: ${details.phone}`, ...(details.email ? [`Email: ${details.email}`] : []), "", "Delivery Address:", details.address, `${details.city}, ${details.state} - ${details.pincode}`, "", "Order:", ...lines.flatMap((line, index) => ["", `${index + 1}. ${line.name}`, ...Object.entries(line.variantLabels).map(([label, value]) => `${label}: ${value}`), ...(line.customization ? [`Customization: ${line.customization}`] : []), `Quantity: ${line.quantity}`, `Unit price: ${money(line.unitPrice)}`, `Price: ${money(line.unitPrice * line.quantity)}`]), "", `Subtotal: ${money(cartTotal(lines))}`, "Delivery: confirmed separately before payment", `Total (excluding delivery): ${money(cartTotal(lines))}`, "", "Please confirm availability and delivery."].join("\n");
}
export const whatsappUrl = (message: string) => `https://wa.me/919966998768?text=${encodeURIComponent(message)}`;