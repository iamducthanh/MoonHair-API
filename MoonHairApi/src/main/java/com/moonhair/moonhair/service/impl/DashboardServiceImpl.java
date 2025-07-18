package com.moonhair.moonhair.service.impl;

import com.moonhair.moonhair.dto.DashboardDto;
import com.moonhair.moonhair.dto.MonthlyRevenueDto;
import com.moonhair.moonhair.dto.TopEmployeeRevenueDto;
import com.moonhair.moonhair.repositories.HoaDonChiTietRepository;
import com.moonhair.moonhair.repositories.HoaDonRepository;
import com.moonhair.moonhair.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class DashboardServiceImpl implements DashboardService {
    @Autowired
    private HoaDonRepository hoaDonRepository;
    @Autowired
    private HoaDonChiTietRepository hoaDonChiTietRepository;

    @Override
    public DashboardDto getDashboard() {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");

        LocalDate today = LocalDate.now();
        LocalDate yesterday = today.minusDays(1);

        Long todayRevenue = hoaDonRepository.getRevenueByDate(today);
        Long yesterdayRevenue = hoaDonRepository.getRevenueByDate(yesterday);

        double percentChange = 0;
        if (yesterdayRevenue > 0) {
            percentChange = ((double)(todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100;
        } else if (todayRevenue > 0) {
            percentChange = 100;
        }

        DashboardDto dashboardDto = new DashboardDto();
        dashboardDto.setTodayRevenue(todayRevenue);
        dashboardDto.setYesterdayRevenue(yesterdayRevenue);
        dashboardDto.setPercentChange((long) (Math.round(percentChange * 100.0) / 100.0));

        Long totalInvoicesToday = hoaDonRepository.countInvoicesByDate(today);
        Long totalInvoicesYesterday = hoaDonRepository.countInvoicesByDate(yesterday);
        Double invoiceCountChange = 0.0;
        if (totalInvoicesYesterday != null && totalInvoicesYesterday > 0) {
            invoiceCountChange = ((double)(totalInvoicesToday - totalInvoicesYesterday) / totalInvoicesYesterday) * 100;
        }
        dashboardDto.setTotalInvoicesToday(totalInvoicesToday);
        dashboardDto.setTotalInvoicesYesterday(totalInvoicesYesterday);
        dashboardDto.setInvoiceCountPercentChange(Math.round(invoiceCountChange * 100.0) / 100.0);

        Object[] result = hoaDonRepository.getTopRevenueDayOfMonth();
        LocalDate ngay = LocalDate.now();
        Long doanhThu = 0L;
        if (result != null && result.length > 0) {
            Object[] result1 = (Object[]) result[0];
            if (result1 != null && result1.length > 1) {
                if (result1[0] != null && result1[1] != null) {
                    ngay = LocalDate.parse(result1[0].toString());
                    doanhThu = ((Number) result1[1]).longValue();
                }
            }
        }
        dashboardDto.setNgay(ngay.format(formatter));
        dashboardDto.setDoanhThu(doanhThu);

        dashboardDto.setMonthlyRevenues(getMonthlyRevenue(LocalDate.now().getYear()));

        Long rawRevenue = hoaDonRepository.getThisMonthChemicalRevenue();
        long revenue = rawRevenue != null ? rawRevenue : 0L;
        dashboardDto.setDoanhThuHoaChat(revenue);

        List<Object[]> results = hoaDonChiTietRepository.findTopThoRevenueThisMonth();
        List<TopEmployeeRevenueDto> top = results.stream()
                .map(obj -> new TopEmployeeRevenueDto(
                        ((String) obj[0]),
                        (String) obj[1],
                        ((Number) obj[2]).longValue(),
                        ((Number) obj[3]).longValue(),
                        ((Number) obj[4]).longValue(),
                        ((Number) obj[5]).doubleValue()
                ))
                .toList();

        dashboardDto.setTop5nv(top);
        return dashboardDto;
    }

    public List<MonthlyRevenueDto> getMonthlyRevenue(int year) {
        List<Object[]> rawList = hoaDonRepository.getMonthlyRevenue(year);
        return rawList.stream()
                .map(obj -> new MonthlyRevenueDto(
                        ((Integer) obj[0]),      // month
                        ((BigDecimal) obj[1]).longValue() // revenue
                ))
                .collect(Collectors.toList());
    }
}
