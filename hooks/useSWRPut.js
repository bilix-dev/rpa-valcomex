import useAxios from "./useAxios";
import useSWRMutation from "swr/mutation";

const useSWRPut = (key, opts = {}, axiosOptions = {}) => {
  const axios = useAxios();
  const fetcher = (endpoint, { arg }) =>
    axios.put(endpoint, arg, axiosOptions).catch((error) => {
      console.log(error);
    });
  return { ...useSWRMutation(key, fetcher, opts) };
};

export default useSWRPut;
