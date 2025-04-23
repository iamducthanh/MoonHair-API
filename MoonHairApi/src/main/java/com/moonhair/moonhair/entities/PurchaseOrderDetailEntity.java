package com.moonhair.moonhair.entities;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "chi_tiet_phieu_nhap")
@Data
public class PurchaseOrderDetailEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "id_phieu_nhap", nullable = false)
    private Integer purchaseOrderId;

    @Column(name = "id_san_pham", nullable = false)
    private Integer productId;

    @Column(name = "ten_san_pham", nullable = false)
    private String productName;

    @Column(name = "so_luong", nullable = false)
    private Integer quantity;

    @Column(name = "gia_nhap", nullable = false)
    private Double importPrice;

}

