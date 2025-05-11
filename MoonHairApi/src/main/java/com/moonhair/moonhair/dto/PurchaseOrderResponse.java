package com.moonhair.moonhair.dto;

import com.moonhair.moonhair.entities.PurchaseOrderDetailEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@Builder
public class PurchaseOrderResponse {
    private Integer id; // Id phiếu nhập
    private String code;
    private Integer branchId;
    private LocalDateTime createdAt;
    private String supplierName; // Tên nhà cung cấp
    private String status;
    private Double totalAmount;
    private Double discount;
    private Double finalAmount;
    private Double otherCost;
    private String note;
    private List<PurchaseOrderDetailEntity> details; // Danh sách chi tiết phiếu nhập

}
