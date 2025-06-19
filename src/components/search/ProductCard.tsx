import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/types/product";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);

  const truncateText = (text: string, maxLength: number) =>
    text.length > maxLength ? text.substring(0, maxLength) + "..." : text;

  return (
    <div className="bg-white rounded-2xl border shadow-sm hover:shadow-lg transition-shadow duration-200 group overflow-hidden">
      <Link href={`/product/${product.handle}`} className="block">
        <div className="relative aspect-square bg-gray-100">
          <Image
            src={product.image || "/placeholder.svg?height=300&width=300"}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {product.status !== "active" && (
            <Badge
              variant="secondary"
              className="absolute top-3 left-3 capitalize text-xs"
            >
              {product.status}
            </Badge>
          )}
          {product.totalInventory < 10 && product.totalInventory > 0 && (
            <Badge
              variant="destructive"
              className="absolute top-3 right-3 text-xs bg-yellow-600"
            >
              Low Stock
            </Badge>
          )}
        </div>

        <div className="p-4 space-y-2">
          <div>
            <h3 className="text-base font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2">
              {product.highlight?.title ? (
                <span
                  dangerouslySetInnerHTML={{
                    __html: product.highlight.title[0],
                  }}
                />
              ) : (
                truncateText(product.title, 60)
              )}
            </h3>
            <p className="text-sm text-gray-500">{product.vendor}</p>
          </div>

          {product.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {product.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="outline" className="text-[10px]">
                  {tag}
                </Badge>
              ))}
              {product.tags.length > 3 && (
                <Badge variant="outline" className="text-[10px]">
                  +{product.tags.length - 3}
                </Badge>
              )}
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-gray-900">
              {formatPrice(product.price)}
            </span>
            {product.totalInventory === 0 && (
              <Badge variant="destructive" className="text-xs">
                Out of Stock
              </Badge>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
