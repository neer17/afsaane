import { OrderRequest } from "@/lib/dtos/order";
import { API_ENDPOINTS } from "@/utils/constants";

export const OrderService = {
	// TODO: remove any
	// eslint-disable-next-line  @typescript-eslint/no-explicit-any
	createOrder: async (orderData: OrderRequest): Promise<any> => {
		const ORDER_CREATE_ENDPOINT = `${process.env["NEXT_PUBLIC_BACKEND_BASE_URL"]}${API_ENDPOINTS.ORDER_CREATE.URL}`;
		const response = await fetch(ORDER_CREATE_ENDPOINT, {
			method: API_ENDPOINTS.ORDER_CREATE.METHOD,
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(orderData),
		});

		return response;
	},
};
