import  axiosClient  from './axiosClient';

const sellApi = {
    getAllProductSell(branchId) {
        return axiosClient.get(`/api/sell/product-list?branchId=${branchId}`);
    },
    getAllServiceSell(branchId) {
        return axiosClient.get(`/api/sell/service-list?branchId=${branchId}`);
    }
};

export default sellApi;
