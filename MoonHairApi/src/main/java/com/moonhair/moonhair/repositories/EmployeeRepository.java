package com.moonhair.moonhair.repositories;

import com.moonhair.moonhair.entities.EmployeeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<EmployeeEntity, Integer> {
    List<EmployeeEntity> findAllByBranchId(Integer idChiNhanh);
    Optional<EmployeeEntity> findByUsernameAndActiveIsTrue(String username);
}
