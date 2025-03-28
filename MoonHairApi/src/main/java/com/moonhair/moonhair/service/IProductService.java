package com.moonhair.moonhair.service;

import com.moonhair.moonhair.dto.ProductRequest;
import com.moonhair.moonhair.entities.ProductEntity;

import java.util.List;

public interface IProductService {
    List<ProductEntity> getAllProductByBranch(Integer branchId);
    ProductEntity createProduct(ProductRequest productRequest);
    ProductEntity updateProduct(ProductRequest productRequest);
    ProductEntity deleteProduct(Integer id);
}
