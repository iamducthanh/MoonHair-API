package com.moonhair.moonhair.repositories;

import com.moonhair.moonhair.entities.HoaDonEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HoaDonRepository extends JpaRepository<HoaDonEntity, Long> {
    // Thêm custom query nếu cần, ví dụ:
    // List<HoaDon> findByTenKhach(String tenKhach);
}
