package com.moonhair.moonhair.api;

import com.moonhair.moonhair.dto.BangLuongDTO;
import com.moonhair.moonhair.entities.EmployeeEntity;
import com.moonhair.moonhair.service.IEmployeeService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

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

    @GetMapping("/luong")
    public ResponseEntity<?> getBangLuong(
            @RequestParam int thang,
            @RequestParam int nam,
            @RequestParam int idChiNhanh) {
        List<BangLuongDTO> list = employeeService.getBangLuong(thang, nam, idChiNhanh);
        return ResponseEntity.ok(list);
    }

    @GetMapping("/me")
    public Map<String, Object> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        List<String> authorities = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());
        return Map.of(
                "username", username,
                "permissions", authorities
        );
    }

}
