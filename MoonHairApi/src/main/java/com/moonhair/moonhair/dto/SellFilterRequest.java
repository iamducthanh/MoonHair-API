package com.moonhair.moonhair.dto;

import lombok.Data;

import java.util.List;

@Data
public class SellFilterRequest {
    private Boolean isToday; // Ví dụ: "28/06/2025" khi chọn hôm nay
    private String fromDate; // Ví dụ: "2025-06-20"
    private String toDate;
    private String customerName;
    private List<String> trangThaiList;     // ["100", "82"]
    private List<String> phuongThucList;    // ["TIEN_MAT", "CHUYEN_KHOAN"]
}
