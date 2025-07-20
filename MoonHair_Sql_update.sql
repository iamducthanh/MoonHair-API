create table phieu_nhap (
	`id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
	`ma_phieu` varchar(255),
	`id_chi_nhanh` int NOT NULL,
	`ngay_tao` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
	`ten_ncc` varchar(255),
	`trang_thai` varchar(10),
	`tong_tien` double DEFAULT NULL,
	`giam_gia` double DEFAULT NULL,
	`tong_tien_thanh_toan` double DEFAULT NULL,
	`chi_phi_khac` double DEFAULT NULL,
	`ghi_chu` varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL
);

create table chi_tiet_phieu_nhap (
	`id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
	`id_phieu_nhap` int NOT NULL,
    `id_san_pham` int NOT NULL,
	 `so_luong` int not null,
	`gia_nhap` DECIMAL(15,2) not null,
	  
    CONSTRAINT fk_ctpn_phieunhap FOREIGN KEY (id_phieu_nhap) REFERENCES phieu_nhap(id),
    CONSTRAINT fk_ctpn_sanpham FOREIGN KEY (id_san_pham) REFERENCES san_pham(id)
);
  
CREATE TABLE lo_hang (
    `id` int AUTO_INCREMENT PRIMARY KEY,
    `id_san_pham` int NOT NULL,
    `id_chi_tiet_phieu_nhap` int, -- 1-1 với chi tiết phiếu nhập
    `ma_lo` VARCHAR(100) NOT NULL,
    `so_luong_nhap` INT NOT NULL,
    `so_luong_con` INT NOT NULL,
    `gia_von` DECIMAL(15,2) NOT NULL,
        `gia_ban` DECIMAL(15,2) NOT NULL,      -- Giá bán theo lô
    `ngay_nhap` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_lo_sanpham FOREIGN KEY (id_san_pham) REFERENCES san_pham(id),
    CONSTRAINT fk_lo_ctpn FOREIGN KEY (id_chi_tiet_phieu_nhap) REFERENCES chi_tiet_phieu_nhap(id)
);

select sp.ten, lh.ma_lo , sp.kich_thuoc,sp.loai, lh.gia_von, lh.gia_ban, lh.so_luong_nhap , lh.so_luong_con, sp.active  from san_pham sp left join lo_hang lh on sp.id = lh.id_san_pham where sp.loai = 'SAN_PHAM' ;
ALTER TABLE san_pham DROP COLUMN so_luong;

INSERT INTO MoonHair.chi_tiet_phieu_nhap
(id, id_phieu_nhap, id_san_pham, so_luong, gia_nhap)
VALUES(1, 1, 1, 15, 200000.00);
INSERT INTO MoonHair.chi_tiet_phieu_nhap
(id, id_phieu_nhap, id_san_pham, so_luong, gia_nhap)
VALUES(2, 1, 2, 13, 300000.00);
INSERT INTO MoonHair.chi_tiet_phieu_nhap
(id, id_phieu_nhap, id_san_pham, so_luong, gia_nhap)
VALUES(3, 1, 1, 10, 220000.00);

INSERT INTO MoonHair.phieu_nhap
(id, ma_phieu, id_chi_nhanh, ngay_tao, ten_ncc, trang_thai, tong_tien, giam_gia, tong_tien_thanh_toan, chi_phi_khac, ghi_chu)
VALUES(1, 'PN-15042025-212634', 1, '2025-04-15 21:26:23', 'Nhà cc Thành', '1', 9100000.0, 0.0, 9100000.0, 0.0, 'Ghi chú');

