import useAxios from "./useAxios";
import useSWRMutation from "swr/mutation";

const useSWRPost = (key, opts = {}, axiosOptions = {}) => {
  const axios = useAxios();
  const fetcher = (endpoint, { arg }) =>
    axios.post(endpoint, arg, axiosOptions).catch((error) => {
      console.log(error);
    });
  return { ...useSWRMutation(key, fetcher, opts) };
};

export default useSWRPost;
