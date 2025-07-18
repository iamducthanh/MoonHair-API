import  axiosClient  from './axiosClient';

const sellApi = {
    getAllProductSell(branchId) {
        return axiosClient.get(`/api/sell/product-list?branchId=${branchId}`);
    },
    getAllServiceSell(branchId) {
        return axiosClient.get(`/api/sell/service-list?branchId=${branchId}`);
    },
    saveSell(sell) {
        return axiosClient.post(`/api/sell/save`, sell);
    },
    paymentVnpay(orderId, amount) {
        return axiosClient.get(`/payment/create-payment?orderId=${orderId}&amountIn=${amount}`);
    },
    paymentResult(param) {
        return axiosClient.get(`/payment/payment-result?${param}`);
    },
    getSellList(param) {
        return axiosClient.post(`/api/sell/get-sell-list`, param);
    },
    updateInvoice(maHoaDon, invoiceUpdate) {
        return axiosClient.put(`/api/sell/${maHoaDon}/update`, invoiceUpdate);
    },
    getInvoiceByMa(maHoaDon) {
        return axiosClient.get(`/api/sell/hoa-don/${maHoaDon}`);
    },
    getThangNam() {
        return axiosClient.get(`/api/sell/thang-nam`);
    }
};

export default sellApi;
