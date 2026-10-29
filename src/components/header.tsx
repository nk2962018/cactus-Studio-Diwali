"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowRight, Leaf, Menu, Search, ShoppingCart, UserRound, X } from "lucide-react";
import { categories } from "@/data/catalogue";
import { useStore } from "./store-provider";
import { CartDrawer } from "./cart";

export function Header() {
  const { lines, user } = useStore();
  const count = lines.reduce((total, line) => total + line.quantity, 0);
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState(false);
  const [query, setQuery] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => { setMenu(false); setSearch(false); }, [pathname]);
  useEffect(() => {
    if (search) inputRef.current?.focus();
    const close = (event: KeyboardEvent) => { if (event.key === "Escape") { setSearch(false); setMenu(false); } };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [search]);
  function submit(event: FormEvent) {
    event.preventDefault();
    router.push(`/?search=${encodeURIComponent(query.trim())}#collection`);
    setSearch(false); setMenu(false);
  }
  return <>
    <header className="site-header">
      <div className="header-inner">
        <Link href="/" className="wordmark" aria-label="Cactus Studios home"><Leaf className="brand-leaf" size={39} strokeWidth={1} /><span>Cactus Studios<small>Plants | Decor | Handmade Gifts</small></span></Link>
        <nav className="desktop-nav" aria-label="Main navigation">{categories.map(category => <Link key={category.name} href={category.name === "Bulk Orders" ? "/bulk-orders" : `/?category=${encodeURIComponent(category.name)}#collection`}>{category.name}</Link>)}</nav>
        <div className="header-actions">
          <button className="icon-button desktop-action" title="Search products" aria-label="Search products" aria-expanded={search} onClick={() => { setSearch(!search); setMenu(false); }}><Search size={20} strokeWidth={1.5} /></button>
          <button className="icon-button bag-button" onClick={() => setCartOpen(true)} aria-label={`Shopping cart, ${count} items`} aria-haspopup="dialog" title="Shopping cart"><ShoppingCart size={21} strokeWidth={1.5} /><span className="cart-count">{count}</span></button>
          <Link className="button primary login-link desktop-action" href="/account">{user ? <><UserRound size={15} /> Account</> : "Login"}</Link>
          <button className="icon-button menu-button" aria-label={menu ? "Close navigation" : "Open navigation"} aria-expanded={menu} aria-controls="mobile-menu" onClick={() => { setMenu(!menu); setSearch(false); }}>{menu ? <X size={23} /> : <Menu size={23} />}</button>
        </div>
      </div>
      {search && <form className="header-search" onSubmit={submit}><Search size={20} /><input ref={inputRef} aria-label="Search catalogue" placeholder="Find a little something thoughtful..." value={query} onChange={event => setQuery(event.target.value)} /><button className="icon-button" type="submit" aria-label="Submit search"><ArrowRight size={20} /></button><button className="icon-button" type="button" aria-label="Close search" onClick={() => setSearch(false)}><X size={18} /></button></form>}
      {menu && <nav className="mobile-nav" id="mobile-menu" aria-label="Mobile navigation">
        <form className="mobile-search" onSubmit={submit}><Search size={18} /><input aria-label="Search catalogue" placeholder="Search the collection" value={query} onChange={event => setQuery(event.target.value)} /><button className="icon-button" type="submit" aria-label="Submit search"><ArrowRight size={18} /></button></form>
        {categories.map(category => <Link key={category.name} href={category.name === "Bulk Orders" ? "/bulk-orders" : `/?category=${encodeURIComponent(category.name)}#collection`} onClick={() => setMenu(false)}>{category.name}<ArrowRight size={16} /></Link>)}
        <Link href="/account" onClick={() => setMenu(false)}><span><UserRound size={17} /> {user ? "Your account" : "Login / Account"}</span><ArrowRight size={16} /></Link>
      </nav>}
    </header>
    <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
  </>;
}