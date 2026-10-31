"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowDown, ArrowUpRight, Check, Gift, Leaf, Minus, Plus, ShieldCheck, ShoppingBag } from "lucide-react";
import { defaults, money, priceFor, validOrderQuantity, type Product, type Selection, type Variant } from "@/lib/commerce";
import { useStore } from "./store-provider";

export function QuantitySelector({ value, onChange, min = 1, max = 9999, step = 1, label = "Quantity" }: { value: number; onChange: (value: number) => void; min?: number; max?: number; step?: number; label?: string }) {
  return <div className="quantity-control" role="group" aria-label={label}><button type="button" onClick={() => onChange(Math.max(min, value - step))} disabled={value <= min} aria-label={`Decrease ${label.toLowerCase()}`} title="Decrease quantity"><Minus size={15} /></button><span aria-live="polite">{value}</span><button type="button" onClick={() => onChange(Math.min(max, value + step))} disabled={value >= max} aria-label={`Increase ${label.toLowerCase()}`} title="Increase quantity"><Plus size={15} /></button></div>;
}
export function VariantSelector({ variant, value, onChange }: { variant: Variant; value: string; onChange: (value: string) => void }) {
  return <fieldset className="variant-selector"><legend>{variant.label}</legend><div className="variant-options">{variant.options.map(option => <label key={option.value} className={value === option.value ? "variant-option selected" : "variant-option"}><input type="radio" name={variant.id} value={option.value} checked={value === option.value} onChange={() => onChange(option.value)} /><span>{option.label}</span></label>)}</div></fieldset>;
}
export function ProductVisual({ product, priority = false, imageIndex = 0, onSelectImage }: { product: Product; priority?: boolean; imageIndex?: number; onSelectImage?: (index: number) => void }) {
  const images = (priority ? [product.detailImage, ...product.images] : product.images).filter((image): image is string => !!image).filter((image, index, list) => list.indexOf(image) === index);
  const image = images[imageIndex] ?? images[0];
  return <div className={`product-visual ${!product.images.length ? "no-photo" : ""}`}>
    {image ? <Image src={image} alt={product.name} fill sizes="(max-width: 700px) 100vw, 50vw" className="product-image" style={{ objectPosition: product.imagePosition ?? "center" }} priority={priority} unoptimized /> : <div className="photo-pending"><span className="small-eyebrow">CACTUS STUDIOS ORIGINALS</span><span className="pending-name">A little tradition.<br />A personal touch.</span><span>Original product photograph awaiting approval</span></div>}
    {priority && images.length > 1 && onSelectImage && <div className="product-gallery-thumbnails" aria-label={`${product.name} photos`}>{images.map((thumbnail, index) => <button key={thumbnail} type="button" className={index === imageIndex ? "product-gallery-thumb selected" : "product-gallery-thumb"} aria-label={`View ${product.name} photo ${index + 1}`} aria-pressed={index === imageIndex} onClick={() => onSelectImage(index)}><Image src={thumbnail} alt="" fill sizes="64px" unoptimized /></button>)}</div>}
    <span className="image-caption">THOUGHTFULLY MADE, JUST FOR YOU</span>
  </div>;
}
function CollectionQuantityPicker({ productId, value, quantity, onSelect, onQuantityChange }: { productId: string; value: "6" | "12" | "custom" | "bulk"; quantity: number; onSelect: (value: "6" | "12" | "custom" | "bulk") => void; onQuantityChange: (quantity: number) => void }) {
  const options = [{ id: "6", label: "6 pieces" }, { id: "12", label: "12 pieces" }, { id: "custom", label: "Custom (24+)" }, { id: "bulk", label: "Bulk (50+)" }] as const;
  return <fieldset className="variant-selector collection-picker"><legend>Collection quantity</legend><div className="variant-options">{options.map(option => <label key={option.id} className={value === option.id ? "variant-option selected" : "variant-option"}><input type="radio" name={`${productId}-collection`} value={option.id} checked={value === option.id} onChange={() => { onSelect(option.id); onQuantityChange(option.id === "6" ? 6 : option.id === "12" ? 12 : option.id === "bulk" ? 50 : 24); }} /><span>{option.label}</span></label>)}</div>{(value === "custom" || value === "bulk") && <label className="custom-quantity">{value === "custom" ? "Custom quantity (minimum 24)" : "Bulk quantity (minimum 50)"}<input type="number" min={value === "custom" ? 24 : 50} max={9999} step={1} value={quantity} onChange={event => onQuantityChange(Number(event.target.value))} /></label>}</fieldset>;
}
function productPriceLabel(product: Product, selection: Selection, quantity: number) {
  if (product.pricingType === "contact") return "Bulk pricing will be shared on WhatsApp";
  if (product.pricingType === "collection") {
    const price = product.collectionPrices?.[quantity];
    return price === undefined ? "Price confirmed on WhatsApp" : `${money(price)} collection price`;
  }
  return money(priceFor(product, selection));
}
export function ProductDetail({ product, full = false, number = 1, potSize }: { product: Product; full?: boolean; number?: number; potSize?: string }) {
  const [selection, setSelection] = useState<Selection>(() => ({ ...defaults(product), ...(product.variants.some(variant => variant.id === "potSize" && variant.options.some(option => option.value === potSize)) ? { potSize: potSize! } : {}) }));
  const [collectionOption, setCollectionOption] = useState<"6" | "12" | "custom" | "bulk">("6");
  const [quantity, setQuantity] = useState(product.bulkOnly ? product.minimumQuantity ?? 50 : product.pricingType === "collection" ? 6 : 1);
  const [imageIndex, setImageIndex] = useState(0);
  const [customization, setCustomization] = useState("");
  const [added, setAdded] = useState(false);
  const { add, notify } = useStore();
  const validQuantity = validOrderQuantity(product, quantity) && (product.pricingType !== "collection" || collectionOption !== "bulk" || quantity >= 50);
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
      {full && <ul className="product-benefits"><li><Leaf size={15} />{product.bulkOnly ? "Plants available exclusively for bulk orders" : "Made by hand"}</li><li><ShieldCheck size={15} /> Carefully packed</li><li><Gift size={15} /> Perfect for gifting</li></ul>}
      {product.disclaimer && <p className="product-disclaimer">{product.disclaimer}</p>}
      <div className="product-variants">{product.variants.map(variant => <VariantSelector key={variant.id} variant={{ ...variant, id: `${product.id}-${variant.id}` }} value={selection[variant.id]} onChange={value => setSelection(current => ({ ...current, [variant.id]: value }))} />)}{product.pricingType === "collection" && <CollectionQuantityPicker productId={product.id} value={collectionOption} quantity={quantity} onSelect={setCollectionOption} onQuantityChange={setQuantity} />}</div>
      {product.customizable && <label className="custom-note">Make it personal <span>(optional)</span><textarea rows={2} maxLength={300} placeholder="A gift note or a little customization..." value={customization} onChange={event => setCustomization(event.target.value)} /></label>}
      <div className="quantity-price"><div><span className="field-label">{product.pricingType === "collection" ? "Selected quantity" : "Quantity"}</span>{product.pricingType === "collection" ? <strong className="selected-quantity">{quantity} pieces</strong> : <QuantitySelector min={product.minimumQuantity ?? 1} value={quantity} onChange={setQuantity} />}</div><div className="product-price"><span>{productPriceLabel(product, selection, quantity)}</span><small>{product.bulkOnly ? `Minimum order: ${product.minimumQuantity ?? 50} plants` : product.pricingType === "collection" ? "Custom quantities of 24+ are confirmed on WhatsApp" : "Per item"}</small></div></div>
      {!validQuantity && <p className="form-error" role="alert">{product.bulkOnly ? "Plants are available for bulk orders only. Minimum order quantity is 50." : collectionOption === "bulk" ? "Bulk orders start at 50 pieces." : "Custom quantities must be 24 pieces or more."}</p>}
      {product.bulkOnly && <p className="bulk-short-terms">40% security amount required to confirm bulk orders. Remaining 60% payable after delivery.</p>}
      <button className={`button primary add-button ${added ? "is-added" : ""}`} disabled={!product.available || !validQuantity} onClick={addToCart} aria-label={`${product.bulkOnly ? "Request bulk order for" : "Add"} ${product.name} to order`}><span className="desktop-add-copy">{added ? "Added to your order" : product.bulkOnly ? "Request Bulk Order" : "Add to Order"}</span><span className="mobile-add-copy">{added ? "Added" : "+"}</span>{added ? <Check size={18} /> : <Plus size={19} />}</button>
      <div className="product-footnote"><Leaf size={13} /><span>Handmade with care. Naturally a little unique.</span></div>
    </div>
    <ProductVisual product={product} priority={full} imageIndex={imageIndex} onSelectImage={full ? setImageIndex : undefined} />
  </article>;
}
export function ProductCard({ product, potSize }: { product: Product; potSize?: string; number?: number }) {
  const selectionDefaults = { ...defaults(product), ...(potSize && product.variants.some(variant => variant.id === "potSize") ? { potSize } : {}) };
  const [selection, setSelection] = useState<Selection>(selectionDefaults);
  const [collectionOption, setCollectionOption] = useState<"6" | "12" | "custom" | "bulk">("6");
  const [quantity, setQuantity] = useState(product.bulkOnly ? product.minimumQuantity ?? 50 : product.pricingType === "collection" ? 6 : 1);
  const [added, setAdded] = useState(false);
  const { add, notify } = useStore();
  const href = `/products/${product.id}${potSize ? `?potSize=${potSize}` : ""}`;
  const validQuantity = validOrderQuantity(product, quantity) && (product.pricingType !== "collection" || collectionOption !== "bulk" || quantity >= 50);
  function addToOrder() {
    try { add(product, selection, quantity); setAdded(true); setTimeout(() => setAdded(false), 1800); }
    catch (error) { notify(error instanceof Error ? error.message : "Unable to add this product."); }
  }
  return <article className="catalogue-card" aria-label={product.name}>
    <Link href={href} className="catalogue-card-image" aria-label={`View ${product.name}`}><ProductVisual product={product} /></Link>
    <div className="catalogue-card-info"><h3><Link href={href}>{product.name}</Link></h3><p>{product.description}</p>
      {product.bulkOnly && <p className="card-order-note">Available sizes: {product.availableSizes?.join(", ")}<br /><strong>Plants are available exclusively for bulk orders.</strong><br />Minimum order: {product.minimumQuantity ?? 50} plants</p>}
      {product.pricingType === "collection" && <p className="card-collection-note">Collections of 6 or 12; custom quantities 24+; bulk 50+.<br />{productPriceLabel(product, selection, quantity)}</p>}
      {!product.bulkOnly && product.pricingType === "fixed" && <p className="card-price">{productPriceLabel(product, selection, quantity)}</p>}
      {product.variants.map(variant => <VariantSelector key={variant.id} variant={{ ...variant, id: `${product.id}-card-${variant.id}` }} value={selection[variant.id]} onChange={value => setSelection(current => ({ ...current, [variant.id]: value }))} />)}
      {product.pricingType === "collection" && <CollectionQuantityPicker productId={`${product.id}-card`} value={collectionOption} quantity={quantity} onSelect={setCollectionOption} onQuantityChange={setQuantity} />}
      {product.disclaimer && <p className="product-disclaimer">{product.disclaimer}</p>}
      {!validQuantity && <p className="form-error" role="alert">{product.bulkOnly ? "Plants are available for bulk orders only. Minimum order quantity is 50." : collectionOption === "bulk" ? "Bulk orders start at 50 pieces." : "Custom quantities must be 24 pieces or more."}</p>}
      {product.bulkOnly && <p className="bulk-short-terms">40% security amount required to confirm bulk orders. Remaining 60% payable after delivery.</p>}
      <button className={`button primary ${added ? "is-added" : ""}`} type="button" onClick={addToOrder} disabled={!product.available || !validQuantity}>{product.bulkOnly ? "Request Bulk Order" : added ? "Added to Order" : "Add to Order"} {added ? <Check size={14} /> : <Plus size={14} />}</button>
    </div>
  </article>;
}
export function CollectionEmpty({ query }: { query: string }) {
  return <div className="empty-state"><ShoppingBag size={40} strokeWidth={1} /><h3>No little treasures found</h3><p>We couldn&apos;t find a match for &ldquo;{query}&rdquo;.</p><Link className="button primary" href="/#collection">Explore the collection <ArrowDown size={16} /></Link></div>;
}