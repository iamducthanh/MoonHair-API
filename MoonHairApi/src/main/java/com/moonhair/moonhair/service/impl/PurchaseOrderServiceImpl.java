package com.moonhair.moonhair.service.impl;

import com.moonhair.moonhair.dto.PurchaseOrder;
import com.moonhair.moonhair.dto.PurchaseOrderDetail;
import com.moonhair.moonhair.entities.LotEntity;
import com.moonhair.moonhair.entities.PurchaseOrderDetailEntity;
import com.moonhair.moonhair.entities.PurchaseOrderEntity;
import com.moonhair.moonhair.repositories.LotRepository;
import com.moonhair.moonhair.repositories.PurchaseOrderDetailRepository;
import com.moonhair.moonhair.repositories.PurchaseOrderRepository;
import com.moonhair.moonhair.service.IPurchaseOrderService;
import com.moonhair.moonhair.utils.CodeGenerator;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import static com.moonhair.moonhair.utils.CodeGenerator.generatePurchaseOrderCode;

@Service
@RequiredArgsConstructor
public class PurchaseOrderServiceImpl implements IPurchaseOrderService {

    private final PurchaseOrderRepository purchaseOrderRepository;
    private final PurchaseOrderDetailRepository purchaseOrderDetailRepository;
    private final LotRepository lotRepository;

    @Transactional
    public PurchaseOrderEntity createPurchaseOrder(PurchaseOrder purchaseOrderDTO) {
        // 1. Tạo bản ghi PurchaseOrderEntity và lưu
        PurchaseOrderEntity purchaseOrder = new PurchaseOrderEntity();
        purchaseOrder.setCode(generatePurchaseOrderCode());
        purchaseOrder.setBranchId(purchaseOrderDTO.getBranchId());
        purchaseOrder.setSupplierName(purchaseOrderDTO.getNhaCungCap());
        purchaseOrder.setStatus("100");
        purchaseOrder.setTotalAmount(purchaseOrderDTO.getTienTra());
        purchaseOrder.setDiscount(purchaseOrderDTO.getGiamGia());
        purchaseOrder.setFinalAmount(purchaseOrderDTO.getTienTra());
        purchaseOrder.setOtherCost(purchaseOrderDTO.getChiPhiKhac());
        purchaseOrder.setNote(purchaseOrderDTO.getGhiChu());
        purchaseOrder = purchaseOrderRepository.save(purchaseOrder);

        // 2. Lặp qua danh sách item từ DTO để tạo PurchaseOrderDetailEntity
        for (PurchaseOrderDetail detailDTO : purchaseOrderDTO.getProduct()) {
            PurchaseOrderDetailEntity purchaseOrderDetail = new PurchaseOrderDetailEntity();
            purchaseOrderDetail.setPurchaseOrderId(purchaseOrder.getId());
            purchaseOrderDetail.setProductId(detailDTO.getId());
            purchaseOrderDetail.setProductName(detailDTO.getProductName());
            purchaseOrderDetail.setQuantity(detailDTO.getSoLuongNhap());
            purchaseOrderDetail.setImportPrice(detailDTO.getDonGia());
            purchaseOrderDetail = purchaseOrderDetailRepository.save(purchaseOrderDetail);

            // 3. Tạo LotEntity tương ứng dựa trên mỗi PurchaseOrderDetailEntity
            LotEntity lot = new LotEntity();
            lot.setProductId(detailDTO.getId());
            lot.setPurchaseOrderDetailId(purchaseOrderDetail.getId());
            lot.setLotCode(generateLotCode(detailDTO.getId())); // Tạo mã lô
            lot.setQuantityImported(detailDTO.getSoLuongNhap());
            lot.setQuantityRemaining(detailDTO.getSoLuongNhap());
            lot.setCostPrice(detailDTO.getDonGia());
            lot.setSellingPrice(0D);
            lotRepository.save(lot);
        }

        return purchaseOrder;
    }

    public String generateLotCode(Integer productId) {
        // Định dạng ngày hiện tại thành ddMMyyyy
        LocalDate today = LocalDate.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("ddMMyyyy");
        String formattedDate = today.format(formatter);

        // Lấy giá trị lớn nhất của index từ database
        int currentMaxIndex = lotRepository.findMaxIndexByProductAndDate(productId, formattedDate);

        // Gọi phương thức để sinh mã mới
        return CodeGenerator.generateLotCode(productId, formattedDate, currentMaxIndex);
    }


}
