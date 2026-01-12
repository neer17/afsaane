import { API_ENDPOINTS } from "@/utils/constants";

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
  }): Promise<Response> => {
    if (!discountCode) throw new Error("Discount code cannot be empty");

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

    return response;
  },
};
