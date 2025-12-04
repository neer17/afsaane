// const APP_NAME = 'Afsaane';

import { Product } from "./types";

export const images = [
  "https://www.nicobar.com/cdn/shop/files/NBI036270_2_2048x.jpg?v=1730278425",
  "https://www.nicobar.com/cdn/shop/files/NBI036270_1_2048x.jpg?v=1730278423",
  "https://www.nicobar.com/cdn/shop/files/NBI036270_7_2048x.jpg?v=1730278434",
  "https://www.nicobar.com/cdn/shop/files/NBI036270_3_2048x.jpg?v=1730278427",
  "https://www.nicobar.com/cdn/shop/files/NBI036270_6_2048x.jpg?v=1730278433",
];

export const IndianStatesList = [
  "Rajasthan",
  "Delhi",
  "Maharashtra",
  "Karnataka",
  "Tamil Nadu",
  "Uttar Pradesh",
  "Gujarat",
  "West Bengal",
  "Madhya Pradesh",
  "Bihar",
  "Andhra Pradesh",
  "Haryana",
  "Kerala",
  "Punjab",
  "Odisha",
  "Telangana",
  "Assam",
  "Jharkhand",
  "Chhattisgarh",
  "Uttarakhand",
  "Himachal Pradesh",
  "Tripura",
  "Meghalaya",
  "Manipur",
  "Nagaland",
  "Goa",
  "Arunachal Pradesh",
  "Mizoram",
  "Sikkim",
  "Jammu and Kashmir",
  "Puducherry",
  "Chandigarh",
  "Dadra and Nagar Haveli",
  "Daman and Diu",
  "Lakshadweep",
  "Andaman and Nicobar Islands",
];

export const API_ENDPOINTS = {
  ORDER_CREATE: {
    URL: "v1/orders/create",
    METHOD: "POST",
  },
  VALIDATE_DISCOUNT_CODE: {
    URL: "v1/orders/validate-discount-code",
    METHOD: "POST",
  },
  APPLY_DISCOUNT_CODE: {
    URL: "v1/orders/apply-discount-code",
    METHOD: "POST",
  },
  PRODUCTS_BY_CATEGORY: {
    // TODO: how to include param or slug?
    URL: "v1/products/categories/",
    METHOD: "GET",
  },
};
