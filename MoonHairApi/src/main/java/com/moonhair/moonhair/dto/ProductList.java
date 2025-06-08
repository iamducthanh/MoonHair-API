package com.moonhair.moonhair.dto;

import com.moonhair.moonhair.constant.ProductType;
import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductList {
    private String productName;
    private Integer id;
    private String productCode;
    private Integer lotId;
    private String lotCode;
    private String size;
    private Double costPrice;
    private Double priceOut;
    private Integer quantityRemaining;
    private Integer quantityImported;
    private LocalDateTime importDate;
    private Boolean status;
    private ProductType productType;

    public ProductList(Integer id, String productName, Integer lotId, String lotCode, String size, Double costPrice, Double sellingPrice, Integer quantityImported, Integer quantityRemaining, LocalDateTime importDate, Boolean active, ProductType productType) {
        this.id = id;
        this.productName = productName;
        this.lotId = lotId;
        this.lotCode = lotCode;
        this.size = size;
        this.costPrice = costPrice;
        this.priceOut = sellingPrice;
        this.quantityRemaining = quantityRemaining;
        this.quantityImported = quantityImported;
        this.importDate = importDate;
        this.status = active;
        this.productCode = String.format("SP%03d", id);
        this.productType = productType;
    }

    public ProductList(Integer id, String productName, Integer lotId, String lotCode, String size, Double costPrice, Double sellingPrice, Integer quantityImported, Integer quantityRemaining, LocalDateTime importDate, Boolean active) {
        this.id = id;
        this.productName = productName;
        this.lotId = lotId;
        this.lotCode = lotCode;
        this.size = size;
        this.costPrice = costPrice;
        this.priceOut = sellingPrice;
        this.quantityRemaining = quantityRemaining;
        this.quantityImported = quantityImported;
        this.importDate = importDate;
        this.status = active;
        this.productCode = String.format("SP%03d", id);
    }
}
