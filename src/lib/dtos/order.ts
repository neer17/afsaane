interface OrderItem {
	productId: string;
	quantity: number;
	price: number;
}

interface BackOrderItem {
	productId: string;
	userId: string;
	quantity: number;
	price: number;
	status?: OrderStatus;
	updatedAt?: Date;
	createdAt?: Date;
}

enum OrderStatus {
	PENDING = "PENDING",
	PROCESSING = "PROCESSING",
	SHIPPED = "SHIPPED",
	DELIVERED = "DELIVERED",
	CANCELLED = "CANCELLED",
	RETURNED = "RETURNED",
	PARTIALLY_SHIPPED = "PARTIALLY_SHIPPED",
}

enum PaymentStatus {
	PAID = "PAID",
}

enum PaymentMethod {
	PREPAID = "PREPAID",
}

type AddressType = "BILLING" | "SHIPPING" | "BOTH";

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
	shippingAddress: ShippingAddress;
	billingAddress?: BillingAddress;
	total: number;
	subtotal: number;
	tax: number;
	shipping: number;
	discount?: number;
	couponId?: string;
	paymentStatus: PaymentStatus;
	paymentMethod?: PaymentMethod;
	notes?: string;
	items: OrderItem[];
	backOrderItems?: BackOrderItem[];
}
