import  axiosClient  from './axiosClient';

const productApi = {
    getAllProductByBranch(branchId) {
        return axiosClient.get(`/api/products?branchId=${branchId}`);
    },
    getAllProductListByBranch(branchId) {
        return axiosClient.get(`/api/products/list?branchId=${branchId}`);
    },
    createProduct(product) {
        return axiosClient.post('/api/products', product);
    },
    updateProduct(product) {
        return axiosClient.put('/api/products', product);
    },
    updateProductList(product) {
        return axiosClient.put(`/api/lots/${product.lotId}/selling-price`, product);
    },
    deleteProduct: (id) => axiosClient.delete(`/api/products/${id}`),

    searchProductByKey(key, branchId) {
        return axiosClient.get(`/api/products/search?keyword=${key}&branchId=${branchId}`);
    },
};

export default productApi;
