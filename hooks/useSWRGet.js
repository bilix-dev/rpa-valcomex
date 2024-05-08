import useAxios from "./useAxios";
import useSWR from "swr";

const useSWRGet = (key, opts = {}, axiosOptions = {}) => {
  const axios = useAxios();
  if (!Array.isArray(key)) key = [key];
  const fetcher = ([endpoint, args]) =>
    axios.get(endpoint, { params: args }, axiosOptions).catch((error) => {
      console.log(error);
    });
  return { ...useSWR(key, fetcher, opts) };
};

export default useSWRGet;
