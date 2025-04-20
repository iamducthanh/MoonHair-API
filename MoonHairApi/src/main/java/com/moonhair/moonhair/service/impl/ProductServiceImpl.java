package com.moonhair.moonhair.service.impl;

import com.moonhair.moonhair.constant.ProductType;
import com.moonhair.moonhair.dto.ProductList;
import com.moonhair.moonhair.dto.ProductRequest;
import com.moonhair.moonhair.entities.ProductEntity;
import com.moonhair.moonhair.repositories.ProductRepository;
import com.moonhair.moonhair.service.IProductService;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductServiceImpl implements IProductService {
    private final ProductRepository productRepository;

    public ProductServiceImpl(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Override
    public List<ProductEntity> getAllProductByBranch(Integer branchId) {
        return productRepository.findAllByBranchIdAndDeleteFlagIsFalse(branchId);
    }

    @Override
    public List<ProductList> getAllProductListByBranch(Integer branchId) {
        return productRepository.findAllProductListByBranch(branchId);
    }

    @Override
    public ProductEntity createProduct(ProductRequest productRequest) {
        ProductEntity sp = ProductEntity.builder()
                .name(productRequest.getName())
                .price(productRequest.getPrice())
                .productType(ProductType.valueOf(productRequest.getProductType()))
                .size(productRequest.getSize())
                .note(productRequest.getNote())
                .active(productRequest.getActive())
                .branchId(productRequest.getBranchId())
                .deleteFlag(false)
                .build();
        return productRepository.save(sp);    }

    @Override
    public ProductEntity updateProduct(ProductRequest productRequest) {
        ProductEntity sp = productRepository.findById(productRequest.getId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm"));

        sp.setName(productRequest.getName());
        sp.setPrice(productRequest.getPrice());
        sp.setSize(productRequest.getSize());
        sp.setNote(productRequest.getNote());
        sp.setProductType(ProductType.valueOf(productRequest.getProductType())); // Enum từ String
        sp.setActive(productRequest.getActive());
        return productRepository.save(sp);
    }

    @Override
    public ProductEntity deleteProduct(Integer id) {
        ProductEntity sp = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm"));
        sp.setDeleteFlag(true);
        return productRepository.save(sp);       }

    @Override
    public List<ProductEntity> searchProduct(String key) {
        Pageable topTen = PageRequest.of(0, 10); // Page 0, size 10
        return productRepository.searchByKeyword(key, topTen);
    }
}
