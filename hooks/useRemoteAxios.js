import axios from "axios";

const useRemoteAxios = () => {
  const baseConfig = {
    baseURL: process.env.NEXT_PUBLIC_API_URL,
  };
  const fetcher = axios.create({
    ...baseConfig,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: process.env.NEXT_PUBLIC_WS_AUTH,
    },
    validateStatus: () => true,
  });
  return fetcher;
};

export default useRemoteAxios;
