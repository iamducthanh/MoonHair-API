package com.moonhair.moonhair.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class HoaDonThamGiaDTO {
    private String maHoaDon;
    private LocalDate ngay;
    private String vaiTro; // Thợ chính, phụ
    private BigDecimal tongTien;
    private int phanTram;
    private BigDecimal hoaHong;
}

