interface OrderItem {
  productId: string;
  quantity: number;
}

// enum OrderStatus {
// 	PENDING = "PENDING",
// 	PROCESSING = "PROCESSING",
// 	SHIPPED = "SHIPPED",
// 	DELIVERED = "DELIVERED",
// 	CANCELLED = "CANCELLED",
// 	RETURNED = "RETURNED",
// 	PARTIALLY_SHIPPED = "PARTIALLY_SHIPPED",
// }

export enum PaymentStatus {
  PAID = "PAID",
}

export enum PaymentMethod {
  PREPAID = "PREPAID",
}

export type AddressType = "BILLING" | "SHIPPING" | "BOTH";

interface BaseAddress {
  address: string;
  street: string;
  city: string;
  state: string;
  country: string;
  pinCode: string;
  addressType: AddressType;
  isDefault: boolean;
  landmark?: string;
}
interface ShippingAddress extends BaseAddress {
  phone: string;
  countryCode: string;
}

interface BillingAddress extends BaseAddress {
  phone?: string;
  countryCode?: string;
}

export interface OrderRequest {
  userId: string;
  discountCode?: string;
  shippingAddress: ShippingAddress;
  billingAddress?: BillingAddress;
  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethod;
  items: OrderItem[];
}
