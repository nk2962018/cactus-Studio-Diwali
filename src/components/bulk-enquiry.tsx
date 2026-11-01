"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import { ArrowRight, CheckCircle2, HandHeart, MessageCircle, ShieldCheck } from "lucide-react";
import { bulkImage, categories } from "@/data/catalogue";
import { whatsappUrl } from "@/lib/commerce";

const minimumBulkCategory = (category: string) => ["Plants", "Candles", "Tealights"].includes(category);
const bulkTerms = "Bulk Order Payment Terms: A 40% security amount is required to confirm and process bulk orders. The remaining 60% is payable after delivery. Final pricing, delivery timelines and payment details will be confirmed with Cactus Studio before the order is processed.";

type InitialPlant = { id: string; name: string; minimumQuantity: number };
export function BulkEnquiry({ initialPlant, initialPotSize, initialQuantity }: { initialPlant?: InitialPlant; initialPotSize?: string; initialQuantity?: number }) {
  const [category, setCategory] = useState(initialPlant ? "Plants" : "");
  const [prepared, setPrepared] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const minimum = minimumBulkCategory(category) ? 50 : 1;

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const values = new FormData(event.currentTarget);
    const data = Object.fromEntries([...values.entries()].map(([key, value]) => [key, String(value).trim()]));
    const quantity = Number(data.quantity);
    if (data.name.length < 2 || !/^[6-9]\d{9}$/.test(data.phone) || !Number.isInteger(quantity) || quantity < minimum || !data.occasion) {
      setError(minimum === 50 ? "Please check your details. Plants, candles and tealights require a minimum bulk quantity of 50." : "Please check your name, phone, occasion and quantity.");
      return;
    }
    const text = ["Hello Cactus Studio,", "", "I would like to request a bulk & corporate gifting quote.", "", ...Object.entries({ Name: data.name, Phone: `+91${data.phone}`, Email: data.email || "Not provided", "Company / Organization": data.company || "Not provided", Occasion: data.occasion, "Product / Category": data.category, ...(initialPlant ? { Plant: initialPlant.name, "Pot size": initialPotSize ?? "Please confirm" } : {}), Quantity: data.quantity, Customization: data.customization || "None specified", "Delivery date": data.date, Message: data.message || "None specified" }).map(([label, value]) => `${label}: ${value}`), "", bulkTerms].join("\n");
    setMessage(text);
    setPrepared(true);
    window.open(whatsappUrl(text), "_blank", "noopener,noreferrer");
  }

  const today = new Date().toLocaleDateString("en-CA");
  return <div className="page-width bulk-page">
    <div className="bulk-intro">
      <span className="small-eyebrow">THOUGHTFUL AT EVERY SCALE</span>
      <h1>Bulk & Corporate<br /><em>Gifting.</em></h1>
      <p>For corporate gifting, return gifts and large celebrations, create a custom package for your occasion.</p>
      <div className="bulk-intro-photo"><Image src={bulkImage} alt="Natural kraft gift boxes for a thoughtful celebration" fill sizes="(max-width: 700px) 100vw, 40vw" unoptimized /></div>
      <span className="bulk-personal"><HandHeart size={20} /> Many gifts. The same personal care.</span>
      <div className="bulk-order-options"><h2>Build one order basket</h2><p>Add plants, candles and tealights together, then review everything before sending your WhatsApp request.</p><div>{categories.filter(item => item.name === "Plants" || item.name === "Candles" || item.name === "Tealights").map(item => <Link className="text-link" key={item.name} href={`/?category=${encodeURIComponent(item.name)}#collection`}>{item.name}<ArrowRight size={14} /></Link>)}</div></div>
      <p className="notice bulk-terms"><ShieldCheck size={18} />{bulkTerms}</p>
    </div>
    <section className="bulk-form-panel">
      {prepared ? <div className="bulk-success"><CheckCircle2 size={38} strokeWidth={1.3} /><h2>Your enquiry is ready.</h2><p>Review and send the prepared message in WhatsApp. Your request is received only after you send it.</p><button className="button primary" onClick={() => window.open(whatsappUrl(message), "_blank", "noopener,noreferrer")}><MessageCircle size={17} /> Open WhatsApp again</button><button className="text-link" onClick={() => setPrepared(false)}>Prepare another enquiry <ArrowRight size={16} /></button></div> : <>
        <h2>Let&apos;s make it personal.</h2><p className="muted">Tell us a little about your celebration.</p>
        {initialPlant && <p className="notice">Bulk order for {initialPlant.name}{initialPotSize ? ` · ${initialPotSize} pot` : ""}. Minimum order: {initialPlant.minimumQuantity} plants.</p>}
        <form onSubmit={submit} className="bulk-form">
          <div className="form-grid">
            <label className="form-field">Name<input name="name" autoComplete="name" required minLength={2} maxLength={120} /></label>
            <label className="form-field">Phone<input name="phone" type="tel" autoComplete="tel-national" inputMode="numeric" pattern="[6-9][0-9]{9}" placeholder="10-digit Indian mobile" maxLength={10} required /></label>
            <label className="form-field">Email <span className="optional">Optional</span><input name="email" type="email" autoComplete="email" maxLength={180} /></label>
            <label className="form-field">Company / Organization<span className="optional">Optional</span><input name="company" autoComplete="organization" maxLength={160} /></label>
            <label className="form-field">Occasion<input name="occasion" placeholder="Diwali, team gifting, a celebration..." required maxLength={160} /></label>
            <label className="form-field">Product / category<select name="category" value={category} onChange={event => setCategory(event.target.value)} required><option value="">Select a category</option>{categories.filter(item => item.name !== "Bulk Orders").map(item => <option key={item.name}>{item.name}</option>)}<option>Mixed / custom gifting</option></select></label>
            <label className="form-field">Quantity<input type="number" name="quantity" min={minimum} max={100000} defaultValue={initialQuantity} required placeholder={minimum === 50 ? "Minimum 50" : "Number of gifts"} /><span className="optional">{minimum === 50 ? "Minimum 50 for plants, candles and tealights" : "Minimum 50 for plants, candles and tealights"}</span></label>
            {/* <label className="form-field">Budget per gift<select name="budget" required><option value="">Select a range</option><option>Under ₹500</option><option>₹500 – ₹1,000</option><option>₹1,000 – ₹2,000</option><option>₹2,000 and above</option><option>Let&apos;s discuss</option></select></label> */}
            <label className="form-field span-two">Customization requirements<span className="optional">Optional</span><textarea name="customization" placeholder="Branding, gift notes, colours, a special combination..." maxLength={1000} rows={3} /></label>
            <label className="form-field span-two">Preferred delivery date<input name="date" type="date" required min={today} /></label>
            <label className="form-field span-two">Message<span className="optional">Optional</span><textarea name="message" placeholder="Anything else you would like us to know?" maxLength={1500} rows={3} /></label>
          </div>
          {error && <p className="form-error" role="alert">{error}</p>}
          <p className="notice bulk-terms">{bulkTerms}</p>
          <button className="button primary" type="submit">Request Bulk Quote <ArrowRight size={17} /></button><span className="bulk-method">Your quote request opens in WhatsApp; it is not sent automatically.</span>
        </form>
        <div className="bulk-direct"><span>Prefer a conversation?</span><button className="text-link" onClick={() => window.open(whatsappUrl("Hello Cactus Studio, I would like to discuss bulk and corporate gifting."), "_blank", "noopener,noreferrer")}><MessageCircle size={17} /> WhatsApp for Bulk Orders</button></div>
      </>}
    </section>
  </div>;
}