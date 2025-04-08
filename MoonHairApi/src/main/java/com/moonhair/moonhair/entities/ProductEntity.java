package com.moonhair.moonhair.entities;

import com.moonhair.moonhair.constant.ProductType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "san_pham")
@Builder
@AllArgsConstructor
@NoArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class ProductEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @Column(name = "ten")
    private String name;
    @Column(name = "so_luong")
    private Integer quantity;
    @Column(name = "gia_ban")
    private Double price;
    @Column(name = "loai")
    @Enumerated(EnumType.STRING)
    private ProductType productType;
    @Column(name = "kich_thuoc")
    private String size;
    @CreatedDate
    @Column(name = "ngay_tao")
    private LocalDateTime ngayTao;
    @LastModifiedDate
    @Column(name = "ngay_sua")
    private LocalDateTime ngaySua;
    private Boolean deleteFlag;
    private Boolean active;
    @Column(name = "id_chi_nhanh")
    private Integer branchId;
    @Column(name = "ghi_chu")
    private String note;

    public String getProductCode() {
        return String.format("SP%05d", id);
    }

//    public String getProductType() {
//        return productType.getTen();
//    }
}
