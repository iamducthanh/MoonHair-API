package com.moonhair.moonhair.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class HoaDonChiTiet {
    private String maHangHoa;
    private String tenHang;
    private Integer soLuong;
    private BigDecimal donGia;
    private BigDecimal thanhTien;
    private String thoChinh;
    private String thoPhu;
    private Long idHoaDonChiTiet;
}
