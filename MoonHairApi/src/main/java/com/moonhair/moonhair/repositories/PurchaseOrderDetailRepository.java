package com.moonhair.moonhair.repositories;

import com.moonhair.moonhair.entities.PurchaseOrderDetailEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PurchaseOrderDetailRepository extends JpaRepository<PurchaseOrderDetailEntity, Integer> {
    // Thêm phương thức query nếu cần
}

