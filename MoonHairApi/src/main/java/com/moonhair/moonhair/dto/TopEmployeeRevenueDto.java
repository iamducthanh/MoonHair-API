package com.moonhair.moonhair.dto;

import lombok.Data;

@Data
public class TopEmployeeRevenueDto {
    private String thoChinhId;
    private String tenTho;
    private Long tongDoanhThu;
    private Long soHoaDon;
    private Long soLuongDichVu;
    private Double doanhThuTrungBinh;

    public TopEmployeeRevenueDto(String thoChinhId, String tenTho, Long tongDoanhThu,
                                 Long soHoaDon, Long soLuongDichVu, Double doanhThuTrungBinh) {
        this.thoChinhId = thoChinhId;
        this.tenTho = tenTho;
        this.tongDoanhThu = tongDoanhThu;
        this.soHoaDon = soHoaDon;
        this.soLuongDichVu = soLuongDichVu;
        this.doanhThuTrungBinh = doanhThuTrungBinh;
    }

    // Getters and setters...
}

