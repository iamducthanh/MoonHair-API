package com.moonhair.moonhair.service.impl;

import com.moonhair.moonhair.config.MoonHairException;
import com.moonhair.moonhair.constant.PaymentStatus;
import com.moonhair.moonhair.dto.*;
import com.moonhair.moonhair.entities.*;
import com.moonhair.moonhair.repositories.*;
import com.moonhair.moonhair.service.ISellService;
import com.moonhair.moonhair.utils.CodeGenerator;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicReference;

import static org.springframework.data.jpa.domain.AbstractPersistable_.id;

@Service
@Transactional
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
            EmployeeEntity emChinh = null;
            EmployeeEntity emPhu = null;
            if (o.getThoChinh() != null && !o.getThoChinh().isBlank()) {
                Optional<EmployeeEntity> optionalTho = employeeRepository.findById(Integer.valueOf(o.getThoChinh()));
                if (optionalTho.isPresent()) {
                    emChinh = optionalTho.get();
                    hoaDonChiTietEntity.setThoChinhTen(emChinh.getName());
                }
            }
            if (o.getThoPhu() != null && !o.getThoPhu().isBlank()) {
                Optional<EmployeeEntity> optionalTho = employeeRepository.findById(Integer.valueOf(o.getThoPhu()));
                if (optionalTho.isPresent()) {
                    emPhu = optionalTho.get();
                    hoaDonChiTietEntity.setThoPhuTen(emPhu.getName());
                }
            }
            if (o.getProductType() == null) {
                if (emPhu == null && emChinh != null) {
                    hoaDonChiTietEntity.setHoaHongChinh(Integer.parseInt(emChinh.getSalaryRate()) + branchEntity.getHoaHongPhu());
                    hoaDonChiTietEntity.setHoaHongPhu(0);
                } else if (emPhu != null && emChinh == null) {
                    hoaDonChiTietEntity.setHoaHongPhu(Integer.parseInt(emPhu.getSalaryRate()) + branchEntity.getHoaHongChinh());
                    hoaDonChiTietEntity.setHoaHongChinh(0);
                } else if (emChinh != null) {
                    hoaDonChiTietEntity.setHoaHongPhu(Integer.parseInt(emPhu.getSalaryRate()));
                    hoaDonChiTietEntity.setHoaHongChinh(Integer.parseInt(emChinh.getSalaryRate()));
                }
            } else if (o.getProductType().equals("SAN_PHAM")) {
                if (emChinh != null) {
                    hoaDonChiTietEntity.setHoaHongPhu(0);
                    hoaDonChiTietEntity.setHoaHongChinh(Integer.parseInt(emChinh.getSalaryRate()));
                } else if (emPhu != null) {
                    hoaDonChiTietEntity.setHoaHongPhu(branchEntity.getHoaHongChinh());
                    hoaDonChiTietEntity.setHoaHongChinh(0);
                }
            } else if (o.getProductType().equals("DICH_VU")) {
                if (emChinh != null) {
                    hoaDonChiTietEntity.setHoaHongPhu(0);
                    hoaDonChiTietEntity.setHoaHongChinh(branchEntity.getHoaHongChinh());
                } else if (emPhu != null) {
                    hoaDonChiTietEntity.setHoaHongPhu(branchEntity.getHoaHongChinh());
                    hoaDonChiTietEntity.setHoaHongChinh(0);
                }
            }


            hoaDonChiTiets.add(hoaDonChiTietEntity);
            if (o.getLotId() != null && o.getProductType().equals("SAN_PHAM")) {
                LotEntity lot = lotRepository.findById(o.getLotId())
                        .filter(oo -> oo.getQuantityRemaining() != null && oo.getQuantityRemaining() > 0)
                        .orElseThrow(() -> new MoonHairException("Sản phẩm này đã hết hàng!"));

                if (o.getSoLuong() > lot.getQuantityRemaining()) {
                    throw new MoonHairException("Số lượng sản phẩm vượt quá sản phẩm tồn!");
                }
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
    public List<HoaDon> getSellList(SellFilterRequest dto) {
        List<HoaDonEntity> entities = hoaDonRepository.findByFilter(dto);
        return hoaDonEntityToDto(entities);
    }

    @Override
    public HoaDon getByMa(String maHoaDon) {
        HoaDonEntity hoaDon = hoaDonRepository.findByMaHoaDon(maHoaDon)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy"));
        List<HoaDon> hoaDons = hoaDonEntityToDto(Arrays.asList(hoaDon));
        return hoaDons.get(0);
    }

    @Override
    public void updateInvoice(String maHoaDon, UpdateInvoice invoiceUpdate) {
        HoaDonEntity hoaDon = hoaDonRepository.findByMaHoaDon(maHoaDon)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hóa đơn: " + maHoaDon));

        if (invoiceUpdate.getTrangThai() != null && !invoiceUpdate.getTrangThai().isBlank()) {
            hoaDon.setTrangThaiThanhToan(invoiceUpdate.getTrangThai());
            hoaDon.setGhiChuThanhToan(invoiceUpdate.getTrangThai().equals("100") ? "Thành công" : "Chờ chuyển khoản");
        }
        if (invoiceUpdate.getIsDelete() != null && invoiceUpdate.getIsDelete()) {
            hoaDon.setIsDelete(true);
        }
        hoaDonRepository.save(hoaDon);
    }

    public List<HoaDon> hoaDonEntityToDto (List<HoaDonEntity> hoaDonList) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");

        AtomicReference<BigDecimal> tongDoanhThu = new AtomicReference<>(BigDecimal.ZERO);
        AtomicReference<BigDecimal> tongTienMat = new AtomicReference<>(BigDecimal.ZERO);
        AtomicReference<BigDecimal> tongChuyenKhoan = new AtomicReference<>(BigDecimal.ZERO);

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
            if (o.getPhuongThuc().equals("tienmat")) {
                tongTienMat.set(tongTienMat.get().add(o.getTongTienThanhToan()));
            } else {
                tongChuyenKhoan.set(tongChuyenKhoan.get().add(o.getTongTienThanhToan()));
            }
            tongDoanhThu.set(tongDoanhThu.get().add(o.getTongTienThanhToan()));
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
                        .idHoaDonChiTiet(hoaDonChiTietEntity.getId())
                        .build();
                hoaDonChiTiet.add(hoaDonChiTietDto);
            });
            hoaDon.setHoaDonChiTiets(hoaDonChiTiet);
            hoaDons.add(hoaDon);
        });

        if (!hoaDons.isEmpty()) {
            hoaDons.add(HoaDon.builder()
                    .tongDoanhThu(tongDoanhThu.get())
                    .tongTienMat(tongTienMat.get())
                    .tongChuyenKhoan(tongChuyenKhoan.get())
                    .build());
        }
        return hoaDons;
    }
}
