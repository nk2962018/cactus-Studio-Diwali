"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, LoaderCircle, MessageCircle, ShieldCheck } from "lucide-react";
import { emptyDelivery, hasContactPricing, orderMessage, validateDelivery, whatsappUrl, type DeliveryDetails } from "@/lib/commerce";
import { useStore } from "./store-provider";
import { CartItem, EmptyCart, OrderSummary } from "./cart";
import { getProduct } from "@/data/catalogue";

export function WhatsAppOrderButton({ onClick }: { onClick: () => void }) {
  return <button className="button primary whatsapp-button" onClick={onClick}><MessageCircle size={19} /> Place Order on WhatsApp <ArrowRight size={16} /></button>;
}
export function Checkout() {
  const { lines, ready } = useStore();
  const [details, setDetails] = useState<DeliveryDetails>(emptyDelivery);
  const [error, setError] = useState("");
  const [opened, setOpened] = useState(false);
  if (!ready) return <div className="loading-state"><LoaderCircle className="spin" /> Getting your order ready...</div>;
  if (!lines.length) return <EmptyCart />;
  function placeOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const invalid = validateDelivery(details);
    if (invalid) { setError(invalid); return; }
    try {
      const message = orderMessage(details, lines);
      window.open(whatsappUrl(message), "_blank", "noopener,noreferrer");
      setOpened(true);
    } catch (issue) { setError(issue instanceof Error ? issue.message : "Please check your details and order quantities."); }
  }
  function field(key: keyof DeliveryDetails, label: string, autoComplete: string, required = false, placeholder = "") {
    const shared = { id: `delivery-${key}`, name: key, autoComplete, required, maxLength: key === "pincode" ? 6 : key === "instructions" ? 500 : 500, value: details[key], placeholder, onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setDetails(current => ({ ...current, [key]: event.target.value })) };
    return <label className={`form-field ${key === "address" || key === "address2" || key === "instructions" ? "span-two" : ""}`} htmlFor={shared.id}>{label}{!required && <span className="optional">Optional</span>}{key === "address" || key === "instructions" ? <textarea {...shared} rows={key === "address" ? 3 : 2} minLength={key === "address" && required ? 8 : undefined} /> : <input {...shared} type={key === "email" ? "email" : key === "phone" ? "tel" : "text"} inputMode={key === "phone" || key === "pincode" ? "numeric" : undefined} minLength={key === "name" ? 2 : undefined} pattern={key === "phone" ? "(?:\\+?91[ -]?)?[6-9][0-9]{9}" : key === "pincode" ? "[1-9][0-9]{5}" : undefined} />}</label>;
  }
  return <div className="page-width commerce-page checkout-page guest-checkout">
    <Link className="back-link" href="/cart"><ArrowLeft size={15} /> Back to your order</Link>
    <div className="page-title"><span className="small-eyebrow">NO ACCOUNT NEEDED</span><h1>Your order details</h1><p>Share where to send your order. We&apos;ll confirm availability, pricing and delivery on WhatsApp.</p></div>
    {opened && <div className="notice order-opened" role="status"><CheckCircle2 size={18} /><span>WhatsApp opened with your order. Review the message and send it to place your request. Your order is not confirmed until the studio replies.</span></div>}
    <div className="commerce-grid"><section className="delivery-panel"><h2>Delivery details</h2><form className="address-form guest-order-form" onSubmit={placeOrder} noValidate>
      <div className="form-grid">{field("name", "Full name", "name", true, "Your full name")}{field("phone", "Phone number", "tel", true, "+91 98765 43210")}{field("email", "Email address", "email", false, "you@example.com")}{field("pincode", "Pincode", "postal-code", false, "6-digit pincode")}{field("address", "Delivery address", "street-address", true, "House / flat, street, locality")}{field("address2", "Address line 2", "street-address", false, "Area, locality")}{field("landmark", "Landmark", "off", false, "Nearby landmark")}{field("instructions", "Special instructions", "off", false, "Anything else we should know?")}</div>
      {error && <p className="form-error" role="alert">{error}</p>}
      <button type="submit" className="button primary"><MessageCircle size={18} /> Place Order on WhatsApp <ArrowRight size={16} /></button>
      <p className="whatsapp-note"><ShieldCheck size={15} /> This opens WhatsApp with your order prepared. You review and send it yourself.</p>
    </form></section>
    <div className="checkout-review"><section className="review-panel"><div className="review-products-heading"><h2>Review Order</h2><Link className="text-link" href="/cart">Edit order <ArrowRight size={14} /></Link></div><div>{lines.map(line => <CartItem key={line.key} line={line} readonly />)}</div>{hasContactPricing(lines) && <p className="notice">Bulk pricing will be shared on WhatsApp.</p>}{lines.some(line => line.bulkOnly || line.quantity >= 50) && <p className="notice bulk-terms">Bulk Order Payment Terms: A 40% security amount is required to confirm and process bulk orders. The remaining 60% is payable after delivery. Final pricing, delivery timelines and payment details will be confirmed with Cactus Studio before the order is processed.</p>}{lines.some(line => getProduct(line.productId)?.disclaimer) && <p className="notice">Colors, patterns and finishes may vary slightly from the images due to handmade production and material availability.</p>}</section><OrderSummary /></div>
    </div>
  </div>;
}