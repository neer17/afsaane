import { API_ENDPOINTS } from "@/utils/constants";

export const OtpService = {
  sendOtp: async (phoneNumber: string): Promise<Response> => {
    if (!phoneNumber) return Promise.reject();

    // Validate input parameters
    if (!phoneNumber || phoneNumber.trim().length !== 10) {
      throw new Error("Phone number should be 10 digits long");
    }

    const SEND_OTP_ENDPOINT = `${process.env["NEXT_PUBLIC_BACKEND_BASE_URL"]}${API_ENDPOINTS.SEND_OTP.URL}`;
    const response = await fetch(SEND_OTP_ENDPOINT, {
      method: API_ENDPOINTS.SEND_OTP.METHOD,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        phone: `91${phoneNumber}`, // TODO: FO how to make it dynamic
      }),
    });

    return response;
  },
  verifyOtp: async (
    phoneNumber: string,
    verificationCode: string,
  ): Promise<Response> => {
    if (!verificationCode || !phoneNumber)
      throw new Error("Verification code and phone number should be present");

    // Validate input parameters
    if (!verificationCode || verificationCode.trim().length !== 6) {
      throw new Error("verification code should be 6 digits long");
    }

    const VERIFY_OTP_ENDPOINT = `${process.env["NEXT_PUBLIC_BACKEND_BASE_URL"]}${API_ENDPOINTS.VERIFY_OTP.URL}`;
    const response = await fetch(VERIFY_OTP_ENDPOINT, {
      method: API_ENDPOINTS.VERIFY_OTP.METHOD,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        phone: `91${phoneNumber}`,
        otp: verificationCode,
      }),
    });

    return response;
  },
};
