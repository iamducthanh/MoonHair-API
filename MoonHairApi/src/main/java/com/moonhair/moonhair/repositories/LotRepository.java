package com.moonhair.moonhair.repositories;

import com.moonhair.moonhair.entities.LotEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface LotRepository extends JpaRepository<LotEntity, Integer> {
    @Query("SELECT COALESCE(MAX(CAST(SUBSTRING(l.lotCode, LENGTH(l.lotCode) - 2, 3) AS integer)), 0) " +
            "FROM LotEntity l " +
            "WHERE l.lotCode LIKE CONCAT('SP', LPAD(CAST(:productId AS string), 3, '0'), '-', :date, '-%')")
    int findMaxIndexByProductAndDate(@Param("productId") Integer productId, @Param("date") String date);

}
