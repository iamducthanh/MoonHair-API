package com.moonhair.moonhair.entities;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = "hoa_don")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class HoaDonEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "ten_khach")
    private String tenKhach;

    @Column(name = "tong_tien")
    private BigDecimal tongTien;

    @Column(name = "giam_gia")
    private BigDecimal giamGia;

    @Column(name = "tong_tien_thanh_toan")
    private BigDecimal tongTienThanhToan;

    @Column(name = "phuong_thuc")
    private String phuongThuc;

}

