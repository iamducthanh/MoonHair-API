package com.moonhair.moonhair.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductRequest {
    private Integer id;
    @NotBlank
    private String name;
    @NotNull
    private Double price;
    @NotBlank
    private String productType;

    private String size;
    private String note;
    @NotNull
    private Boolean active;
    @NotNull
    private Integer branchId;
}
