import { notFound } from "next/navigation";
import ProductImageGallery from "@/components/product/ProductImageGallery";
import { getProductByHandle } from "@/lib/elasticsearch";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ProductDetails from "@/components/product/ProductDetails";
import ProductInformation from "@/components/product/ProductInformation";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const product = await getProductByHandle((await params).handle);
  if (!product) {
    notFound();
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <BackToSearch />
      </div>

      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
          <ProductImageGallery product={product} />
          <ProductDetails product={product} />
        </div>

        <Separator />

        <div className="p-8">
          <ProductInformation product={product} />
        </div>
      </div>
    </main>
  );
}

function BackToSearch() {
  return (
    <Link
      href="/"
      className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors"
    >
      <ArrowLeft className="w-4 h-4 mr-2" />
      Back to Search
    </Link>
  );
}
