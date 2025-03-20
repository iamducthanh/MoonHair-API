package com.moonhair.moonhair.service.impl;

import com.moonhair.moonhair.entities.BranchEntity;
import com.moonhair.moonhair.repositories.BranchRepository;
import com.moonhair.moonhair.service.IBranchService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BranchServiceImpl implements IBranchService {

    private final BranchRepository branchRepository;

    public BranchServiceImpl(BranchRepository branchRepository) {
        this.branchRepository = branchRepository;
    }

    @Override
    public List<BranchEntity> getAllBranches() {
        return branchRepository.findByActiveTrue();
    }

    @Override
    public BranchEntity getBranchById(Integer id) {
        return branchRepository.findById(id).orElseThrow(() -> new RuntimeException("Branch not found"));
    }

    @Override
    public BranchEntity createBranch(BranchEntity branch) {
        return branchRepository.save(branch);
    }

    @Override
    public BranchEntity updateBranch(Integer id, BranchEntity branch) {
        Optional<BranchEntity> existingBranch = branchRepository.findById(id);
        if (existingBranch.isPresent()) {
            BranchEntity updatedBranch = existingBranch.get();
            updatedBranch.setName(branch.getName());
            updatedBranch.setAddress(branch.getAddress());
            updatedBranch.setActive(branch.getActive());
            return branchRepository.save(updatedBranch);
        }
        throw new RuntimeException("Branch not found");
    }

    @Override
    public void deleteBranch(Integer id) {
        branchRepository.deleteById(id);
    }
}
