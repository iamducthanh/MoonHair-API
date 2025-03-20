package com.moonhair.moonhair.api;

import com.moonhair.moonhair.entities.EmployeeEntity;
import com.moonhair.moonhair.service.IEmployeeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employees")
public class EmployeeController {
    private final IEmployeeService employeeService;

    public EmployeeController(IEmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<EmployeeEntity> getEmployeeById(@PathVariable Integer id) {
        return ResponseEntity.ok(employeeService.getEmployeeById(id));
    }

    @GetMapping
    public ResponseEntity<List<EmployeeEntity>> getEmployeeByBranchId(@RequestParam String branchId) {
        return ResponseEntity.ok(employeeService.getAllByBranchId(Integer.valueOf(branchId)));
    }

    @PostMapping
    public ResponseEntity<EmployeeEntity> createEmployee(@RequestBody EmployeeEntity employee) {
        return ResponseEntity.ok(employeeService.createEmployee(employee));
    }

    @PutMapping("/{id}")
    public ResponseEntity<EmployeeEntity> updateEmployee(@PathVariable Integer id, @RequestBody EmployeeEntity employee) {
        return ResponseEntity.ok(employeeService.updateEmployee(id, employee));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEmployee(@PathVariable Integer id) {
        employeeService.deleteEmployee(id);
        return ResponseEntity.noContent().build();
    }
}
