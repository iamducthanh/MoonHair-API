import  axiosClient  from './axiosClient';

const purchaseOrderApi = {
    createPurchaseOrder(purchaseOrder) {
        return axiosClient.post(`/api/purchase-order`, purchaseOrder);
    },
    getAllPurchaseOrder(branchId) {
        return axiosClient.get(`/api/purchase-order?branchId=${branchId}`);
    }
};

export default purchaseOrderApi;
