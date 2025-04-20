package com.moonhair.moonhair.repositories;

import com.moonhair.moonhair.dto.ProductList;
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
    @Query("SELECT sp FROM ProductEntity sp WHERE LOWER(sp.name) LIKE LOWER(CONCAT('%', :keyword, '%')) and sp.productType = 'SAN_PHAM'")
    List<ProductEntity> searchByKeyword(@Param("keyword") String keyword, Pageable pageable);
    @Query("select new com.moonhair.moonhair.dto.ProductList(o.id, o.name) from ProductEntity o left join LotEntity a on o.id = a.productId where o.branchId = ?1")
    List<ProductList> findAllProductListByBranch(Integer branchId);
}
