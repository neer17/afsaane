import { API_ENDPOINTS } from "@/utils/constants";

import type { components } from "@/types/api";

export type SendOtpRequest = components["schemas"]["SendOtpRequest"];
export type VerifyOtpRequest = components["schemas"]["VerifyOtpRequest"];

export const OtpService = {
  sendOtp: async (request: SendOtpRequest): Promise<Response> => {
    if (!request.phone) return Promise.reject();

    // Validate input parameters
    if (!request.phone || request.phone.trim().length !== 10) {
      throw new Error("Phone number should be 10 digits long");
    }

    const SEND_OTP_ENDPOINT = `${process.env["NEXT_PUBLIC_BACKEND_BASE_URL"]}${API_ENDPOINTS.SEND_OTP.URL}`;
    return fetch(SEND_OTP_ENDPOINT, {
      method: API_ENDPOINTS.SEND_OTP.METHOD,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        phone: `91${request.phone}`, // TODO: FO how to make it dynamic
      }),
    });
  },
  verifyOtp: async (verifyOtpRequest: VerifyOtpRequest): Promise<Response> => {
    if (!verifyOtpRequest.otp || !verifyOtpRequest.phone)
      throw new Error("Verification code and phone number should be present");

    // Validate input parameters
    if (!verifyOtpRequest.otp || verifyOtpRequest.otp.trim().length !== 6) {
      throw new Error("verification code should be 6 digits long");
    }

    const VERIFY_OTP_ENDPOINT = `${process.env["NEXT_PUBLIC_BACKEND_BASE_URL"]}${API_ENDPOINTS.VERIFY_OTP.URL}`;
    return fetch(VERIFY_OTP_ENDPOINT, {
      method: API_ENDPOINTS.VERIFY_OTP.METHOD,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        phone: `91${verifyOtpRequest.phone}`,
        otp: verifyOtpRequest.otp,
      }),
    });
  },
};
