/* eslint-disable @typescript-eslint/no-explicit-any */
import { HeroBanner } from "./components/home/hero-banner";
import { CategorySlider } from "./components/home/category-slider";
import { categoriesService } from "./lib/api/services/categories";
import { ProductSection } from "./components/home/product-section";
import { BrandSlider } from "./components/home/brand-slider";
import { brandsService } from "./lib/api/services/brands";
import { Navbar } from "./components/layout/navbar";
import { Footer } from "./components/layout/footer";
import { homecategoriesService } from "./lib/api/services/homecategories";
import { productsService } from "./lib/api/services/products";
import type { Product } from "./types";
import type { Homecategory } from "./lib/api/services/homecategories";

export const dynamic = 'force-dynamic';

export default async function Page() {
  // Fetch brands for the slider
  const brands = await brandsService.findAll();
  // Fetch categories for the slider
  const categories = await categoriesService.getAll();
  console.log("Fetched categories:", categories);
  // Ensure slug is always a string to match the app types
  const normalizedCategories: import("./types").Category[] = categories.map(
    (c) => ({
      ...c,
      slug: c.slug ?? "",
    })
  );

  // Fetch all homecategories and sort by priority
  const homecategories: Homecategory[] = await homecategoriesService.list();
  const sortedHomecategories = [...homecategories].sort(
    (a, b) => (a.priority ?? 999) - (b.priority ?? 999)
  );

  // Fetch products for each homecategory
  const homecategoryProducts: Record<string, Product[]> = {};
  for (const hc of sortedHomecategories) {
    if (hc.productIds && hc.productIds.length > 0) {
      try {
        let products: Product[] = [];
        let res: any = null;
        try {
          res = await productsService.getAll(
            { ids: hc.productIds } as any,
            1,
            hc.productIds.length
          );
          products = Array.isArray(res.items)
            ? res.items
            : Array.isArray(res)
            ? res
            : [];
        } catch {
          res = await productsService.getAll({}, 1, 1000);
          const allProducts = Array.isArray(res.items)
            ? res.items
            : Array.isArray(res)
            ? res
            : [];
          products = allProducts.filter((p: Product) =>
            hc.productIds!.includes(p.id)
          );
        }
        homecategoryProducts[hc.id] = products;
      } catch {
        homecategoryProducts[hc.id] = [];
      }
    } else {
      homecategoryProducts[hc.id] = [];
    }
  }

  const flashSaleEndTime = new Date();
  flashSaleEndTime.setHours(flashSaleEndTime.getHours() + 24);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 flex flex-col">
        {/* Hero Banner */}
        <section className="mx-auto w-full max-w-7xl px-4 py-6">
          <HeroBanner />
        </section>

        <section className="mx-auto w-full max-w-7xl px-4 py-8">
          <h2 className="mb-6 text-center text-2xl font-bold tracking-tight">
            Shop by Category
          </h2>
          <CategorySlider categories={normalizedCategories} />
        </section>

        {/* Dynamic Homecategory Sections */}
        {sortedHomecategories.map((hc) => (
          <section key={hc.id} className="mx-auto w-full max-w-7xl px-4 py-8">
            <ProductSection
              title={hc.name}
              subtitle={hc.description}
              products={homecategoryProducts[hc.id]}
              viewAllLink={
                hc.productIds && hc.productIds.length > 0
                  ? `/products?homecategory=${hc.id}`
                  : undefined
              }
            />
          </section>
        ))}

        {/* Brands */}
        <section className="mx-auto w-full max-w-7xl px-4 py-12">
          <BrandSlider brands={brands} />
        </section>

        {/* Newsletter / CTA Section */}
        <section className="bg-muted">
          <div className="mx-auto max-w-7xl px-4 py-16 text-center">
            <h2 className="text-3xl font-bold tracking-tight">Stay Updated</h2>
            <p className="mt-2 text-muted-foreground">
              Get exclusive deals, new arrivals, and tech news delivered to your
              inbox.
            </p>
            <form className="mx-auto mt-6 flex max-w-md gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 rounded-lg border border-input bg-background px-4 py-2 text-sm"
              />
              <button
                type="submit"
                className="rounded-lg bg-foreground px-6 py-2 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
              >
                Subscribe
              </button>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
