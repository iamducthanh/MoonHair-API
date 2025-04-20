package com.moonhair.moonhair.dto;

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
    private String lotCode;
    private Double costPrice;
    private Double priceOut;
    private Integer quantityRemaining;
    private Integer quantityImported;
    private LocalDateTime importDate;
    private Boolean status;

    public ProductList(Integer id, String productName) {
        this.id = id;
        this.productName = productName;
    }
}
