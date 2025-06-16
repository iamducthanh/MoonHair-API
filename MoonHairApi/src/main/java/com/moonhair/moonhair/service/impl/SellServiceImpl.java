package com.moonhair.moonhair.service.impl;

import com.moonhair.moonhair.constant.PaymentStatus;
import com.moonhair.moonhair.dto.CustomUserDetails;
import com.moonhair.moonhair.dto.ProductList;
import com.moonhair.moonhair.dto.Sell;
import com.moonhair.moonhair.entities.*;
import com.moonhair.moonhair.repositories.HoaDonChiTietRepository;
import com.moonhair.moonhair.repositories.HoaDonRepository;
import com.moonhair.moonhair.repositories.LotRepository;
import com.moonhair.moonhair.repositories.ProductRepository;
import com.moonhair.moonhair.service.ISellService;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class SellServiceImpl implements ISellService {
    private final ProductRepository productRepository;
    private final HoaDonRepository hoaDonRepository;
    private final HoaDonChiTietRepository hoaDonChiTietRepository;
    private final LotRepository lotRepository;

    public SellServiceImpl(ProductRepository productRepository, HoaDonRepository hoaDonRepository, HoaDonChiTietRepository hoaDonChiTietRepository, LotRepository lotRepository) {
        this.productRepository = productRepository;
        this.hoaDonRepository = hoaDonRepository;
        this.hoaDonChiTietRepository = hoaDonChiTietRepository;
        this.lotRepository = lotRepository;
    }


    @Override
    public List<ProductList> getAllProductToSell(Integer branchId) {
        return productRepository.findAllProductListToSell(branchId);
    }

    @Override
    public List<ProductEntity> getAllServiceToSell(Integer branchId) {
        return productRepository.findAllProductService(branchId);
    }

    @Override
    public Sell saveSell(Sell sell) {
        User userDetails = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        String userId = userDetails.getUsername(); // hoặc các field custom khác

        String trangThaiThanhToan = sell.getPhuongThucThanhToan().equals("tienmat") ? PaymentStatus.COMPLETED.getCode() : PaymentStatus.PENDING_TRANSFER.getCode();
        HoaDonEntity hoaDonEntity = HoaDonEntity.builder()
                .tenKhach(sell.getTenKhachHang())
                .tongTien(BigDecimal.valueOf(sell.getTongTien()))
                .giamGia(BigDecimal.valueOf(sell.getGiamGia()))
                .tongTienThanhToan(BigDecimal.valueOf(sell.getTongTienThanhToan()))
                .phuongThuc(sell.getPhuongThucThanhToan())
                .trangThaiThanhToan(trangThaiThanhToan)
                .idChiNhanh(sell.getIdChiNhanh())
                .nguoiTaoDon(userId)
                .build();

        HoaDonEntity hoaDon = hoaDonRepository.save(hoaDonEntity);
        List<HoaDonChiTietEntity> hoaDonChiTiets = new ArrayList<>();
        List<LotEntity> lotList = new ArrayList<>();
        sell.getProductList().forEach(o -> {
            HoaDonChiTietEntity hoaDonChiTietEntity = HoaDonChiTietEntity.builder()
                    .tenKhachSanPham(o.getName())
                    .thoChinh(o.getThoChinh())
                    .thoPhu(o.getThoPhu())
                    .soLuong(o.getSoLuong())
                    .khachYc(o.getKyc() != null & Boolean.TRUE.equals(o.getKyc()) ? "1" : "0")
                    .donGia(BigDecimal.valueOf(o.getDonGia()))
                    .thanhTien(BigDecimal.valueOf(o.getDonGia() * o.getSoLuong()))
                    .hoaDonId(hoaDon.getId())
                    .loai(o.getProductType())
                    .build();
            hoaDonChiTiets.add(hoaDonChiTietEntity);
            if (o.getLotId() != null && o.getProductType().equals("SAN_PHAM")) {
                LotEntity lot = lotRepository.findById(o.getLotId())
                        .filter(oo -> oo.getQuantityRemaining() != null && oo.getQuantityRemaining() > 0)
                        .orElseThrow(() -> new RuntimeException("Sản phẩm này đã hết hàng!"));
                lot.setQuantityRemaining(lot.getQuantityRemaining() - o.getSoLuong());
                lotList.add(lot);
            }
        });
        hoaDonChiTietRepository.saveAll(hoaDonChiTiets);
        lotRepository.saveAll(lotList);
        sell.setIdHoaDon(hoaDon.getId());
        return sell;
    }
}
