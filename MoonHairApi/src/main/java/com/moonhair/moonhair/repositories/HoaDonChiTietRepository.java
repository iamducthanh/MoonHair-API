package com.moonhair.moonhair.repositories;

import com.moonhair.moonhair.dto.HoaDonChiTiet;
import com.moonhair.moonhair.entities.HoaDonChiTietEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HoaDonChiTietRepository extends JpaRepository<HoaDonChiTietEntity, Long> {
    @Query("SELECT h FROM HoaDonChiTietEntity h WHERE (h.hoaDon.isDelete is null or h.hoaDon.isDelete = false) AND MONTH(h.hoaDon.ngayTao) = :thang AND YEAR(h.hoaDon.ngayTao) = :nam AND " +
            "(LOWER(h.thoChinh) = LOWER(:maTho) OR LOWER(h.thoPhu) = LOWER(:maTho))")
    List<HoaDonChiTietEntity> findByThangAndNhanVien(@Param("thang") int thang, @Param("nam") int nam, @Param("maTho") String maTho);

}
