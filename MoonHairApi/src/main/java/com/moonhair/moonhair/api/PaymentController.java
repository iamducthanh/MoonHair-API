package com.moonhair.moonhair.api;

import com.moonhair.moonhair.config.Config;
import com.moonhair.moonhair.entities.HoaDonEntity;
import com.moonhair.moonhair.repositories.HoaDonRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.apache.commons.codec.binary.Hex;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.UnsupportedEncodingException;
import java.security.MessageDigest;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.security.NoSuchAlgorithmException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;

import static com.moonhair.moonhair.config.Config.Sha256;
import static com.moonhair.moonhair.config.Config.vnp_HashSecret;

@RestController
@RequestMapping("/payment")
public class PaymentController {
    @Autowired
    private HttpServletRequest req;

    @Autowired
    private HoaDonRepository hoaDonRepository;

    @GetMapping("/create-payment")
    public ResponseEntity<?> createPayment(@RequestParam String orderId, @RequestParam String amountIn) throws Exception {
        String vnp_Version = "2.1.0";
        String vnp_Command = "pay";
        String orderType = "other";
        long amount = Integer.parseInt(req.getParameter("amountIn"))*100;
        String bankCode = req.getParameter("bankCode");
        String vnp_IpAddr = Config.getIpAddress(req);

        String vnp_TmnCode = Config.vnp_TmnCode;

        Map<String, String> vnp_Params = new HashMap<>();
        vnp_Params.put("vnp_Version", vnp_Version);
        vnp_Params.put("vnp_Command", vnp_Command);
        vnp_Params.put("vnp_TmnCode", vnp_TmnCode);
        vnp_Params.put("vnp_Amount", String.valueOf(amount));
        vnp_Params.put("vnp_CurrCode", "VND");

        if (bankCode != null && !bankCode.isEmpty()) {
            vnp_Params.put("vnp_BankCode", bankCode);
        }
        vnp_Params.put("vnp_TxnRef", orderId);
        vnp_Params.put("vnp_OrderInfo", "Thanh_Toan_Don_Hang_" + orderId);
        vnp_Params.put("vnp_OrderType", orderType);

        String locate = req.getParameter("language");
        if (locate != null && !locate.isEmpty()) {
            vnp_Params.put("vnp_Locale", locate);
        } else {
            vnp_Params.put("vnp_Locale", "vn");
        }
        vnp_Params.put("vnp_ReturnUrl", Config.vnp_Returnurl);
        vnp_Params.put("vnp_IpAddr", vnp_IpAddr);

        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        String vnp_CreateDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_CreateDate", vnp_CreateDate);

        cld.add(Calendar.MINUTE, 15);
        String vnp_ExpireDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_ExpireDate", vnp_ExpireDate);

        List fieldNames = new ArrayList(vnp_Params.keySet());
        Collections.sort(fieldNames);
        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();
        Iterator itr = fieldNames.iterator();
        while (itr.hasNext()) {
            String fieldName = (String) itr.next();
            String fieldValue = (String) vnp_Params.get(fieldName);
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                //Build hash data
                hashData.append(fieldName);
                hashData.append('=');
                hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                //Build query
                query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII.toString()));
                query.append('=');
                query.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                if (itr.hasNext()) {
                    query.append('&');
                    hashData.append('&');
                }
            }
        }
        String queryUrl = query.toString();
        String vnp_SecureHash = Config.hmacSHA512(Config.secretKey, hashData.toString());
        queryUrl += "&vnp_SecureHash=" + vnp_SecureHash;
        String paymentUrl = Config.vnp_PayUrl + "?" + queryUrl;
        return ResponseEntity.ok(Collections.singletonMap("url", paymentUrl));
    }

    @GetMapping("/payment-result")
    public ResponseEntity<?> paymentResult(HttpServletRequest request) throws Exception {
        Map<String, String> fields = new HashMap<>();
        for (Enumeration<String> params = request.getParameterNames(); params.hasMoreElements(); ) {
            String paramName = params.nextElement();
            fields.put(paramName, request.getParameter(paramName));
        }

        String secureHash = fields.remove("vnp_SecureHash");
        String signData = fields.entrySet().stream()
                .sorted(Map.Entry.comparingByKey())
                .map(e -> e.getKey() + "=" + e.getValue())
                .collect(Collectors.joining("&"));

        String myChecksum = Config.hmacSHA512(Config.secretKey, signData);

        if (myChecksum.equals(secureHash)) {
            String responseCode = fields.get("vnp_ResponseCode");
            Long hoaDonId = Long.valueOf(fields.get("vnp_TxnRef"));

            HoaDonEntity hoaDon = hoaDonRepository.findById(hoaDonId)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy hóa đơn với mã: " + hoaDonId));

            if ("00".equals(responseCode)) {
                hoaDon.setTrangThaiThanhToan("100"); // Thành công
                hoaDon.setGhiChuThanhToan("Thành công");
            } else {
                hoaDon.setTrangThaiThanhToan("400"); // Thất bại
                switch (responseCode) {
                    case "07":
                        hoaDon.setGhiChuThanhToan("Giao dịch bị nghi ngờ (liên quan tới lừa đảo, bất thường)");
                        break;
                    case "09":
                        hoaDon.setGhiChuThanhToan("Thẻ/Tài khoản chưa đăng ký InternetBanking");
                        break;
                    case "10":
                        hoaDon.setGhiChuThanhToan("Xác thực thông tin thẻ sai quá 3 lần");
                        break;
                    case "11":
                        hoaDon.setGhiChuThanhToan("Hết hạn chờ thanh toán");
                        break;
                    case "12":
                        hoaDon.setGhiChuThanhToan("Thẻ/Tài khoản bị khóa");
                        break;
                    case "13":
                        hoaDon.setGhiChuThanhToan("Sai mật khẩu xác thực giao dịch (OTP)");
                        break;
                    case "24":
                        hoaDon.setGhiChuThanhToan("Khách hàng hủy giao dịch");
                        break;
                    case "51":
                        hoaDon.setGhiChuThanhToan("Không đủ số dư tài khoản");
                        break;
                    case "65":
                        hoaDon.setGhiChuThanhToan("Vượt quá hạn mức giao dịch trong ngày");
                        break;
                    case "75":
                        hoaDon.setGhiChuThanhToan("Ngân hàng đang bảo trì");
                        break;
                    case "79":
                        hoaDon.setGhiChuThanhToan("Nhập sai mật khẩu thanh toán quá số lần quy định");
                        break;
                    case "99":
                    default:
                        hoaDon.setGhiChuThanhToan("Giao dịch thất bại - lỗi khác");
                        break;
                }
            }
            hoaDonRepository.save(hoaDon);
            // Xác thực thành công, xử lý cập nhật đơn hàng
            return ResponseEntity.ok("Payment successful");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid checksum");
        }
    }
}
