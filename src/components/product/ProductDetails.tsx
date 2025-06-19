"use client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Heart, Share2 } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { Product } from "@/types/product";
import { useState } from "react";

export default function ProductDetails({ product }: { product: Product }) {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-blue-600 font-medium">{product.vendor}</p>
          <ActionButtons />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {product.title}
        </h1>

        <div className="text-3xl font-bold text-gray-900 mb-6">
          {formatPrice(product.price)}
        </div>
      </div>

      <InventoryStatus product={product} />

      {product.description && (
        <DescriptionSection description={product.description} />
      )}

      {product.tags.length > 0 && <TagsSection tags={product.tags} />}

      <InventoryAlert inventory={product.totalInventory} />
    </div>
  );
}

function ActionButtons() {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset feedback after 2 seconds
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Button variant="outline" size="sm">
        <Heart className="w-4 h-4" />
      </Button>
      <Button variant="outline" size="sm" onClick={handleShare}>
        {copied ? (
          <Check className="w-4 h-4 text-green-500" />
        ) : (
          <Share2 className="w-4 h-4" />
        )}
      </Button>
    </div>
  );
}

function InventoryStatus({ product }: { product: Product }) {
  return (
    <div className="flex items-center space-x-4">
      <Badge variant="outline">{product.productType}</Badge>
      <Badge
        variant={product.status === "active" ? "default" : "secondary"}
        className="capitalize"
      >
        {product.status}
      </Badge>
      {product.totalInventory < 10 && product.totalInventory > 0 && (
        <Badge variant="destructive">Only {product.totalInventory} left</Badge>
      )}
    </div>
  );
}

function DescriptionSection({ description }: { description: string }) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
      <div
        className="text-gray-700 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: description }}
      />
    </div>
  );
}

function TagsSection({ tags }: { tags: string[] }) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-3">Tags</h3>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Badge key={tag} variant="outline">
            {tag}
          </Badge>
        ))}
      </div>
    </div>
  );
}

function InventoryAlert({ inventory }: { inventory: number }) {
  if (inventory === 0) {
    return (
      <p className="text-sm text-red-600 text-center">
        This product is currently out of stock
      </p>
    );
  }
  return null;
}
