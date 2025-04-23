package com.moonhair.moonhair.api;

import com.moonhair.moonhair.dto.ProductList;
import com.moonhair.moonhair.dto.ProductRequest;
import com.moonhair.moonhair.dto.ProductSearch;
import com.moonhair.moonhair.entities.ProductEntity;
import com.moonhair.moonhair.service.IProductService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {
    private final IProductService productService;

    public ProductController(IProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public List<ProductEntity> getAllProductByBranch(@RequestParam Integer branchId) {
        return productService.getAllProductByBranch(branchId);
    }

    @GetMapping("/list")
    public List<ProductList> getAllProductListByBranch(@RequestParam Integer branchId) {
        return productService.getAllProductListByBranch(branchId);
    }

    @PostMapping
    public ResponseEntity<?> create(@Valid @RequestBody ProductRequest request) {
        ProductEntity created = productService.createProduct(request);
        return ResponseEntity.ok(created);
    }

    @PutMapping
    public ResponseEntity<?> update(@Valid @RequestBody ProductRequest dto) {
        try {
            ProductEntity updated = productService.updateProduct(dto);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Integer id) {
        try {
            ProductEntity deleteProduct = productService.deleteProduct(id);
            return ResponseEntity.ok(deleteProduct);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/search")
    public ResponseEntity<List<ProductSearch>> searchSanPham(@RequestParam("keyword") String keyword, @RequestParam("branchId") String branchId) {
        List<ProductSearch> result = productService.searchProduct(keyword, branchId);
        return ResponseEntity.ok(result);
    }
}