INSERT INTO MoonHair.lo_hang
(id, id_san_pham, id_chi_tiet_phieu_nhap, ma_lo, so_luong_nhap, so_luong_con, gia_von, gia_ban, ngay_nhap)
VALUES(1, 1, 1, 'SP001-15042025-001', 15, 15, 200000.00, 400000.00, '2025-04-15 21:34:54');
INSERT INTO MoonHair.lo_hang
(id, id_san_pham, id_chi_tiet_phieu_nhap, ma_lo, so_luong_nhap, so_luong_con, gia_von, gia_ban, ngay_nhap)
VALUES(2, 2, 2, 'SP002-15042025-001', 13, 13, 300000.00, 500000.00, '2025-04-15 21:34:54');
INSERT INTO MoonHair.lo_hang
(id, id_san_pham, id_chi_tiet_phieu_nhap, ma_lo, so_luong_nhap, so_luong_con, gia_von, gia_ban, ngay_nhap)
VALUES(3, 1, 1, 'SP001-15042025-002', 10, 10, 220000.00, 400000.00, '2025-04-15 21:34:54');
UPDATE san_pham
SET gia_ban  = NULL
WHERE loai = 'SAN_PHAM';

select sp.id, sp.ten, sp.kich_thuoc, sum(lh.so_luong_con)  from san_pham sp left join lo_hang lh on sp.id = lh.id_san_pham where sp.loai = 'SAN_PHAM' group by sp.id, sp.ten;

ALTER TABLE chi_tiet_phieu_nhap 
ADD COLUMN ten_san_pham varchar(255);

-- 23/05
ALTER TABLE nhan_vien MODIFY COLUMN id_chi_nhanh INT NULL;
ALTER TABLE nhan_vien ADD COLUMN loai VARCHAR(10);

-- 31/05
CREATE TABLE hoa_don (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    ten_khach VARCHAR(255),
    tong_tien DECIMAL(15,2),
    giam_gia DECIMAL(15,2),
    tong_tien_thanh_toan DECIMAL(15,2),
    phuong_thuc VARCHAR(100),
   	`id_chi_nhanh` int NOT NULL,

);
CREATE TABLE hoa_don_chi_tiet (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    ten_khach_san_pham VARCHAR(255),
    tho_chinh VARCHAR(255),
    tho_phu VARCHAR(255),
    so_luong INT,
    khach_yc TEXT,
    don_gia DECIMAL(15,2),
    thanh_tien DECIMAL(15,2),
    hoa_don_id BIGINT,
    FOREIGN KEY (hoa_don_id) REFERENCES hoa_don(id)
);
-- 07/06
ALTER TABLE hoa_don ADD COLUMN trang_thai_thanh_toan VARCHAR(10);
ALTER TABLE hoa_don_chi_tiet ADD COLUMN loai VARCHAR(10);
ALTER TABLE hoa_don ADD COLUMN ghi_chu_thanh_toan VARCHAR(200);
ALTER TABLE hoa_don ADD COLUMN nguoi_tao_don VARCHAR(20);
-- 19/06
ALTER TABLE hoa_don ADD COLUMN ma_hoa_don VARCHAR(10);
ALTER TABLE hoa_don ADD COLUMN ngay_tao datetime;
ALTER TABLE hoa_don ADD COLUMN ngay_sua datetime;
-- 28/06
ALTER TABLE hoa_don_chi_tiet ADD COLUMN tho_chinh_ten VARCHAR(100);
ALTER TABLE hoa_don_chi_tiet ADD COLUMN tho_phu_ten VARCHAR(100);
ALTER TABLE hoa_don_chi_tiet ADD COLUMN ma_san_pham VARCHAR(10);
ALTER TABLE hoa_don ADD COLUMN is_delete bit;

SELECT h FROM HoaDonEntity h WHERE 1=1 AND DATE(h.ngayTao) BETWEEN :fromDate AND :toDate

-- 05/07
ALTER TABLE chi_nhanh ADD COLUMN hoa_hong_chinh int;
ALTER TABLE chi_nhanh ADD COLUMN hoa_hong_phu int;
ALTER TABLE hoa_don_chi_tiet ADD COLUMN hoa_hong_chinh int;
ALTER TABLE hoa_don_chi_tiet ADD COLUMN hoa_hong_phu int;

