"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowDown, ArrowUpRight, Check, Gift, Leaf, Minus, Plus, ShieldCheck, ShoppingBag } from "lucide-react";
import { defaults, money, priceFor, type Product, type Selection, type Variant } from "@/lib/commerce";
import { useStore } from "./store-provider";

export function QuantitySelector({ value, onChange, max = 999, label = "Quantity" }: { value: number; onChange: (value: number) => void; max?: number; label?: string }) {
  return <div className="quantity-control" role="group" aria-label={label}><button type="button" onClick={() => onChange(Math.max(1, value - 1))} disabled={value <= 1} aria-label={`Decrease ${label.toLowerCase()}`} title="Decrease quantity"><Minus size={15} /></button><span aria-live="polite">{value}</span><button type="button" onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max} aria-label={`Increase ${label.toLowerCase()}`} title="Increase quantity"><Plus size={15} /></button></div>;
}
export function VariantSelector({ variant, value, onChange }: { variant: Variant; value: string; onChange: (value: string) => void }) {
  return <fieldset className="variant-selector"><legend>{variant.label}</legend><div className="variant-options">{variant.options.map(option => <label key={option.value} className={value === option.value ? "variant-option selected" : "variant-option"}><input type="radio" name={variant.id} value={option.value} checked={value === option.value} onChange={() => onChange(option.value)} /><span>{option.label}</span></label>)}</div></fieldset>;
}
export function ProductVisual({ product, priority = false }: { product: Product; priority?: boolean }) {
  const image = priority ? product.detailImage ?? product.images[0] : product.images[0];
  return <div className={`product-visual ${!product.images.length ? "no-photo" : ""}`}>
    {image ? <Image src={image} alt={product.name} fill sizes="(max-width: 700px) 100vw, 50vw" className="product-image" style={{ objectPosition: product.imagePosition ?? "center" }} priority={priority} unoptimized /> : <div className="photo-pending"><span className="small-eyebrow">CACTUS STUDIOS ORIGINALS</span><span className="pending-name">A little tradition.<br />A personal touch.</span><span>Original product photograph awaiting approval</span></div>}
    <span className="image-caption">THOUGHTFULLY MADE, JUST FOR YOU</span>
  </div>;
}
export function ProductDetail({ product, full = false, number = 1, potSize }: { product: Product; full?: boolean; number?: number; potSize?: string }) {
  const [selection, setSelection] = useState<Selection>(() => ({ ...defaults(product), ...(product.variants.some(variant => variant.id === "potSize" && variant.options.some(option => option.value === potSize)) ? { potSize: potSize! } : {}) }));
  const [quantity, setQuantity] = useState(1);
  const [customization, setCustomization] = useState("");
  const [added, setAdded] = useState(false);
  const { add, notify } = useStore();
  const price = priceFor(product, selection);
  function addToCart() {
    try { add(product, selection, quantity, customization); setAdded(true); setTimeout(() => setAdded(false), 2000); }
    catch (error) { notify(error instanceof Error ? error.message : "Unable to add this product."); }
  }
  return <article className={`product-row ${full ? "full-product" : ""}`} aria-label={product.name}>
    <div className="product-info">
      <div className="product-topline"><span className="small-eyebrow">{product.category === "Plants" ? "A GIFT THAT KEEPS GROWING" : product.category === "Candles" ? "POURED WITH A LITTLE LOVE" : "A LITTLE SOMETHING THOUGHTFUL"}</span><span className="product-number">{String(number).padStart(2, "0")}</span></div>
      {full ? <h1>{product.name}</h1> : <h3><Link href={`/products/${product.id}`}>{product.name}<ArrowUpRight size={22} strokeWidth={1.3} /></Link></h3>}
      <p className="product-description">{product.description}</p>
      <p className="product-detail-copy">{product.detail}</p>
      {full && <ul className="product-benefits"><li><Leaf size={15} />{product.category === "Plants" ? "Easy to maintain" : "Made by hand"}</li><li><ShieldCheck size={15} /> Carefully packed</li><li><Gift size={15} /> Perfect for gifting</li></ul>}
      <div className="product-variants">{product.variants.map(variant => <VariantSelector key={variant.id} variant={{ ...variant, id: `${product.id}-${variant.id}` }} value={selection[variant.id]} onChange={value => setSelection(current => ({ ...current, [variant.id]: value }))} />)}</div>
      {product.customizable && <label className="custom-note">Make it personal <span>(optional)</span><textarea rows={2} maxLength={300} placeholder="A gift note or a little customization..." value={customization} onChange={event => setCustomization(event.target.value)} /></label>}
      <div className="quantity-price"><div><span className="field-label">Quantity</span><QuantitySelector value={quantity} onChange={setQuantity} /></div><div className="product-price"><span>{money(price)}</span><small>{quantity > 1 ? `${money(price * quantity)} for ${quantity}` : "per piece / selected pack"}</small></div></div>
      <button className={`button primary add-button ${added ? "is-added" : ""}`} disabled={!product.available} onClick={addToCart} aria-label={`Add ${product.name} to cart`}><span className="desktop-add-copy">{added ? "Added to your bag" : "Add to Cart"}</span><span className="mobile-add-copy">{added ? "Added" : "Add to bag"}</span>{added ? <Check size={18} /> : <Plus size={19} />}</button>
      <div className="product-footnote"><Leaf size={13} /><span>Handmade with care. Naturally a little unique.</span></div>
    </div>
    <ProductVisual product={product} priority={full} />
  </article>;
}
export function ProductCard({ product, potSize }: { product: Product; potSize?: string; number?: number }) {
  const selection = { ...defaults(product), ...(potSize && product.variants.some(variant => variant.id === "potSize") ? { potSize } : {}) };
  const href = `/products/${product.id}${potSize ? `?potSize=${potSize}` : ""}`;
  return <article className="catalogue-card" aria-label={product.name}>
    <Link href={href} className="catalogue-card-image" aria-label={`View ${product.name}`}><ProductVisual product={product} /></Link>
    <div className="catalogue-card-info"><h3><Link href={href}>{product.name}</Link></h3><p>{potSize ? `${potSize} inch pot` : "From"} <strong>{money(priceFor(product, selection))}</strong></p><Link className="button primary" href={href}>Choose options <Plus size={14} /></Link></div>
  </article>;
}
export function CollectionEmpty({ query }: { query: string }) {
  return <div className="empty-state"><ShoppingBag size={40} strokeWidth={1} /><h3>No little treasures found</h3><p>We couldn&apos;t find a match for &ldquo;{query}&rdquo;.</p><Link className="button primary" href="/#collection">Explore the collection <ArrowDown size={16} /></Link></div>;
}