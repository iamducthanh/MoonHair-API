package com.moonhair.moonhair.repositories;

import com.moonhair.moonhair.dto.ProductList;
import com.moonhair.moonhair.dto.PurchaseOrderResponse;
import com.moonhair.moonhair.entities.PurchaseOrderEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PurchaseOrderRepository extends JpaRepository<PurchaseOrderEntity, Integer> {
    List<PurchaseOrderEntity> findAllByBranchId(Integer branchId);

    @Query("SELECT po, pod FROM PurchaseOrderEntity po " +
            "LEFT JOIN PurchaseOrderDetailEntity pod ON po.id = pod.purchaseOrderId where po.branchId = ?1 order by po.createdAt desc")
    List<Object[]> findAllPurchaseOrdersWithDetails(Integer branchId);


}

