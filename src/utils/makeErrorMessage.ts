import { AxiosError } from "axios";
/**
 * @description Attempt to make a useful error message from the API error
 * @param {AxiosError} error The api error
 * @return {string}
 */
export const makeErrorMessage = (error: AxiosError) => {
  const responseData: any = error.response?.data;

  if (error.response?.status === 404) {
    return responseData?.message || "Resource not found";
  }

  if (error.response?.status === 401) {
    return "Invalid email or password";
  }

  if (error.response?.status === 400) {
    return responseData?.message || "Bad request";
  }

  if (responseData?.message) {
    return responseData?.message;
  }

  return `${error?.message}` || "Something went wrong";
};
