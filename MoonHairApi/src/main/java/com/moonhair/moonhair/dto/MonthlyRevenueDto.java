package com.moonhair.moonhair.dto;

import lombok.Data;

@Data
public class MonthlyRevenueDto {
    private int month;
    private long revenue;

    public MonthlyRevenueDto(int month, long revenue) {
        this.month = month;
        this.revenue = revenue;
    }

    // Getters & Setters
}

