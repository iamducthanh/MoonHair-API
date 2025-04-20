package com.moonhair.moonhair.entities;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.Data;

@Entity
@Table(name = "lo_hang")
@Data
public class LotEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "id_san_pham", nullable = false)
    private Integer productId;

    @Column(name = "id_chi_tiet_phieu_nhap")
    private Integer purchaseOrderDetailId;

    @Column(name = "ma_lo", nullable = false)
    private String lotCode;

    @Column(name = "so_luong_nhap", nullable = false)
    private Integer quantityImported;

    @Column(name = "so_luong_con", nullable = false)
    private Integer quantityRemaining;

    @Column(name = "gia_von", nullable = false)
    private Double costPrice;

    @Column(name = "gia_ban", nullable = false)
    private Double sellingPrice;

    @Column(name = "ngay_nhap", nullable = false)
    private LocalDateTime importDate;

}

