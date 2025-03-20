package com.moonhair.moonhair.service.impl;

import com.moonhair.moonhair.entities.EmployeeEntity;
import com.moonhair.moonhair.repositories.EmployeeRepository;
import com.moonhair.moonhair.service.IEmployeeService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EmployeeServiceImpl implements IEmployeeService {
    private final EmployeeRepository employeeRepository;

    public EmployeeServiceImpl(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    @Override
    public List<EmployeeEntity> getAllEmployees() {
        return employeeRepository.findAll();
    }

    @Override
    public List<EmployeeEntity> getAllByBranchId(Integer branchId) {
        return employeeRepository.findAllByBranchId(branchId);
    }

    @Override
    public EmployeeEntity getEmployeeById(Integer id) {
        return employeeRepository.findById(id).orElseThrow(() -> new RuntimeException("Employee not found"));
    }

    @Override
    public EmployeeEntity createEmployee(EmployeeEntity employee) {
        employee.setActive(true);
        return employeeRepository.save(employee);
    }

    @Override
    public EmployeeEntity updateEmployee(Integer id, EmployeeEntity employee) {
        Optional<EmployeeEntity> existingEmployee = employeeRepository.findById(id);
        if (existingEmployee.isPresent()) {
            EmployeeEntity updatedEmployee = existingEmployee.get();
            updatedEmployee.setName(employee.getName());
            updatedEmployee.setSalaryRate(employee.getSalaryRate());
            updatedEmployee.setBranchId(employee.getBranchId());
            updatedEmployee.setActive(employee.getActive());
            updatedEmployee.setModifiedDate(employee.getModifiedDate());
            return employeeRepository.save(updatedEmployee);
        }
        throw new RuntimeException("Employee not found");
    }

    @Override
    public void deleteEmployee(Integer id) {
        employeeRepository.deleteById(id);
    }
}
