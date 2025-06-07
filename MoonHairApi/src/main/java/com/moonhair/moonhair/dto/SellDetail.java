package com.moonhair.moonhair.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SellDetail {
    String thoChinh;
    String thoPhu;
    // dịch vụ
    String productType;
    String productCode;
    Integer soLuong;
    Double donGia;
    String name;
    // sản phẩm
    Integer lotId;
    String lotCode;
    Boolean kyc;
}
