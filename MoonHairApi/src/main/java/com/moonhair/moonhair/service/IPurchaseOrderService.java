package com.moonhair.moonhair.service;

import com.moonhair.moonhair.dto.PurchaseOrder;
import com.moonhair.moonhair.entities.PurchaseOrderEntity;

public interface IPurchaseOrderService {
    public PurchaseOrderEntity createPurchaseOrder(PurchaseOrder purchaseOrder);

}
