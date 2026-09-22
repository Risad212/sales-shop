import type { Product } from "@/types";
import ProductCard from "@/components/product/ProductCard";
import ProductSkeleton from "@/components/common/ProductSkeleton";

interface ShopProductProps {
  products: Product[];
  isLoading: boolean;
}

export default function ShopProduct({ products, isLoading }: ShopProductProps) {
  if (isLoading) return <ProductSkeleton count={6} />;
  if (products.length === 0) {
    return <p className="py-10 text-center text-neutral-500">No products found.</p>;
  }
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {products.map((product) => (
        <ProductCard item={product} key={product.id} />
      ))}
    </div>
  );
}
