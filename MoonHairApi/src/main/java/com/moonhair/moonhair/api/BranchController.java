package com.moonhair.moonhair.api;

import com.moonhair.moonhair.entities.BranchEntity;
import com.moonhair.moonhair.service.IBranchService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/branches")
public class BranchController {
    private final IBranchService branchService;

    public BranchController(IBranchService branchService) {
        this.branchService = branchService;
    }

    @GetMapping
    public ResponseEntity<List<BranchEntity>> getAllBranches() {
        return ResponseEntity.ok(branchService.getAllBranches());
    }

    @GetMapping("/{id}")
    public ResponseEntity<BranchEntity> getBranchById(@PathVariable Integer id) {
        return ResponseEntity.ok(branchService.getBranchById(id));
    }

    @PostMapping
    public ResponseEntity<BranchEntity> createBranch(@RequestBody BranchEntity branch) {
        return ResponseEntity.ok(branchService.createBranch(branch));
    }

    @PutMapping("/{id}")
    public ResponseEntity<BranchEntity> updateBranch(@PathVariable Integer id, @RequestBody BranchEntity branch) {
        return ResponseEntity.ok(branchService.updateBranch(id, branch));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBranch(@PathVariable Integer id) {
        branchService.deleteBranch(id);
        return ResponseEntity.noContent().build();
    }
}
