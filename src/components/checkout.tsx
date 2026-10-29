"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { ArrowLeft, ArrowRight, Check, CheckCircle2, LoaderCircle, MessageCircle, Pencil, ShieldCheck } from "lucide-react";
import { orderMessage, validateDelivery, whatsappUrl } from "@/lib/commerce";
import { useStore } from "./store-provider";
import { AddressForm, Login, useProfile } from "./auth-profile";
import { CartItem, EmptyCart, OrderSummary } from "./cart";

export function WhatsAppOrderButton({ onClick }: { onClick: () => void }) {
  return <button className="button primary whatsapp-button" onClick={onClick}><MessageCircle size={19} /> Order via WhatsApp <ArrowUpRightIcon /></button>;
}
function ArrowUpRightIcon() { return <ArrowRight size={16} />; }
export function Checkout() {
  const { lines, ready, user, authReady } = useStore();
  const { details, setDetails, loading, loadError, save } = useProfile();
  const [stage, setStage] = useState<"details" | "review" | "whatsapp" | "handoff">("details");
  const [saveAddress, setSaveAddress] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [draftMessage, setDraftMessage] = useState("");
  if (!ready || !authReady) return <div className="loading-state"><LoaderCircle className="spin" /> Getting things ready...</div>;
  if (!lines.length) return <EmptyCart />;
  async function review(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const invalid = validateDelivery(details);
    if (invalid) { setError(invalid); return; }
    setBusy(true);
    try {
      if (saveAddress) await save(details);
      setStage("review");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (issue) { setError(issue instanceof Error ? issue.message : "Please check your details."); }
    finally { setBusy(false); }
  }
  function placeOrder() {
    setError("");
    if (!user?.phone) { setError("Please login with your mobile number to continue."); return; }
    try {
      const message = orderMessage(details, lines);
      setDraftMessage(message);
      window.open(whatsappUrl(message), "_blank", "noopener,noreferrer");
      setStage("handoff");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (issue) { setError(issue instanceof Error ? issue.message : "Please check your order details."); }
  }
  const currentStep = !user ? 1 : stage === "details" ? 2 : stage === "review" ? 3 : 4;
  return <div className="page-width commerce-page checkout-page">
    <Link className="back-link" href="/cart"><ArrowLeft size={15} /> Back to your cart</Link>
    <ol className="checkout-steps" aria-label="Order progress">{["Browse & add to cart", "Login with phone", "Delivery details", "Review order", "Order via WhatsApp"].map((step, index) => <li key={step} aria-current={index === currentStep ? "step" : undefined} className={index === currentStep ? "current" : index < currentStep ? "complete" : ""}><span>{index < currentStep ? <Check size={12} /> : index + 1}</span>{step}</li>)}</ol>
    <div className="page-title"><span className="small-eyebrow">THOUGHTFUL GIFTS. SIMPLE MOMENTS.</span><h1>{!user ? "Login to Continue" : stage === "details" ? "Delivery Details" : stage === "review" ? "Review Your Order" : "Order via WhatsApp"}</h1></div>
    <div className="commerce-grid"><div>
      {!user ? <Login checkout /> : loading ? <div className="loading-state"><LoaderCircle className="spin" /> Finding your saved details...</div> : stage === "details" ? <section className="delivery-panel"><h2>Delivery Details</h2>{loadError && <p className="notice" role="alert">{loadError}</p>}{error && <p className="form-error" role="alert">{error}</p>}<AddressForm details={details} onChange={setDetails} onSubmit={review} busy={busy} saveAddress={saveAddress} onSaveAddressChange={setSaveAddress} /></section> : stage === "review" ? <section className="review-panel">
        <div className="review-products-heading"><h2>Your gifts</h2><Link className="text-link" href="/cart"><Pencil size={14} /> Edit cart</Link></div>
        <div>{lines.map(line => <CartItem key={line.key} line={line} readonly />)}</div>
        <div className="review-address"><div><h2>Delivery Address</h2><strong>{details.name}</strong><p>{details.address}<br />{details.city}, {details.state} {details.pincode}</p><p>{details.phone}{details.email && <><br />{details.email}</>}</p></div><button className="text-link" onClick={() => { setStage("details"); setError(""); }}><Pencil size={14} /> Edit</button></div>
        <div className="notice"><ShieldCheck size={18} /> We&apos;ll personally confirm availability, delivery charges and payment details on WhatsApp.</div>
      </section> : <section className="whatsapp-panel">
        {stage === "handoff" ? <CheckCircle2 size={54} strokeWidth={1.4} /> : <MessageCircle size={54} strokeWidth={1.4} />}
        <h2>{stage === "handoff" ? "Your order is ready to send" : "A personal touch, right to the end."}</h2>
        <p>{stage === "handoff" ? "Send the prepared message in WhatsApp. Your order is confirmed only when our studio replies." : "Your order details will be shared on WhatsApp for confirmation."}</p>
        <ul className="handoff-checklist">{["Products with selected variations", "Quantity and total amount", "Delivery address", "Contact details"].map(label => <li key={label}><CheckCircle2 size={17} />{label}</li>)}</ul>
        {error && <p className="form-error" role="alert">{error}</p>}
        {stage === "handoff" ? <button className="button primary" onClick={() => window.open(whatsappUrl(draftMessage), "_blank", "noopener,noreferrer")}><MessageCircle size={18} /> Open WhatsApp again <ArrowRight size={17} /></button> : <WhatsAppOrderButton onClick={placeOrder} />}
        <button className="text-link" onClick={() => setStage("review")}><ArrowLeft size={15} /> Back to order review</button>
      </section>}
    </div><OrderSummary>{user && stage === "review" && <button className="button primary" onClick={() => { setStage("whatsapp"); window.scrollTo({ top: 0, behavior: "smooth" }); }}><MessageCircle size={18} /> Place Order via WhatsApp <ArrowRight size={16} /></button>}</OrderSummary></div>
  </div>;
}