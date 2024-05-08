import axios from "axios";

const useAxios = () => {
  const baseConfig = {
    baseURL: "/api",
  };
  const fetcher = axios.create({
    ...baseConfig,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
  return fetcher;
};

export default useAxios;
