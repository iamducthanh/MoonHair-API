import  axiosClient  from './axiosClient';

const sellApi = {
    getAllProductSell(branchId) {
        return axiosClient.get(`/api/sell/product-list?branchId=${branchId}`);
    },
    getAllServiceSell(branchId) {
        return axiosClient.get(`/api/sell/service-list?branchId=${branchId}`);
    },
    paymentVnpay(orderId, amount) {
        return axiosClient.get(`/api/payment/create-payment?orderId=${orderId}&amountIn=${amount}`);
    }
};

export default sellApi;
