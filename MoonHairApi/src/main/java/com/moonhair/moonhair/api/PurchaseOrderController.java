package com.moonhair.moonhair.api;

import com.moonhair.moonhair.dto.ProductRequest;
import com.moonhair.moonhair.dto.PurchaseOrder;
import com.moonhair.moonhair.dto.PurchaseOrderResponse;
import com.moonhair.moonhair.entities.ProductEntity;
import com.moonhair.moonhair.entities.PurchaseOrderEntity;
import com.moonhair.moonhair.service.IPurchaseOrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @GetMapping
    public ResponseEntity<List<PurchaseOrderResponse>> getAllPurchaseOrders(@RequestParam Integer branchId) {
        List<PurchaseOrderResponse> purchaseOrders = purchaseOrderService.getAllPurchaseOrders(branchId);
        return ResponseEntity.ok(purchaseOrders);
    }

}
