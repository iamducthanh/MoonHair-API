package com.moonhair.moonhair.config;

public class MoonHairException extends RuntimeException {
    public MoonHairException(String message) {
        super(message);
    }

    public MoonHairException(String message, Throwable cause) {
        super(message, cause);
    }
}
