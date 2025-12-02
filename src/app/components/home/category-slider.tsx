"use client";

import Link from "next/link";
import Image from "next/image";

import type { Category } from "@/app/types";

interface CategorySliderProps {
  categories: Category[];
}

export function CategorySlider({ categories }: CategorySliderProps) {
  const safeCategories = Array.isArray(categories) ? categories : [];
  const sortedCategories = [...safeCategories].sort((a, b) => {
    const priorityA = a.priority ? Number(a.priority) : Infinity;
    const priorityB = b.priority ? Number(b.priority) : Infinity;
    return priorityA - priorityB;
  });
  const displayedCategories = sortedCategories.slice(0, 10);

  return (
    <div className="flex flex-col items-center gap-8 w-full">
      <div className="w-full grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {displayedCategories.map((category) => (
          <Link
            key={category.slug}
            href={`/category/${category.slug}`}
            className="group flex flex-col items-center justify-center"
          >
            <div className="relative h-24 w-24 overflow-hidden rounded-xl bg-muted transition-all duration-300 group-hover:bg-accent group-hover:shadow-md sm:h-28 sm:w-28 md:h-32 md:w-32 lg:h-36 lg:w-36">
              <Image
                src={
                  typeof category.banner === "string" &&
                  category.banner.trim() !== ""
                    ? category.banner
                    : typeof category.image === "string" &&
                      category.image.trim() !== ""
                    ? category.image
                    : "/placeholder.svg"
                }
                alt={category.name}
                fill
                className="object-cover p-3 sm:p-4 transition-transform duration-300 group-hover:scale-110"
              />
            </div>
          </Link>
        ))}
      </div>

      <Link
        href="/all-products"
        className="mt-6 px-8 py-3 rounded-lg bg-foreground text-background font-medium text-sm sm:text-base transition-colors hover:bg-foreground/90"
      >
        View All Categories
      </Link>
    </div>
  );
}
