export interface DeliveryFormValues {
  userId: string;
  country: string;
  shippingFirstName: string;
  shippingLastName: string;
  email: string;
  shippingAddress: string;
  shippingLandmark?: string;
  shippingCity: string;
  shippingState: string;
  shippingPinCode: string;
  shippingPhone: string;
  billingFirstName?: string;
  billingLastName?: string;
  billingAddress?: string;
  billingLandmark?: string;
  billingCity?: string;
  billingState?: string;
  billingPinCode?: string;
  billingPhone?: string;
  verificationCode?: string;
  isPhoneVerified: boolean;
  useDifferentBilling: boolean;
}