ALTER TABLE hoa_don ADD COLUMN ngay_hoa_don datetime;

SELECT DISTINCT DATE_FORMAT(ngay_tao, '%m/%Y') AS thang
FROM hoa_don
WHERE ngay_tao IS NOT NULL
ORDER BY ngay_tao DESC;

ALTER TABLE nhan_vien ADD COLUMN roles varchar(100);

    SELECT 
        hdc.tho_chinh AS thoChinhId,
        nv.ten AS tenTho,
        SUM(hdc.thanh_tien) AS tongDoanhThu,
        COUNT(DISTINCT hd.id) AS soHoaDon,
        COUNT(*) AS soLuongDichVu,
        ROUND(SUM(hdc.thanh_tien) / COUNT(DISTINCT hd.id), 2) AS doanhThuTrungBinh
    FROM hoa_don_chi_tiet hdc
    JOIN hoa_don hd ON hd.id = hdc.hoa_don_id
    JOIN nhan_vien nv ON nv.id = hdc.tho_chinh
    WHERE MONTH(hd.ngay_hoa_don) = MONTH(CURDATE())
      AND YEAR(hd.ngay_hoa_don) = YEAR(CURDATE())
    GROUP BY hdc.tho_chinh, nv.ten
    ORDER BY tongDoanhThu DESC
    LIMIT 5

-- moonhair.chi_nhanh definition

CREATE TABLE `chi_nhanh` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ten` varchar(255) NOT NULL,
  `dia_chi` text NOT NULL,
  `active` bit(1) DEFAULT NULL,
  `hoa_hong_chinh` int DEFAULT NULL,
  `hoa_hong_phu` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- moonhair.hoa_don definition

CREATE TABLE `hoa_don` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `ten_khach` varchar(255) DEFAULT NULL,
  `tong_tien` decimal(15,2) DEFAULT NULL,
  `giam_gia` decimal(15,2) DEFAULT NULL,
  `tong_tien_thanh_toan` decimal(15,2) DEFAULT NULL,
  `phuong_thuc` varchar(100) DEFAULT NULL,
  `id_chi_nhanh` int NOT NULL,
  `trang_thai_thanh_toan` varchar(10) DEFAULT NULL,
  `ghi_chu_thanh_toan` varchar(200) DEFAULT NULL,
  `nguoi_tao_don` varchar(20) DEFAULT NULL,
  `ma_hoa_don` varchar(10) DEFAULT NULL,
  `ngay_tao` datetime DEFAULT NULL,
  `ngay_sua` datetime DEFAULT NULL,
  `is_delete` bit(1) DEFAULT NULL,
  `ngay_hoa_don` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=83 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- moonhair.loai_san_pham definition

CREATE TABLE `loai_san_pham` (
  `code` varchar(255) NOT NULL,
  `ten` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- moonhair.phieu_nhap definition

CREATE TABLE `phieu_nhap` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ma_phieu` varchar(255) DEFAULT NULL,
  `id_chi_nhanh` int NOT NULL,
  `ngay_tao` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `ten_ncc` varchar(255) DEFAULT NULL,
  `trang_thai` varchar(10) DEFAULT NULL,
  `tong_tien` double DEFAULT NULL,
  `giam_gia` double DEFAULT NULL,
  `tong_tien_thanh_toan` double DEFAULT NULL,
  `chi_phi_khac` double DEFAULT NULL,
  `ghi_chu` varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- moonhair.hoa_don_chi_tiet definition

