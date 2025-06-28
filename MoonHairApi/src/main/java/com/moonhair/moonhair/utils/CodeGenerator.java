package com.moonhair.moonhair.utils;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class CodeGenerator {
    public static String generatePurchaseOrderCode() {
        // Lấy thời gian hiện tại
        LocalDateTime now = LocalDateTime.now();

        // Định dạng thời gian theo kiểu "ddMMyyyy-HHmmss"
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("ddMMyyyy-HHmmss");
        String formattedDate = now.format(formatter);

        // Tạo mã phiếu
        return "PN-" + formattedDate;
    }

    public static String generateLotCode(Integer productId, String date, int currentMaxIndex) {
        String productCode = String.format("SP%03d", productId); // SPxxx
        int nextIndex = currentMaxIndex + 1; // Tăng index
        return productCode + "-" + date + "-" + String.format("%03d", nextIndex); // SPxxx-ddMMyyyy-xxx
    }

    public static String getInitials(String input) {
        StringBuilder result = new StringBuilder();
        // Tách từ bằng khoảng trắng
        String[] words = input.trim().split("\\s+");
        for (String word : words) {
            if (!word.isEmpty()) {
                // Lấy ký tự đầu và viết hoa
                result.append(Character.toUpperCase(word.charAt(0)));
            }
        }
        return result.toString();
    }


}
