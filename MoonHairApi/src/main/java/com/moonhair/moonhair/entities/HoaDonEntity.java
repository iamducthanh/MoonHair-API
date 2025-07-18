package com.moonhair.moonhair.entities;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "hoa_don")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
public class HoaDonEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "ten_khach")
    private String tenKhach;

    @Column(name = "tong_tien")
    private BigDecimal tongTien;

    @Column(name = "giam_gia")
    private BigDecimal giamGia;

    @Column(name = "tong_tien_thanh_toan")
    private BigDecimal tongTienThanhToan;

    @Column(name = "phuong_thuc")
    private String phuongThuc;

    @Column(name = "trang_thai_thanh_toan")
    private String trangThaiThanhToan;

    private Long idChiNhanh;

    private String ghiChuThanhToan;

    private String nguoiTaoDon;

    private String maHoaDon;
    @CreatedDate
    private LocalDateTime ngayTao;
    @LastModifiedDate
    private LocalDateTime ngaySua;

    private Boolean isDelete;
    private LocalDateTime ngayHoaDon;


    @OneToMany(mappedBy = "hoaDon", fetch = FetchType.LAZY)
    private List<HoaDonChiTietEntity> hoaDonChiTietList;
}

