"use client";

import ProductCard from "@/components/card/ProductCard";
import React, { useEffect, useState } from "react";
import styles from "./page.module.css";
import { useParams } from "next/navigation";
import { API_ENDPOINTS } from "@/app/helpers/constants";
import { SimpleGrid } from "@mantine/core";
import { Product } from "@/app/helpers/types";

const ProductCatalog = () => {
  const { category } = useParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!category) return;

      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/${API_ENDPOINTS.PRODUCTS_BY_CATEGORY.URL}${category}`,
          {
            method: API_ENDPOINTS.PRODUCTS_BY_CATEGORY.METHOD,
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch products: ${response.status}`);
        }

        const data = await response.json();
        setProducts(data.data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch products",
        );
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  if (loading) {
    return (
      <div className={styles.productCatalogContainer}>
        <div>Loading products...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.productCatalogContainer}>
        <div>Error: {error}</div>
      </div>
    );
  }

  return (
    <div className={`page ${styles.productCatalogContainer}`}>
      <SimpleGrid
        cols={{ base: 2, md: 3, xl: 4 }}
        spacing={{ base: 10, sm: "xl" }}
        verticalSpacing={{ base: "md", sm: "xl" }}
      >
        {products.map((product) => (
          <ProductCard
            key={product.id}
            slug={product.slug}
            images={product.images?.map((img) => img.url)}
            productTitle={product.name}
            imageSizes="(max-width: 768px) 50vw, 33.3vw"
            productPrice={product.price}
          />
        ))}
      </SimpleGrid>
    </div>
  );
};

export default ProductCatalog;
