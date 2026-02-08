import { API_ENDPOINTS } from "@/utils/constants";
import { components } from "@/types/api";

export type DiscountResult = components["schemas"]["DiscountResult"];

export const DiscountService = {
  applyDiscountCode: async ({
    discountCode,
    appliedProductIds,
    appliedCategoryIds,
    orderAmount,
  }: {
    discountCode: string;
    appliedProductIds: string[];
    appliedCategoryIds: string[];
    orderAmount: number;
  }): Promise<DiscountResult> => {
    // Validate input parameters
    if (!discountCode || discountCode.trim().length === 0) {
      throw new Error("Discount code is required");
    }

    const DISCOUNT_ENDPOINT = `${process.env["NEXT_PUBLIC_BACKEND_BASE_URL"]}${API_ENDPOINTS.APPLY_DISCOUNT_CODE.URL}`;
    const response = await fetch(DISCOUNT_ENDPOINT, {
      method: API_ENDPOINTS.APPLY_DISCOUNT_CODE.METHOD,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        discountCode: discountCode.trim(),
        appliedProductIds,
        appliedCategoryIds,
        orderAmount,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to apply discount: ${response.statusText}`);
    }

    const data: DiscountResult = await response.json();
    return data;
  },
};
