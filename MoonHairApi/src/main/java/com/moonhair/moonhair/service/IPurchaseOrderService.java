package com.moonhair.moonhair.service;

import com.moonhair.moonhair.dto.PurchaseOrder;
import com.moonhair.moonhair.dto.PurchaseOrderResponse;
import com.moonhair.moonhair.entities.PurchaseOrderEntity;

import java.util.List;

public interface IPurchaseOrderService {
    PurchaseOrderEntity createPurchaseOrder(PurchaseOrder purchaseOrder);
    List<PurchaseOrderResponse> getAllPurchaseOrders(Integer branchId);

}
