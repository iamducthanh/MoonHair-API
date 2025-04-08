import  axiosClient  from './axiosClient';

const productApi = {
    getAllProductByBranch(branchId) {
        return axiosClient.get(`/api/products?branchId=${branchId}`);
    },
    createProduct(product) {
        return axiosClient.post('/api/products', product);
    },
    updateProduct(product) {
        return axiosClient.put('/api/products', product);
    },
    deleteProduct: (id) => axiosClient.delete(`/api/products/${id}`),

    searchProductByKey(key) {
        return axiosClient.get(`/api/products/search?keyword=${key}`);
    },
};

export default productApi;
