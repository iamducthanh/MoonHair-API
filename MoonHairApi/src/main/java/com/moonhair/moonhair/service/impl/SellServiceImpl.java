package com.moonhair.moonhair.service.impl;

import com.moonhair.moonhair.constant.PaymentStatus;
import com.moonhair.moonhair.dto.*;
import com.moonhair.moonhair.entities.*;
import com.moonhair.moonhair.repositories.*;
import com.moonhair.moonhair.service.ISellService;
import com.moonhair.moonhair.utils.CodeGenerator;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class SellServiceImpl implements ISellService {
    private final ProductRepository productRepository;
    private final HoaDonRepository hoaDonRepository;
    private final HoaDonChiTietRepository hoaDonChiTietRepository;
    private final LotRepository lotRepository;
    private final BranchRepository branchRepository;
    private final EmployeeRepository employeeRepository;

    public SellServiceImpl(ProductRepository productRepository, HoaDonRepository hoaDonRepository, HoaDonChiTietRepository hoaDonChiTietRepository, LotRepository lotRepository, BranchRepository branchRepository, EmployeeRepository employeeRepository) {
        this.productRepository = productRepository;
        this.hoaDonRepository = hoaDonRepository;
        this.hoaDonChiTietRepository = hoaDonChiTietRepository;
        this.lotRepository = lotRepository;
        this.branchRepository = branchRepository;
        this.employeeRepository = employeeRepository;
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
        String ghiChuThanhToan = sell.getPhuongThucThanhToan().equals("tienmat") ? "Thành công" : "Chờ chuyển khoản";
        HoaDonEntity hoaDonEntity = HoaDonEntity.builder()
                .tenKhach(sell.getTenKhachHang())
                .tongTien(BigDecimal.valueOf(sell.getTongTien()))
                .giamGia(BigDecimal.valueOf(sell.getGiamGia()))
                .tongTienThanhToan(BigDecimal.valueOf(sell.getTongTienThanhToan()))
                .phuongThuc(sell.getPhuongThucThanhToan())
                .trangThaiThanhToan(trangThaiThanhToan)
                .ghiChuThanhToan(ghiChuThanhToan)
                .idChiNhanh(sell.getIdChiNhanh())
                .nguoiTaoDon(userId)
                .build();

        HoaDonEntity hoaDon = hoaDonRepository.save(hoaDonEntity);

        BranchEntity branchEntity = branchRepository.findById(sell.getIdChiNhanh().intValue()).get();
        String branchCode = CodeGenerator.getInitials(branchEntity.getName());
        String maHoaDon = String.format("%05d", hoaDon.getId());
        hoaDon.setMaHoaDon(branchCode + maHoaDon);

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
                    .hoaDon(hoaDon)
                    .loai(o.getProductType())
                    .maSanPham(o.getProductCode())
                    .build();
            if (o.getThoChinh() != null) {
                employeeRepository.findById(Integer.valueOf(o.getThoChinh())).ifPresent(tho -> {
                    hoaDonChiTietEntity.setThoChinhTen(tho.getName());
                });
            }
            if (o.getThoPhu() != null) {
                employeeRepository.findById(Integer.valueOf(o.getThoPhu())).ifPresent(tho -> {
                    hoaDonChiTietEntity.setThoPhuTen(tho.getName());
                });
            }
            hoaDonChiTiets.add(hoaDonChiTietEntity);
            if (o.getLotId() != null && o.getProductType().equals("SAN_PHAM")) {
                LotEntity lot = lotRepository.findById(o.getLotId())
                        .filter(oo -> oo.getQuantityRemaining() != null && oo.getQuantityRemaining() > 0)
                        .orElseThrow(() -> new RuntimeException("Sản phẩm này đã hết hàng!"));
                lot.setQuantityRemaining(lot.getQuantityRemaining() - o.getSoLuong());
                lotList.add(lot);
            }
        });
        hoaDonRepository.save(hoaDon);
        hoaDonChiTietRepository.saveAll(hoaDonChiTiets);
        lotRepository.saveAll(lotList);
        sell.setIdHoaDon(hoaDon.getId());
        return sell;
    }

    @Override
    public List<HoaDon> getSellList(GetSellListDto getSellListDto) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");

        List<HoaDonEntity> hoaDonList = new ArrayList<>();
        if (getSellListDto.getGetDate() != null) {
            LocalDate date = LocalDate.parse(getSellListDto.getGetDate(), formatter);
            hoaDonList = hoaDonRepository.findByNgayTaoBetween(date.atStartOfDay(), date.atTime(LocalTime.MAX));
        }
        List<HoaDon> hoaDons = hoaDonEntityToDto(hoaDonList);

        return hoaDons;
    }

    public List<HoaDon> hoaDonEntityToDto (List<HoaDonEntity> hoaDonList) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");

        List<HoaDon> hoaDons = new ArrayList<>();
        hoaDonList.forEach(o -> {
            HoaDon hoaDon = HoaDon.builder()
                    .maHoaDon(o.getMaHoaDon())
                    .tenKhachHang(o.getTenKhach())
                    .thoiGian(o.getNgayTao().format(formatter))
                    .tongTien(o.getTongTien())
                    .giamGia(o.getGiamGia())
                    .khachDaTra(o.getTongTienThanhToan())
                    .trangThai(o.getGhiChuThanhToan())
                    .chiNhanh(o.getIdChiNhanh().toString())
                    .maChiNhanh(o.getIdChiNhanh())
                    .nguoiTao(o.getNguoiTaoDon())
                    .phuongThuc(o.getPhuongThuc().equals("tienmat") ? "Tiền mặt": "Chuyển khoản")
                    .build();
            List<HoaDonChiTiet> hoaDonChiTiet = new ArrayList<>();
            o.getHoaDonChiTietList().forEach(hoaDonChiTietEntity -> {
                HoaDonChiTiet hoaDonChiTietDto = HoaDonChiTiet.builder()
                        .maHangHoa(hoaDonChiTietEntity.getMaSanPham())
                        .tenHang(hoaDonChiTietEntity.getTenKhachSanPham())
                        .soLuong(hoaDonChiTietEntity.getSoLuong())
                        .donGia(hoaDonChiTietEntity.getDonGia())
                        .thanhTien(hoaDonChiTietEntity.getThanhTien())
                        .thoChinh(hoaDonChiTietEntity.getThoChinhTen())
                        .thoPhu(hoaDonChiTietEntity.getThoPhuTen())
                        .build();
                hoaDonChiTiet.add(hoaDonChiTietDto);
            });
            hoaDon.setHoaDonChiTiets(hoaDonChiTiet);
            hoaDons.add(hoaDon);
        });

        return hoaDons;
    }
}
