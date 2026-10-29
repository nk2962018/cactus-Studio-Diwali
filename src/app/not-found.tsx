import Link from "next/link";
import { ArrowLeft, Leaf } from "lucide-react";

export default function NotFound() { return <div className="empty-state page-width"><Leaf size={40} strokeWidth={1} /><span className="small-eyebrow">A LITTLE OFF THE GARDEN PATH</span><h1>This page hasn&apos;t taken root.</h1><p>Let&apos;s find you something thoughtful instead.</p><Link className="button primary" href="/"><ArrowLeft size={16} /> Back to the studio</Link></div>; }