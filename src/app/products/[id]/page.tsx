import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getProduct, products } from "@/data/catalogue";
import { ProductCard, ProductDetail } from "@/components/product";

export function generateStaticParams() { return products.map(product => ({ id: product.id })); }
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const product = getProduct((await params).id);
  return { title: product?.name ?? "Product not found", description: product?.description };
}
export default async function ProductPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ potSize?: string }> }) {
  const product = getProduct((await params).id);
  if (!product) notFound();
  const { potSize } = await searchParams;
  const related = products.filter(item => item.category === product.category && item.id !== product.id).slice(0, 3);
  return <div className="page-width product-page"><Link className="back-link" href={`/?category=${encodeURIComponent(product.category)}#collection`}><ArrowLeft size={15} /> Home / {product.category} / {product.name}</Link><ProductDetail product={product} full potSize={potSize} />{related.length > 0 && <section className="related-products"><h2>You may also like</h2><div className="catalogue-grid">{related.map(item => <ProductCard key={item.id} product={item} />)}</div></section>}</div>;
}