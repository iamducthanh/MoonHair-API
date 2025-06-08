package com.moonhair.moonhair.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SellDetail {
    private String thoChinh;
    private String thoPhu;
    private String productType;
    private String productCode;
    private Integer soLuong;
    private Double donGia;
    private String name;
    private Integer lotId;
    private String lotCode;
    private Boolean kyc;
}
