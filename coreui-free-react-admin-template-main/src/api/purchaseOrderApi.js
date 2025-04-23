import  axiosClient  from './axiosClient';

const purchaseOrderApi = {
    createPurchaseOrder(purchaseOrder) {
        return axiosClient.post(`/api/purchase-order`, purchaseOrder);
    }
};

export default purchaseOrderApi;
