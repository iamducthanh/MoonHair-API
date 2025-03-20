package com.moonhair.moonhair.service;

import com.moonhair.moonhair.entities.BranchEntity;

import java.util.List;

public interface IBranchService {
    List<BranchEntity> getAllBranches();

    BranchEntity getBranchById(Integer id);

    BranchEntity createBranch(BranchEntity branch);

    BranchEntity updateBranch(Integer id, BranchEntity branch);

    void deleteBranch(Integer id);
}
