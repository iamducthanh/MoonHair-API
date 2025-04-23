package com.moonhair.moonhair.api;

import com.moonhair.moonhair.dto.ProductRequest;
import com.moonhair.moonhair.dto.PurchaseOrder;
import com.moonhair.moonhair.entities.ProductEntity;
import com.moonhair.moonhair.entities.PurchaseOrderEntity;
import com.moonhair.moonhair.service.IPurchaseOrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/purchase-order")
@RequiredArgsConstructor
public class PurchaseOrderController {
    private final IPurchaseOrderService purchaseOrderService;

    @PostMapping
    public ResponseEntity<?> createPurchaseOrder(@Valid @RequestBody PurchaseOrder purchaseOrder) {
            purchaseOrderService.createPurchaseOrder(purchaseOrder);
        return ResponseEntity.ok(purchaseOrder);
    }
}