CREATE TABLE `hoa_don_chi_tiet` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `ten_khach_san_pham` varchar(255) DEFAULT NULL,
  `tho_chinh` varchar(255) DEFAULT NULL,
  `tho_phu` varchar(255) DEFAULT NULL,
  `so_luong` int DEFAULT NULL,
  `khach_yc` text,
  `don_gia` decimal(15,2) DEFAULT NULL,
  `thanh_tien` decimal(15,2) DEFAULT NULL,
  `hoa_don_id` bigint DEFAULT NULL,
  `loai` varchar(10) DEFAULT NULL,
  `tho_chinh_ten` varchar(100) DEFAULT NULL,
  `tho_phu_ten` varchar(100) DEFAULT NULL,
  `ma_san_pham` varchar(10) DEFAULT NULL,
  `hoa_hong_chinh` int DEFAULT NULL,
  `hoa_hong_phu` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `hoa_don_id` (`hoa_don_id`),
  CONSTRAINT `hoa_don_chi_tiet_ibfk_1` FOREIGN KEY (`hoa_don_id`) REFERENCES `hoa_don` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=101 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- moonhair.nhan_vien definition

CREATE TABLE `nhan_vien` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ten` varchar(255) NOT NULL,
  `muc_luong` int NOT NULL,
  `id_chi_nhanh` int DEFAULT NULL,
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `ngay_tao` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `ngay_sua` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `ten_dang_nhap` varchar(100) DEFAULT NULL,
  `mat_khau` varchar(200) DEFAULT NULL,
  `loai` varchar(10) DEFAULT NULL,
  `roles` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_chi_nhanh` (`id_chi_nhanh`),
  CONSTRAINT `nhan_vien_ibfk_1` FOREIGN KEY (`id_chi_nhanh`) REFERENCES `chi_nhanh` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1008 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- moonhair.san_pham definition

CREATE TABLE `san_pham` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ten` varchar(255) NOT NULL,
  `gia_ban` double DEFAULT NULL,
  `loai` varchar(255) DEFAULT NULL,
  `ngay_tao` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `ngay_sua` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `delete_flag` tinyint(1) NOT NULL DEFAULT '1',
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `id_chi_nhanh` int NOT NULL,
  `kich_thuoc` varchar(100) DEFAULT NULL,
  `ghi_chu` varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_chi_nhanh` (`id_chi_nhanh`),
  CONSTRAINT `san_pham_ibfk_1` FOREIGN KEY (`id_chi_nhanh`) REFERENCES `chi_nhanh` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- moonhair.chi_tiet_phieu_nhap definition

CREATE TABLE `chi_tiet_phieu_nhap` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_phieu_nhap` int NOT NULL,
  `id_san_pham` int NOT NULL,
  `so_luong` int NOT NULL,
  `gia_nhap` decimal(15,2) NOT NULL,
  `ten_san_pham` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_ctpn_phieunhap` (`id_phieu_nhap`),
  KEY `fk_ctpn_sanpham` (`id_san_pham`),
  CONSTRAINT `fk_ctpn_phieunhap` FOREIGN KEY (`id_phieu_nhap`) REFERENCES `phieu_nhap` (`id`),
  CONSTRAINT `fk_ctpn_sanpham` FOREIGN KEY (`id_san_pham`) REFERENCES `san_pham` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- moonhair.lo_hang definition

CREATE TABLE `lo_hang` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_san_pham` int NOT NULL,
  `id_chi_tiet_phieu_nhap` int DEFAULT NULL,
  `ma_lo` varchar(100) NOT NULL,
  `so_luong_nhap` int NOT NULL,
  `so_luong_con` int NOT NULL,
  `gia_von` decimal(15,2) NOT NULL,
  `gia_ban` decimal(15,2) NOT NULL,
  `ngay_nhap` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_lo_sanpham` (`id_san_pham`),
  KEY `fk_lo_ctpn` (`id_chi_tiet_phieu_nhap`),
  CONSTRAINT `fk_lo_ctpn` FOREIGN KEY (`id_chi_tiet_phieu_nhap`) REFERENCES `chi_tiet_phieu_nhap` (`id`),
  CONSTRAINT `fk_lo_sanpham` FOREIGN KEY (`id_san_pham`) REFERENCES `san_pham` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

















