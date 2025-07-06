package com.moonhair.moonhair.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class BangLuongDTO {
    private String tenNhanVien;
    private String maNhanVien;
    private String loaiNhanVien; // Thợ chính, phụ, ...
    private BigDecimal luongCoBan;
    private BigDecimal doanhThu;
    private BigDecimal tongHoaHong;
    private BigDecimal tongLuong;
    private List<HoaDonThamGiaDTO> hoaDons;
}

