package com.moonhair.moonhair.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PurchaseOrderDetail {
    private Double donGia;
    private Integer id;
    private String productCode;
    private String productName;
    private Integer quantityRemaining;
    private String size;
    private Integer soLuongNhap;
    private Double thanhTien;
}
