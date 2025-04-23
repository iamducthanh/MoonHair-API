package com.moonhair.moonhair.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductSearch {
    private Integer id;
    private String productName;
    private String size;
    private Double quantityRemaining;
    private String productCode;

    public ProductSearch(Integer id, String productName, String size, Double quantityRemaining) {
        this.id = id;
        this.productName = productName;
        this.size = size;
        this.quantityRemaining = quantityRemaining;
        this.productCode = String.format("SP%03d", id);
    }
}
