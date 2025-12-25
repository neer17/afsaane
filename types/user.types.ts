export interface Address {
	address: string;
	street: string;
	city: string;
	state: string;
	country: string;
	pinCode: string;
	phone: string;
}

export interface UserCreationData {
	supabaseId?: string;
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	phoneVerified: boolean;
	role: 'CUSTOMER' | 'ADMIN';
	country: string;
	addresses: Address[];
}
