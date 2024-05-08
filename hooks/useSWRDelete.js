import useAxios from "./useAxios";
import useSWRMutation from "swr/mutation";

const useSWRDelete = (key, opts = {}, axiosOptions = {}) => {
  const axios = useAxios();
  const fetcher = (endpoint, { arg }) =>
    axios.delete(endpoint, arg, axiosOptions).catch((error) => {
      console.log(error);
    });
  return { ...useSWRMutation(key, fetcher, opts) };
};

export default useSWRDelete;
