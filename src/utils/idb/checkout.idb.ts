import { openDB, DBSchema, IDBPDatabase } from "idb";

interface ExclusionList {
  verificationCode: string;
}

interface EntireFormData {
  userId: string;
  country: string;
  shippingFirstName: string;
  shippingLastName: string;
  shippingAddress: string;
  shippingApartment?: string;
  shippingCity: string;
  shippingState: string;
  shippingPinCode: string;
  shippingPhone: string;
  billingFirstName?: string;
  billingLastName?: string;
  billingAddress?: string;
  billingApartment?: string;
  billingCity?: string;
  billingState?: string;
  billingPinCode?: string;
  billingPhone?: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface CheckoutFormData extends Omit<EntireFormData, keyof ExclusionList> {}

interface CheckoutState {
  formData: CheckoutFormData;
  isVerificationCodeSent: boolean;
  isVerificationCodeVerified: boolean;
  otpExpiryTime: number | null;
  timeRemaining: number;
  useDifferentBilling: boolean;
  savedAt: number;
  expiresAt: number;
}

interface CheckoutDB extends DBSchema {
  checkoutState: {
    key: string;
    value: CheckoutState;
  };
}

const DB_NAME = "CheckoutDB";
const DB_VERSION = 1;
const STORE_NAME = "checkoutState";
const STATE_KEY = "current";
const EXPIRY_DURATION = Number(
  process.env["NEXT_PUBLIC_CHECKOUT_DATA_EXPIRATION_DURATION_IN_MILLISECONDS"]!,
);

let dbInstance: IDBPDatabase<CheckoutDB> | null = null;

async function getDB(): Promise<IDBPDatabase<CheckoutDB>> {
  if (dbInstance) {
    return dbInstance;
  }

  dbInstance = await openDB<CheckoutDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    },
  });

  return dbInstance;
}

export async function saveCheckoutState(
  formData: CheckoutFormData,
  isVerificationCodeSent: boolean,
  isVerificationCodeVerified: boolean,
  otpExpiryTime: number | null,
  timeRemaining: number,
  useDifferentBilling: boolean,
): Promise<void> {
  try {
    const db = await getDB();
    const now = Date.now();

    const state: CheckoutState = {
      formData,
      isVerificationCodeSent,
      isVerificationCodeVerified,
      otpExpiryTime,
      timeRemaining,
      useDifferentBilling,
      savedAt: now,
      expiresAt: now + EXPIRY_DURATION,
    };

    await db.put(STORE_NAME, state, STATE_KEY);
  } catch (error) {
    console.error("Failed to save checkout state:", error);
  }
}

export async function loadCheckoutState(): Promise<CheckoutState | null> {
  try {
    const db = await getDB();
    const state = await db.get(STORE_NAME, STATE_KEY);

    if (!state) {
      return null;
    }

    const now = Date.now();

    // Check if state has expired
    if (now > state.expiresAt) {
      await clearCheckoutState();
      return null;
    }

    // Adjust timer if OTP was active when saved
    if (state.otpExpiryTime && state.otpExpiryTime > now) {
      const adjustedTimeRemaining = Math.max(
        0,
        Math.ceil((state.otpExpiryTime - now) / 1000),
      );
      return {
        ...state,
        timeRemaining: adjustedTimeRemaining,
      };
    }

    // If OTP expired while stored, reset OTP state
    if (state.otpExpiryTime && state.otpExpiryTime <= now) {
      return {
        ...state,
        isVerificationCodeSent: false,
        otpExpiryTime: null,
        timeRemaining: 0,
      };
    }

    return state;
  } catch (error) {
    console.error("Failed to load checkout state:", error);
    return null;
  }
}

export async function clearCheckoutState(): Promise<void> {
  try {
    const db = await getDB();
    await db.delete(STORE_NAME, STATE_KEY);
  } catch (error) {
    console.error("Failed to clear checkout state:", error);
  }
}

export async function updateFormData(
  formData: Partial<CheckoutFormData>,
): Promise<void> {
  try {
    const currentState = await loadCheckoutState();
    if (currentState) {
      await saveCheckoutState(
        { ...currentState.formData, ...formData },
        currentState.isVerificationCodeSent,
        currentState.isVerificationCodeVerified,
        currentState.otpExpiryTime,
        currentState.timeRemaining,
        currentState.useDifferentBilling,
      );
    }
  } catch (error) {
    console.error("Failed to update form data:", error);
  }
}
