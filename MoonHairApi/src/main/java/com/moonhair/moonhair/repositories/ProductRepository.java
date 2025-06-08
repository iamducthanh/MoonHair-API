package com.moonhair.moonhair.repositories;

import com.moonhair.moonhair.dto.ProductList;
import com.moonhair.moonhair.dto.ProductSearch;
import com.moonhair.moonhair.entities.ProductEntity;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<ProductEntity, Integer> {
    List<ProductEntity> findAllByBranchIdAndDeleteFlagIsFalse(Integer branchId);
    @Query("select new com.moonhair.moonhair.dto.ProductSearch(o.id, o.name, o.size, CAST(COALESCE(SUM(a.quantityRemaining), 0) AS double)) from ProductEntity o left join LotEntity a on o.id = a.productId where LOWER(o.name) LIKE LOWER(CONCAT('%', ?1, '%')) and o.branchId = ?2 and o.productType = 'SAN_PHAM' and o.deleteFlag = false GROUP BY o.id, o.name, o.size")
    List<ProductSearch> searchByKeyword(String keyword, Integer branchId, Pageable pageable);
    @Query("select new com.moonhair.moonhair.dto.ProductList(o.id, o.name, a.id, a.lotCode, o.size, a.costPrice, a.sellingPrice, a.quantityImported, a.quantityRemaining, a.importDate, o.active) from ProductEntity o left join LotEntity a on o.id = a.productId where o.branchId = ?1 and o.productType = 'SAN_PHAM' and o.deleteFlag = false")
    List<ProductList> findAllProductListByBranch(Integer branchId);
    @Query("select new com.moonhair.moonhair.dto.ProductList(o.id, o.name, a.id, a.lotCode, o.size, a.costPrice, a.sellingPrice, a.quantityImported, a.quantityRemaining, a.importDate, o.active, o.productType) from ProductEntity o left join LotEntity a on o.id = a.productId where o.branchId = ?1 and o.productType = 'SAN_PHAM' and o.deleteFlag = false and o.active = true and a.sellingPrice is not null")
    List<ProductList> findAllProductListToSell(Integer branchId);
    @Query("select o from ProductEntity o where o.active = true and o.productType = 'DICH_VU' and o.deleteFlag = false and o.branchId = ?1")
    List<ProductEntity> findAllProductService(Integer branchId);
}

