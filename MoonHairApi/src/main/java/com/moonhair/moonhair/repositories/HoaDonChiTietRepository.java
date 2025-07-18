package com.moonhair.moonhair.repositories;

import com.moonhair.moonhair.dto.HoaDonChiTiet;
import com.moonhair.moonhair.dto.TopEmployeeRevenueDto;
import com.moonhair.moonhair.entities.HoaDonChiTietEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HoaDonChiTietRepository extends JpaRepository<HoaDonChiTietEntity, Long> {
    @Query("SELECT h FROM HoaDonChiTietEntity h WHERE h.hoaDon.trangThaiThanhToan = '100' AND (h.hoaDon.isDelete is null or h.hoaDon.isDelete = false) AND MONTH(h.hoaDon.ngayHoaDon) = :thang AND YEAR(h.hoaDon.ngayHoaDon) = :nam AND " +
            "(LOWER(h.thoChinh) = LOWER(:maTho) OR LOWER(h.thoPhu) = LOWER(:maTho))")
    List<HoaDonChiTietEntity> findByThangAndNhanVien(@Param("thang") int thang, @Param("nam") int nam, @Param("maTho") String maTho);

    @Query(value = """
                SELECT 
                    hdc.tho_chinh AS thoChinhId,
                    nv.ten AS tenTho,
                    SUM(hdc.thanh_tien) AS tongDoanhThu,
                    COUNT(DISTINCT hd.id) AS soHoaDon,
                    COUNT(*) AS soLuongDichVu,
                    ROUND(SUM(hdc.thanh_tien) / COUNT(DISTINCT hd.id), 2) AS doanhThuTrungBinh
                FROM hoa_don_chi_tiet hdc
                JOIN hoa_don hd ON hd.id = hdc.hoa_don_id
                JOIN nhan_vien nv ON nv.id = hdc.tho_chinh
                WHERE MONTH(hd.ngay_hoa_don) = MONTH(CURDATE())
                  AND YEAR(hd.ngay_hoa_don) = YEAR(CURDATE())
                GROUP BY hdc.tho_chinh, nv.ten
                ORDER BY tongDoanhThu DESC
                LIMIT 5
""", nativeQuery = true)
    List<Object[]> findTopThoRevenueThisMonth();

}

