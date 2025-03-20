package com.moonhair.moonhair.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;

@Entity
@Table(name = "nhan_vien")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class EmployeeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @Column(name = "ten")
    private String name;
    @Column(name = "muc_luong")
    private String salaryRate;
    @Column(name = "id_chi_nhanh")
    private Integer branchId;
    private Boolean active;
    @Column(name = "ngay_tao")
    @CreatedDate
    private LocalDate createdDate;
    @Column(name = "ngay_sua")
    @LastModifiedDate
    private LocalDate modifiedDate;

    @Column(name = "ten_dang_nhap")
    private String username;

    @Column(name = "mat_khau")
    private String password;
}
