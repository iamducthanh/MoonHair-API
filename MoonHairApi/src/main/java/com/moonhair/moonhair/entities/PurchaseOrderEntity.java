package com.moonhair.moonhair.entities;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "phieu_nhap")
@Data
public class PurchaseOrderEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "ma_phieu")
    private String code;

    @Column(name = "id_chi_nhanh", nullable = false)
    private Integer branchId;

    @Column(name = "ngay_tao")
    private LocalDateTime createdAt;

    @Column(name = "ten_ncc")
    private String supplierName;

    @Column(name = "trang_thai")
    private String status;

    @Column(name = "tong_tien")
    private Double totalAmount;

    @Column(name = "giam_gia")
    private Double discount;

    @Column(name = "tong_tien_thanh_toan")
    private Double finalAmount;

    @Column(name = "chi_phi_khac")
    private Double otherCost;

    @Column(name = "ghi_chu", length = 1000)
    private String note;

}

