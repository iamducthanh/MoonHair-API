package com.moonhair.moonhair.entities;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "hoa_don_chi_tiet")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class HoaDonChiTietEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "ten_khach_san_pham")
    private String tenKhachSanPham;

    @Column(name = "tho_chinh")
    private String thoChinh;

    @Column(name = "tho_phu")
    private String thoPhu;

    @Column(name = "so_luong")
    private Integer soLuong;

    @Column(name = "khach_yc", columnDefinition = "TEXT")
    private String khachYc;

    @Column(name = "don_gia")
    private BigDecimal donGia;

    @Column(name = "thanh_tien")
    private BigDecimal thanhTien;

//    @Column(name = "hoa_don_id")
//    private Long hoaDonId;

    private String loai;

    @ManyToOne
    @JoinColumn(name = "hoa_don_id")
    private HoaDonEntity hoaDon;

    @Column(name = "tho_chinh_ten")
    private String thoChinhTen;

    @Column(name = "tho_phu_ten")
    private String thoPhuTen;

    @Column(name = "ma_san_pham")
    private String maSanPham;


    // Getters & Setters
}

