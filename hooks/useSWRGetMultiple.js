import useAxios from "./useAxios";
import useSWR from "swr";

const useSWRGetMultiple = (key, opts = {}, axiosOptions = {}) => {
  const axios = useAxios();
  if (!Array.isArray(key)) key = [key];
  const fetcher = (endpoints) => {
    const f = (endpoint) =>
      axios.get(endpoint, axiosOptions).catch((error) => {
        console.log(error);
      });
    return Promise.all(endpoints.map((endpoint) => f(endpoint)));
  };
  return { ...useSWR(key, fetcher, opts) };
};

export default useSWRGetMultiple;
