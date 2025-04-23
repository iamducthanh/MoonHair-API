package com.moonhair.moonhair.repositories;

import com.moonhair.moonhair.entities.PurchaseOrderEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PurchaseOrderRepository extends JpaRepository<PurchaseOrderEntity, Integer> {
    // Bạn có thể thêm các phương thức custom nếu cần tìm kiếm hoặc xử lý đặc biệt cho PurchaseOrder
}

