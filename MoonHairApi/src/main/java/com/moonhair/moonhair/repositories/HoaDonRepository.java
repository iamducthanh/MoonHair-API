package com.moonhair.moonhair.repositories;

import com.moonhair.moonhair.entities.HoaDonEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface HoaDonRepository extends JpaRepository<HoaDonEntity, Long> {
    @Query("""
        SELECT hd FROM HoaDonEntity hd
        WHERE hd.ngayTao BETWEEN :from AND :to
        ORDER BY hd.ngayTao DESC
    """)
    List<HoaDonEntity> findByNgayTaoBetween(
            @Param("from") LocalDateTime from,
            @Param("to") LocalDateTime to
    );
}
