package com.moonhair.moonhair.constant;

public enum ProductType {
    HOA_CHAT("Hóa chất"),
    SAN_PHAM("Sản phẩm"),
    DICH_VU("Dịch vụ");

    private final String ten;

    ProductType(String ten) {
        this.ten = ten;
    }

    public String getTen() {
        return ten;
    }

}
