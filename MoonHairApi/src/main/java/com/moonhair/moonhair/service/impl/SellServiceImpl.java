package com.moonhair.moonhair.service.impl;

import com.moonhair.moonhair.dto.ProductList;
import com.moonhair.moonhair.entities.ProductEntity;
import com.moonhair.moonhair.repositories.ProductRepository;
import com.moonhair.moonhair.service.ISellService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SellServiceImpl implements ISellService {
    private final ProductRepository productRepository;

    public SellServiceImpl(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }


    @Override
    public List<ProductList> getAllProductToSell(Integer branchId) {
        return productRepository.findAllProductListToSell(branchId);
    }

    @Override
    public List<ProductEntity> getAllServiceToSell(Integer branchId) {
        return productRepository.findAllProductService(branchId);
    }
}
