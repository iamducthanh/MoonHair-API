package com.moonhair.moonhair.repositories;

import com.moonhair.moonhair.entities.HoaDonChiTietEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HoaDonChiTietRepository extends JpaRepository<HoaDonChiTietEntity, Long> {

}
