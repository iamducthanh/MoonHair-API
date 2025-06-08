package com.moonhair.moonhair.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Sell {
    private Long idHoaDon;
    private String phuongThucThanhToan;
    private Double tongTien;
    private Double tongTienThanhToan;
    private Double giamGia;
    private String tenKhachHang;
    private Long idChiNhanh;
    private List<SellDetail> productList;
}