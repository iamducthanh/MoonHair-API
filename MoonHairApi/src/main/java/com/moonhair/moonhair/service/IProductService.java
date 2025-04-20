package com.moonhair.moonhair.service;

import com.moonhair.moonhair.dto.ProductList;
import com.moonhair.moonhair.dto.ProductRequest;
import com.moonhair.moonhair.entities.EmployeeEntity;
import com.moonhair.moonhair.entities.ProductEntity;

import java.util.List;

public interface IProductService {
    List<ProductEntity> getAllProductByBranch(Integer branchId);
    List<ProductList> getAllProductListByBranch(Integer branchId);
    ProductEntity createProduct(ProductRequest productRequest);
    ProductEntity updateProduct(ProductRequest productRequest);
    ProductEntity deleteProduct(Integer id);
    List<ProductEntity> searchProduct(String key);
}
