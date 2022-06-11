import { AxiosError } from "axios";
import { useMutation } from "react-query";
import api from "../api";
import { makeErrorMessage } from "../utils/makeErrorMessage";

/**
 * @description Abstract the logic for making a post request into a reusable function
 * @param payload
 * @param path
 * @returns
 */
export default function usePostRequest(
  path: string,
  payload: any,
  onSuccess: Function,
  onFailure: Function
) {
  const postRequest = () => api.post(path, payload);
  const mutation = useMutation(postRequest, {
    onSuccess: (data) => {
      onSuccess(data);
    },
    onError: (error: AxiosError) => {
      onFailure({
        message: makeErrorMessage(error),
        statusCode: error.response?.status,
      });
    },
  });
  return mutation;
}

/**
 * @description Abstract the logic for making a put(update) request into a reusable function
 * @param payload
 * @param path
 * @returns
 */
export function usePutRequest(
  path: string,
  payload: any,
  onSuccess: Function,
  onFailure: Function
) {
  const putRequest = () => api.put(path, payload);
  const mutation = useMutation(putRequest, {
    onSuccess: (data) => {
      onSuccess(data);
    },
    onError: (error: AxiosError) => {
      onFailure({
        message: makeErrorMessage(error),
        statusCode: error.response?.status,
      });
    },
  });
  return mutation;
}
