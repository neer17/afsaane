import { API_ENDPOINTS } from "@/utils/constants";
import { refreshSession } from "@/lib/api/common";

import type { components } from "@/types/api";
export type CreateOrderRequest = components["schemas"]["OrderInput"];
export type CreateOrderResponse = components["schemas"]["OrderResponse"];

export const OrderService = {
  createOrder: async (
    orderData: CreateOrderRequest,
  ): Promise<CreateOrderResponse> => {
    const ORDER_CREATE_ENDPOINT = `${process.env["NEXT_PUBLIC_BACKEND_BASE_URL"]}${API_ENDPOINTS.ORDER_CREATE.URL}`;
    const createOrderRequest = fetch(ORDER_CREATE_ENDPOINT, {
      method: API_ENDPOINTS.ORDER_CREATE.METHOD,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
      credentials: "include",
    });
    const response = await createOrderRequest;

    if (response.status === 401) {
      const refreshed = await refreshSession();

      if (!refreshed) {
        throw new Error("Not authenticated");
      }

      // Retry original request once
      const retryResponse = await createOrderRequest;

      if (!retryResponse.ok) {
        throw new Error("Request failed after refresh");
      }

      return retryResponse.json();
    }

    if (!response.ok) {
      throw new Error("Request failed");
    }

    return response.json();
  },
};
