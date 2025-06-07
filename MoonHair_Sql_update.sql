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











