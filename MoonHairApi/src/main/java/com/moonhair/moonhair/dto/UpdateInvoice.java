package com.moonhair.moonhair.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UpdateInvoice {
    private String trangThai; // ví dụ "100" hoặc "82"
    private Boolean isDelete; // ví dụ "100" hoặc "82"
}
