package com.moonhair.moonhair.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PurchaseOrder {
    private Integer branchId;
    private Double chiPhiKhac;
    private String ghiChu;
    private Double giamGia;
    private LocalDateTime ngayNhap;
    private String nhaCungCap;
    private Double tienTra;
    private Double tongTienHang;
    private List<PurchaseOrderDetail> product;
}
