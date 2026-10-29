"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { ArrowLeft, ArrowRight, Leaf, ShoppingBag, Trash2, X } from "lucide-react";
import { cartTotal, money, type CartLine } from "@/lib/commerce";
import { useStore } from "./store-provider";
import { QuantitySelector } from "./product";
import { getProduct } from "@/data/catalogue";

export function CartItem({ line, readonly = false }: { line: CartLine; readonly?: boolean }) {
  const { remove, updateQuantity } = useStore();
  const product = getProduct(line.productId);
  const image = product?.cartImage ?? product?.images[0] ?? "";
  return <article className="cart-item"><Link href={`/products/${line.productId}`} className="cart-item-image" aria-label={`View ${line.name}`}>{image ? <Image src={image} alt={line.name} fill sizes="100px" unoptimized /> : <Leaf size={28} strokeWidth={1} />}</Link><div className="cart-item-main"><Link href={`/products/${line.productId}`} className="cart-item-name">{line.name}</Link><div className="cart-variants">{Object.entries(line.variantLabels).map(([label, value]) => <span key={label}>{label}: {value}</span>)}</div>{line.customization && <p className="cart-customization">Note: {line.customization}</p>}<span className="unit-price">{money(line.unitPrice)} each</span>{readonly ? <span className="review-quantity">Quantity: {line.quantity}</span> : <QuantitySelector label={`quantity of ${line.name}`} value={line.quantity} onChange={quantity => updateQuantity(line.key, quantity)} />}</div><div className="cart-item-end"><strong>{money(line.unitPrice * line.quantity)}</strong>{!readonly && <button className="icon-button remove-button" title="Remove item" aria-label={`Remove ${line.name}`} onClick={() => remove(line.key)}><Trash2 size={16} strokeWidth={1.4} /></button>}</div></article>;
}
export function OrderSummary({ children }: { children?: React.ReactNode }) {
  const { lines } = useStore();
  const subtotal = cartTotal(lines);
  return <aside className="order-summary"><span className="small-eyebrow">A LITTLE HAPPINESS, ALL TOGETHER</span><h2>Order summary</h2><dl><div><dt>Subtotal</dt><dd>{money(subtotal)}</dd></div><div className="delivery-summary"><dt>Delivery</dt><dd>Confirmed separately</dd></div><div className="summary-total"><dt>Total <small>excluding delivery</small></dt><dd>{money(subtotal)}</dd></div></dl><p className="summary-note">We&apos;ll confirm availability and delivery charges with you before payment. No payment is collected here.</p>{children}<div className="summary-footnote"><Leaf size={15} /> A thoughtful gift, a personal conversation.</div></aside>;
}
export function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { lines } = useStore();
  const dialog = useRef<HTMLDialogElement>(null);
  const count = lines.reduce((total, line) => total + line.quantity, 0);
  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    if (!open) { element.close(); return; }
    element.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; element.close(); };
  }, [open]);
  return <dialog ref={dialog} className="cart-drawer" aria-labelledby="cart-drawer-title" onCancel={event => { event.preventDefault(); onClose(); }} onKeyDown={event => { if (event.key === "Escape") { event.preventDefault(); onClose(); } }} onClick={event => { if (event.target === event.currentTarget) onClose(); }}>
    <div className="cart-drawer-content"><div className="cart-drawer-heading"><h2 id="cart-drawer-title">Your Cart ({count})</h2><button className="icon-button" onClick={onClose} aria-label="Close cart" title="Close cart"><X size={20} /></button></div>
      {lines.length ? <><div className="cart-drawer-items">{lines.map(line => <CartItem key={line.key} line={line} />)}</div><OrderSummary><Link className="button primary" href="/checkout" onClick={onClose}>Proceed to Order <ArrowRight size={17} /></Link><Link className="text-link" href="/cart" onClick={onClose}>View full cart <ArrowRight size={14} /></Link></OrderSummary></> : <div className="drawer-empty"><ShoppingBag size={40} strokeWidth={1} /><h3>Your cart is empty</h3><p>A little green or a little glow?</p><Link className="button primary" href="/#collection" onClick={onClose}>Explore Collection <ArrowRight size={16} /></Link></div>}
    </div>
  </dialog>;
}
export function EmptyCart() {
  return <div className="empty-state"><div className="empty-bag"><ShoppingBag size={45} strokeWidth={1} /><Leaf size={20} /></div><span className="small-eyebrow">A LITTLE ROOM FOR SOMETHING LOVELY</span><h1>Your bag is taking a breather.</h1><p>Fill it with a little green, a little glow,<br />or something made just for them.</p><Link className="button primary" href="/#collection">Explore the collection <ArrowUpRightIcon /></Link></div>;
}
function ArrowUpRightIcon() { return <ArrowRight size={17} />; }
export function Cart() {
  const { lines, ready } = useStore();
  if (!ready) return <div className="loading-state">Opening your little bag...</div>;
  if (!lines.length) return <EmptyCart />;
  return <div className="page-width commerce-page"><Link className="back-link" href="/#collection"><ArrowLeft size={15} /> Keep exploring</Link><div className="page-title"><span className="small-eyebrow">THOUGHTFUL THINGS, TOGETHER</span><h1>Your little bag<span className="title-count">({lines.reduce((total, line) => total + line.quantity, 0)})</span></h1><p>A little green. A little glow. Ready to make someone&apos;s day.</p></div><div className="commerce-grid"><div className="cart-items">{lines.map(line => <CartItem key={line.key} line={line} />)}<Link className="text-link continue-link" href="/#collection"><ArrowLeft size={15} /> A little more browsing</Link></div><OrderSummary><Link className="button primary" href="/checkout">Proceed to Order <ArrowRight size={17} /></Link></OrderSummary></div></div>;
}