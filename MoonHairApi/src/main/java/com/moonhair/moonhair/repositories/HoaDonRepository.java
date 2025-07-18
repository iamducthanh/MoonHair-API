package com.moonhair.moonhair.repositories;

import com.moonhair.moonhair.dto.DashboardDto;
import com.moonhair.moonhair.dto.MonthlyRevenueDto;
import com.moonhair.moonhair.dto.TopEmployeeRevenueDto;
import com.moonhair.moonhair.entities.HoaDonEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.awt.print.Pageable;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface HoaDonRepository extends JpaRepository<HoaDonEntity, Long>, HoaDonRepositoryCustom {
    Optional<HoaDonEntity> findByMaHoaDon(String maHoaDon);
    @Query("SELECT DISTINCT YEAR(h.ngayHoaDon), MONTH(h.ngayHoaDon) " +
            "FROM HoaDonEntity h WHERE h.ngayHoaDon IS NOT NULL " +
            "ORDER BY YEAR(h.ngayHoaDon) DESC, MONTH(h.ngayHoaDon) DESC")
    List<Object[]> findDistinctMonthAndYear();

    @Query("SELECT COALESCE(SUM(h.tongTien), 0) FROM HoaDonEntity h WHERE DATE(h.ngayHoaDon) = CURRENT_DATE")
    Long getTodayRevenue();

    @Query("SELECT COALESCE(SUM(h.tongTien), 0) FROM HoaDonEntity h WHERE DATE(h.ngayHoaDon) = :date")
    Long getRevenueByDate(@Param("date") LocalDate date);

    @Query("SELECT COUNT(h) FROM HoaDonEntity h WHERE DATE(h.ngayHoaDon) = :date")
    Long countInvoicesByDate(@Param("date") LocalDate date);

    @Query(value = """
        SELECT DATE(h.ngay_hoa_don) AS ngay, SUM(h.tong_tien) AS doanhThu
        FROM hoa_don h
        WHERE MONTH(h.ngay_hoa_don) = MONTH(CURDATE())
          AND YEAR(h.ngay_hoa_don) = YEAR(CURDATE())
        GROUP BY DATE(h.ngay_hoa_don)
        ORDER BY doanhThu DESC
        LIMIT 1
        """, nativeQuery = true)
    Object[] getTopRevenueDayOfMonth();

    @Query(value = """
    SELECT 
        MONTH(h.ngay_hoa_don) AS month,
        SUM(h.tong_tien) AS revenue
    FROM hoa_don h
    WHERE YEAR(h.ngay_hoa_don) = :year
    GROUP BY MONTH(h.ngay_hoa_don)
    ORDER BY MONTH(h.ngay_hoa_don)
""", nativeQuery = true)
    List<Object[]> getMonthlyRevenue(@Param("year") int year);

    @Query(value = """
    SELECT SUM(hdct.thanh_tien)
    FROM hoa_don_chi_tiet hdct
    JOIN hoa_don hd ON hdct.hoa_don_id = hd.id
    WHERE hdct.loai IS NULL
      AND MONTH(hd.ngay_hoa_don) = MONTH(CURDATE())
      AND YEAR(hd.ngay_hoa_don) = YEAR(CURDATE())
    """, nativeQuery = true)
    Long getThisMonthChemicalRevenue();



}
