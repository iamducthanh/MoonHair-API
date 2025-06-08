package com.moonhair.moonhair.constant;

import java.util.Objects;

public enum PaymentStatus {
    COMPLETED("100", "Hoàn thành"),
    PENDING_TRANSFER("82", "Chờ chuyển khoản");

    private final String code;
    private final String description;

    PaymentStatus(String code, String description) {
        this.code = code;
        this.description = description;
    }

    public String getCode() {
        return code;
    }

    public String getDescription() {
        return description;
    }

    public static PaymentStatus fromCode(String code) {
        for (PaymentStatus status : PaymentStatus.values()) {
            if (Objects.equals(status.code, code)) {
                return status;
            }
        }
        throw new IllegalArgumentException("Unknown payment status code: " + code);
    }
}
