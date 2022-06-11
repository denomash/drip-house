import useFetch from "./useFetch";

const useGetProducts = () => useFetch("/products", ['products']);

export default useGetProducts