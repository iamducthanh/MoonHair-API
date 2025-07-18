package com.moonhair.moonhair.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class HoaDon {
    private String maHoaDon;
    private String tenKhachHang;
    private String phuongThuc;
    private String thoiGian;
    private BigDecimal tongTien;
    private BigDecimal giamGia;
    private BigDecimal khachDaTra;
    private String trangThai;
    private String trangThaiCode;
    private String chiNhanh;
    private Long maChiNhanh;
    private String nguoiTao;
    private Integer tongSoLuong;
    private List<HoaDonChiTiet> hoaDonChiTiets;


    private BigDecimal tongDoanhThu;
    private BigDecimal tongTienMat;
    private BigDecimal tongChuyenKhoan;
}
