package com.moonhair.moonhair.repositories;

import com.moonhair.moonhair.entities.BranchEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BranchRepository extends JpaRepository<BranchEntity, Integer> {
    List<BranchEntity> findByActiveTrue();
}
