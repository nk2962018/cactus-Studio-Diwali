"use client";

import Image from "next/image";
import Link from "next/link";
import { useDeferredValue, useState } from "react";
import { ArrowRight, ArrowUpRight, Flower2, Gift, HandHeart, Leaf, PackageCheck, Search, ShieldCheck, SlidersHorizontal, X } from "lucide-react";
import { bulkImage, categories, heroImage, products } from "@/data/catalogue";
import { CollectionEmpty, ProductCard } from "./product";

function BulkGiftingBanner() {
  return <section className="bulk-band"><div className="page-width"><div><span className="small-eyebrow">BULK & CORPORATE GIFTING</span><h2>Custom Gifting for<br />Every Occasion</h2><p>Corporate, weddings, return gifts<br />and more.</p><Link className="button primary" href="/bulk-orders">Enquire Now <ArrowRight size={17} /></Link></div><div className="bulk-photo"><Image src={bulkImage} alt="Natural kraft gift boxes for bulk gifting" fill sizes="(max-width: 700px) 45vw, 40vw" unoptimized /></div></div></section>;
}

export function Catalogue({ initialCategory, initialSearch = "" }: { initialCategory?: string; initialSearch?: string }) {
  const [category, setCategory] = useState(categories.some(item => item.name === initialCategory && item.name !== "Bulk Orders") ? initialCategory ?? "Plants" : "Plants");
  const [query, setQuery] = useState(initialSearch);
  const [sort, setSort] = useState("curated");
  const [plantIds, setPlantIds] = useState<string[]>([]);
  const [potSize, setPotSize] = useState("");
  const deferredQuery = useDeferredValue(query);
  const filtered = products.filter(product => (deferredQuery ? `${product.name} ${product.category} ${product.description}`.toLowerCase().includes(deferredQuery.toLowerCase()) : product.category === category) && (!plantIds.length || category !== "Plants" || !!deferredQuery || plantIds.includes(product.id)));
  if (sort === "low") filtered.sort((first, second) => first.basePrice - second.basePrice);
  if (sort === "high") filtered.sort((first, second) => second.basePrice - first.basePrice);
  function chooseCategory(name: string) { setCategory(name); setQuery(""); setPlantIds([]); setPotSize(""); }
  return <>
    {!initialCategory && !initialSearch && <>
    <section className="hero">
      <Image src={heroImage} alt="Cactus Studios plants, handmade candles and Ganesha idol in warm festive light" fill priority sizes="100vw" className="hero-photo" unoptimized />
      <div className="hero-wash" />
      <div className="hero-content page-width"><div className="hero-copy"><span className="eyebrow">HANDMADE. SUSTAINABLE. THOUGHTFUL.</span><h1>Plants, Candles<br />and Gifts for<br />Brighter Days.</h1><p className="hero-description">Handcrafted with love for your home<br />and every occasion.</p><div className="hero-actions"><a className="button primary" href="#collection">Explore Collection <ArrowRight size={17} /></a><Link className="text-link" href="/bulk-orders">Bulk & Corporate Orders <ArrowUpRight size={15} /></Link></div></div></div>
    </section>
    <div className="values-strip"><div className="page-width"><span><HandHeart size={24} strokeWidth={1.3} /> Handmade<br />with Love</span><span><Leaf size={24} strokeWidth={1.3} /> Eco-friendly<br />& Sustainable</span><span><Gift size={24} strokeWidth={1.3} /> Perfect for<br />Gifting</span><span><ShieldCheck size={24} strokeWidth={1.3} /> Customisation<br />Available</span><span><PackageCheck size={24} strokeWidth={1.3} /> Bulk Orders<br />Welcome</span></div></div>
    <section className="category-section page-width" id="categories"><div className="section-heading"><h2>Shop by Category</h2><a className="text-link" href="#collection">View All <ArrowRight size={14} /></a></div><div className="category-grid">{categories.map((item, index) => <Link key={item.name} href={item.name === "Bulk Orders" ? "/bulk-orders" : `/?category=${encodeURIComponent(item.name)}#collection`} className="category-tile" onClick={() => { if (item.name !== "Bulk Orders") chooseCategory(item.name); }}><div className={`category-image category-image-${index}`}>{item.image ? <Image src={item.image} alt={item.name === "Bulk Orders" ? "Thoughtfully wrapped gifts" : item.name} fill sizes="(max-width: 600px) 30vw, 16vw" unoptimized /> : <div className="category-diy"><Flower2 size={38} strokeWidth={1} /><span>Paint. Create.<br />Celebrate.</span></div>}</div><h3>{item.name}</h3><p>{item.subtitle}</p></Link>)}</div></section>
    <BulkGiftingBanner />
    </>}
    <section className="collection-section page-width" id="collection"><div className="section-heading"><div><span className="small-eyebrow">HOME / {query ? "SEARCH" : category.toUpperCase()}</span><h2>{query ? "Find your thoughtful gift" : category}</h2><p className="collection-description">{category === "Plants" ? "Bring home greenery, positivity and a fresh start — or gift a little green to someone special." : "Handmade favourites for thoughtful celebrations."}</p></div></div>
      <div className="collection-toolbar"><div className="category-tabs" role="tablist" aria-label="Product categories">{categories.map(item => item.name === "Bulk Orders" ? <Link key={item.name} href="/bulk-orders">Bulk Orders <ArrowUpRight size={12} /></Link> : <button role="tab" key={item.name} aria-selected={!query && category === item.name} className={!query && category === item.name ? "active" : ""} onClick={() => chooseCategory(item.name)}>{item.name}</button>)}</div><div className="sort-control"><SlidersHorizontal size={14} /><select aria-label="Sort products" value={sort} onChange={event => setSort(event.target.value)}><option value="curated">Studio picks</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option></select></div></div>
      <div className="collection-meta"><span>{query ? `Results for “${deferredQuery}”` : category === "Plants" ? "Rooted in love. Ready to gift." : categories.find(item => item.name === category)?.subtitle} <span className="result-count">/ {filtered.length} little treasures</span></span><label className="collection-search"><Search size={15} /><input aria-label="Filter collection" placeholder="Find your gift" value={query} onChange={event => setQuery(event.target.value)} />{query && <button aria-label="Clear search" onClick={() => setQuery("")}><X size={14} /></button>}</label></div>
      <div className={`catalogue-layout ${category !== "Plants" || query ? "without-filters" : ""}`}>
        {category === "Plants" && !query && <aside className="catalogue-filters"><fieldset><legend>Plant Type</legend>{products.filter(product => product.category === "Plants").map(product => <label key={product.id}><input type="checkbox" checked={plantIds.includes(product.id)} onChange={event => setPlantIds(current => event.target.checked ? [...current, product.id] : current.filter(id => id !== product.id))} />{product.name}</label>)}</fieldset><fieldset><legend>Pot Size</legend>{["2", "3", "4"].map(size => <label key={size}><input type="radio" name="filter-pot" value={size} checked={potSize === size} onChange={() => setPotSize(size)} />{size} inch</label>)}</fieldset>{(plantIds.length > 0 || potSize) && <button className="text-link" onClick={() => { setPlantIds([]); setPotSize(""); }}>Clear filters <X size={12} /></button>}</aside>}
        <div className="catalogue-grid">{filtered.length ? filtered.map(product => <ProductCard key={product.id} product={product} potSize={category === "Plants" && !query ? potSize : undefined} />) : <CollectionEmpty query={query} />}</div>
      </div>
    </section>
    {(initialCategory || initialSearch) && <BulkGiftingBanner />}
  </>;
}