import { BulkEnquiry } from "@/components/bulk-enquiry";
import { getProduct } from "@/data/catalogue";
export const metadata = { title: "Bulk & Corporate Gifting" };
export default async function BulkPage({ searchParams }: { searchParams: Promise<{ productId?: string; potSize?: string; quantity?: string }> }) {
	const params = await searchParams;
	const product = getProduct(params.productId ?? "");
	const plant = product?.bulkOnly ? { id: product.id, name: product.name, minimumQuantity: product.minimumQuantity ?? 50 } : undefined;
	const sizeVariant = product?.variants.find(variant => variant.id === "potSize");
	const potSize = plant ? sizeVariant?.options.find(option => option.value === params.potSize)?.label : undefined;
	const requestedQuantity = Number(params.quantity);
	const quantity = plant && Number.isInteger(requestedQuantity) && requestedQuantity >= plant.minimumQuantity ? requestedQuantity : undefined;
	return <BulkEnquiry initialPlant={plant} initialPotSize={potSize} initialQuantity={quantity} />;
}