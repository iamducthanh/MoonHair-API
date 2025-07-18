package com.moonhair.moonhair.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DashboardDto {
    private Long todayRevenue;
    private Long yesterdayRevenue;
    private Long percentChange;

    private Long totalInvoicesToday;
    private Long totalInvoicesYesterday;
    private Double invoiceCountPercentChange;

    private String ngay;
    private Long doanhThu;
    private Long doanhThuHoaChat;
    List<TopEmployeeRevenueDto> top5nv;

    List<MonthlyRevenueDto> monthlyRevenues;

    public DashboardDto(String ngay, Long doanhThu) {
        this.ngay = ngay;
        this.doanhThu = doanhThu;
    }
}
