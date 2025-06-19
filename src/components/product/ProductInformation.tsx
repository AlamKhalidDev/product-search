import { formatDate } from "@/lib/utils";
import { Product } from "@/types/product";

export default function ProductInformation({ product }: { product: Product }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <ProductInfoSection product={product} />
      <SeoInfoSection product={product} />
    </div>
  );
}

function ProductInfoSection({ product }: { product: Product }) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Product Information
      </h3>
      <dl className="space-y-2">
        <InfoRow label="SKU:" value={product.id} />
        <InfoRow label="Vendor:" value={product.vendor} />
        <InfoRow label="Product Type:" value={product.productType} />
        <InfoRow label="Inventory:" value={`${product.totalInventory} units`} />
        <InfoRow label="Created:" value={formatDate(product.createdAt)} />
        <InfoRow label="Last Updated:" value={formatDate(product.updatedAt)} />
      </dl>
    </div>
  );
}

function SeoInfoSection({ product }: { product: Product }) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        SEO Information
      </h3>
      <dl className="space-y-2">
        <InfoRow label="SEO Title:" value={product.seoTitle || "Not set"} />
        <InfoRow
          label="SEO Description:"
          value={product.seoDescription || "Not set"}
        />
        <InfoRow label="Handle:" value={product.handle} />
      </dl>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-start">
      <dt className="text-sm text-gray-600 min-w-[130px]">{label}</dt>
      <dd className="text-sm font-medium text-gray-900 text-left">{value}</dd>
    </div>
  );
}
