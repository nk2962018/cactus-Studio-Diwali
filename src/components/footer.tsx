import Link from "next/link";
import { ArrowUpRight, Leaf } from "lucide-react";

export function Footer() {
  return <footer className="site-footer"><div className="footer-main page-width"><div><Link href="/" className="footer-brand">cactus studios<span>Little things. Thoughtfully made.</span></Link><p>Handmade gifts for a warmer, greener celebration.</p></div><div className="footer-links"><Link href="/?category=Plants#collection">The collection <ArrowUpRight size={15} /></Link><Link href="/bulk-orders">Bulk & corporate gifting <ArrowUpRight size={15} /></Link><Link href="/account">Your account <ArrowUpRight size={15} /></Link><a href="mailto:hello@cactusstudios.in">Say hello <ArrowUpRight size={15} /></a></div></div><div className="footer-bottom page-width"><span>© {new Date().getFullYear()} Cactus Studios</span><span><Leaf size={13} /> Rooted in thoughtfulness. Made in India.</span><Link href="/care">Gifting & care</Link></div></footer>;
}