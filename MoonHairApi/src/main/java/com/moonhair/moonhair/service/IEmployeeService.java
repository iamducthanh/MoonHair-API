package com.moonhair.moonhair.service;

import com.moonhair.moonhair.dto.BangLuongDTO;
import com.moonhair.moonhair.entities.EmployeeEntity;

import java.util.List;

public interface IEmployeeService {
    List<EmployeeEntity> getAllEmployees();
    List<EmployeeEntity> getAllByBranchId(Integer branchId);
    EmployeeEntity getEmployeeById(Integer id);
    EmployeeEntity createEmployee(EmployeeEntity employee);
    EmployeeEntity updateEmployee(Integer id, EmployeeEntity employee);
    void deleteEmployee(Integer id);
    List<BangLuongDTO> getBangLuong(int thang, int nam, int idChiNhanh);
}
