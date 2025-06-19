import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/types/product";

export default function ProductImageGallery({ product }: { product: Product }) {
  return (
    <div className="space-y-4">
      <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
        <Image
          src={product.image || "/placeholder.svg?height=600&width=600"}
          alt={product.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
          priority
        />
        {product.status !== "active" && (
          <div className="absolute top-4 left-4">
            <Badge variant="secondary" className="capitalize">
              {product.status}
            </Badge>
          </div>
        )}
      </div>
    </div>
  );
}
