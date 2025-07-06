package com.moonhair.moonhair.service.impl;

import com.moonhair.moonhair.dto.BangLuongDTO;
import com.moonhair.moonhair.dto.HoaDon;
import com.moonhair.moonhair.dto.HoaDonChiTiet;
import com.moonhair.moonhair.dto.HoaDonThamGiaDTO;
import com.moonhair.moonhair.entities.EmployeeEntity;
import com.moonhair.moonhair.entities.HoaDonChiTietEntity;
import com.moonhair.moonhair.entities.HoaDonEntity;
import com.moonhair.moonhair.repositories.EmployeeRepository;
import com.moonhair.moonhair.repositories.HoaDonChiTietRepository;
import com.moonhair.moonhair.service.IEmployeeService;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class EmployeeServiceImpl implements IEmployeeService {
    private final EmployeeRepository employeeRepository;
    private final HoaDonChiTietRepository hoaDonChiTietRepository;

    public EmployeeServiceImpl(EmployeeRepository employeeRepository, HoaDonChiTietRepository hoaDonChiTietRepository) {
        this.employeeRepository = employeeRepository;
        this.hoaDonChiTietRepository = hoaDonChiTietRepository;
    }

    @Override
    public List<EmployeeEntity> getAllEmployees() {
        return employeeRepository.findAll();
    }

    @Override
    public List<EmployeeEntity> getAllByBranchId(Integer branchId) {
        return employeeRepository.findAllByBranchId(branchId);
    }

    @Override
    public EmployeeEntity getEmployeeById(Integer id) {
        return employeeRepository.findById(id).orElseThrow(() -> new RuntimeException("Employee not found"));
    }

    @Override
    public EmployeeEntity createEmployee(EmployeeEntity employee) {
        employee.setActive(true);
        return employeeRepository.save(employee);
    }

    @Override
    public EmployeeEntity updateEmployee(Integer id, EmployeeEntity employee) {
        Optional<EmployeeEntity> existingEmployee = employeeRepository.findById(id);
        if (existingEmployee.isPresent()) {
            EmployeeEntity updatedEmployee = existingEmployee.get();
            updatedEmployee.setName(employee.getName());
            updatedEmployee.setSalaryRate(employee.getSalaryRate());
            updatedEmployee.setBranchId(employee.getBranchId());
            updatedEmployee.setActive(employee.getActive());
            updatedEmployee.setModifiedDate(employee.getModifiedDate());
            updatedEmployee.setType(employee.getType());
            return employeeRepository.save(updatedEmployee);
        }
        throw new RuntimeException("Employee not found");
    }

    @Override
    public void deleteEmployee(Integer id) {
        employeeRepository.deleteById(id);
    }

    @Override
    public List<BangLuongDTO> getBangLuong(int thang, int nam, int idChiNhanh) {
        List<EmployeeEntity> nhanViens = employeeRepository.findAllByBranchId(idChiNhanh);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");

        List<BangLuongDTO> result = new ArrayList<>();

        for (EmployeeEntity nv : nhanViens) {
            BigDecimal doanhThu = BigDecimal.ZERO;
            BigDecimal hoaHong = BigDecimal.ZERO;
            List<HoaDonThamGiaDTO> hdThamGias = new ArrayList<>();

            List<HoaDonChiTietEntity> ctList = hoaDonChiTietRepository.findByThangAndNhanVien(thang, nam, String.valueOf(nv.getId()));
            for (HoaDonChiTietEntity ct : ctList) {
                HoaDonEntity hoaDon = ct.getHoaDon();

                LocalDateTime ngayTao = hoaDon.getNgayTao();
                if (hoaDon.getIdChiNhanh() != idChiNhanh) continue;

                HoaDonThamGiaDTO dto = new HoaDonThamGiaDTO();
                dto.setMaHoaDon(hoaDon.getMaHoaDon());
                dto.setTenKhach(ct.getTenKhachSanPham().isEmpty() ? hoaDon.getTenKhach() : ct.getTenKhachSanPham());
                dto.setNgay(hoaDon.getNgayTao().toLocalDate().format(formatter));
                if (ct.getThoChinh() != null && ct.getThoChinh().equals(String.valueOf(nv.getId()))) {
                    dto.setVaiTro("Thợ chính");
                    dto.setPhanTram(ct.getHoaHongChinh());
                } else if (ct.getThoPhu() != null && ct.getThoPhu().equals(String.valueOf(nv.getId()))) {
                    dto.setVaiTro("Thợ phụ");
                    dto.setPhanTram(ct.getHoaHongPhu());
                }
                dto.setTongTien(ct.getThanhTien());
                BigDecimal hoaHongCt = ct.getThanhTien().multiply(BigDecimal.valueOf(dto.getPhanTram())).divide(BigDecimal.valueOf(100));
                dto.setHoaHong(hoaHongCt);
                doanhThu = doanhThu.add(ct.getThanhTien());
                hoaHong = hoaHong.add(hoaHongCt);
                hdThamGias.add(dto);
            }

            BangLuongDTO bl = new BangLuongDTO();
            bl.setMaNhanVien(nv.getId().toString());
            bl.setTenNhanVien(nv.getName());
            bl.setLoaiNhanVien(nv.getType());
            bl.setLuongCoBan(BigDecimal.valueOf(0));
            bl.setDoanhThu(doanhThu);
            bl.setTongHoaHong(hoaHong);
            bl.setTongLuong(hoaHong);
            bl.setHoaDons(hdThamGias);

            result.add(bl);
        }
        result = result.stream()
                .filter(n -> !n.getHoaDons().isEmpty())
                .collect(Collectors.toList());


        return result;
    }

}
