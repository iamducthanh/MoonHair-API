-- MySQL dump 10.13  Distrib 8.0.19, for Win64 (x86_64)
--
-- Host: localhost    Database: moonhair
-- ------------------------------------------------------
-- Server version	8.0.40

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `chi_nhanh`
--

DROP TABLE IF EXISTS `chi_nhanh`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chi_nhanh` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ten` varchar(255) NOT NULL,
  `dia_chi` text NOT NULL,
  `active` bit(1) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chi_nhanh`
--

LOCK TABLES `chi_nhanh` WRITE;
/*!40000 ALTER TABLE `chi_nhanh` DISABLE KEYS */;
INSERT INTO `chi_nhanh` VALUES (1,'MoonHair Thái Bình','Lê Đại Hành',_binary ''),(2,'MoonHair Hải Dương','Chỗ nào Hải Dương ý',_binary ''),(3,'Moon Hair Tây Mỗ','2P5Q+GM7, Tây Mỗ, Bắc Từ Liêm, Hà Nội, Việt Nam',_binary '\0'),(4,'Tạ Ngọc Mai','2P5Q+GM7, Tây Mỗ, Bắc Từ Liêm, Hà Nội, Việt Nam',_binary '\0'),(5,'Hải Dương','2P5Q+GM7, Tây Mỗ, Bắc Từ Liêm, Hà Nội, Việt Nam',_binary '\0'),(6,'MoonHair Phủ Lý','Thành phố Phủ Lý',_binary '');
/*!40000 ALTER TABLE `chi_nhanh` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `loai_san_pham`
--

DROP TABLE IF EXISTS `loai_san_pham`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `loai_san_pham` (
  `code` varchar(255) NOT NULL,
  `ten` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `loai_san_pham`
--

LOCK TABLES `loai_san_pham` WRITE;
/*!40000 ALTER TABLE `loai_san_pham` DISABLE KEYS */;
INSERT INTO `loai_san_pham` VALUES ('HOA_CHAT','Hóa chất'),('SAN_PHAM','Sản phẩm'),('DICH_VU','Dịch vụ');
/*!40000 ALTER TABLE `loai_san_pham` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `nhan_vien`
--

DROP TABLE IF EXISTS `nhan_vien`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `nhan_vien` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ten` varchar(255) NOT NULL,
  `muc_luong` int NOT NULL,
  `id_chi_nhanh` int NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `ngay_tao` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `ngay_sua` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `ten_dang_nhap` varchar(100) DEFAULT NULL,
  `mat_khau` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_chi_nhanh` (`id_chi_nhanh`),
  CONSTRAINT `nhan_vien_ibfk_1` FOREIGN KEY (`id_chi_nhanh`) REFERENCES `chi_nhanh` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1008 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nhan_vien`
--

LOCK TABLES `nhan_vien` WRITE;
/*!40000 ALTER TABLE `nhan_vien` DISABLE KEYS */;
INSERT INTO `nhan_vien` VALUES (1000,'Quyền',20,1,1,'2025-03-17 15:11:31','2025-03-17 15:11:31',NULL,NULL),(1001,'Hiếu',20,1,1,'2025-03-17 15:11:31','2025-03-17 15:11:31',NULL,NULL),(1002,'Nam',20,1,1,'2025-03-16 17:00:00','2025-03-16 17:00:00',NULL,NULL),(1003,'Sơn',8,1,1,'2025-03-17 15:11:31','2025-03-17 15:11:31',NULL,NULL),(1004,'Thạo',8,1,1,'2025-03-17 15:11:31','2025-03-17 15:11:31',NULL,NULL),(1005,'Nguyễn Đức Thành',8,2,1,NULL,'2025-03-20 09:50:56','admin','{noop}123'),(1006,'Tạ Ngọc Mai',20,2,1,'2025-03-18 17:00:00',NULL,NULL,NULL);
/*!40000 ALTER TABLE `nhan_vien` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `san_pham`
--

DROP TABLE IF EXISTS `san_pham`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `san_pham` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ten` varchar(255) NOT NULL,
  `so_luong` int DEFAULT NULL,
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
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `san_pham`
--

LOCK TABLES `san_pham` WRITE;
/*!40000 ALTER TABLE `san_pham` DISABLE KEYS */;
INSERT INTO `san_pham` VALUES (1,'Dầu hấp phục hồi Tigi Bed Head Urban Antidotes',1,320000,'SAN_PHAM','2025-03-22 07:21:45','2025-03-22 07:23:21',0,1,1,'200ml',NULL),(2,'Dầu hấp Collagen phục hồi tóc hư tổn	',4,180000,'SAN_PHAM','2025-03-22 07:23:21','2025-03-22 07:23:21',0,1,1,'500ML',NULL),(3,'Dầu hấp Macadamia Deep Repair Masque	',7,450000,'SAN_PHAM','2025-03-22 07:23:21','2025-03-22 07:23:21',0,1,1,'236ML',NULL),(4,'Dầu hấp phục hồi tóc Moroccanoil Restorative Hair Mask	',12,700000,'SAN_PHAM','2025-03-22 07:23:21','2025-03-22 07:23:21',0,1,1,'250ML',NULL),(5,'Tinh dầu bưởi nguyên chất	',43,100000,'SAN_PHAM','2025-03-22 07:24:52','2025-03-22 07:24:52',0,1,1,'30ML',NULL),(6,'Tinh dầu tràm Huế	',76,60000,'SAN_PHAM','2025-03-22 07:24:52','2025-03-22 07:24:52',0,1,1,'25ML',NULL),(7,'Dầu gội TRESemmé Keratin Smooth	',3,140000,'SAN_PHAM','2025-03-22 07:24:52','2025-03-22 07:24:52',0,1,1,'340ml',NULL),(8,'Cắt',1,1500000,'DICH_VU','2025-03-22 07:28:19','2025-03-25 08:14:14',0,1,1,NULL,NULL),(9,'Hóa chất',150,NULL,'HOA_CHAT','2025-03-22 07:28:19','2025-03-22 07:28:19',0,1,1,NULL,NULL),(10,'Gội',NULL,50000,'DICH_VU','2025-03-22 07:28:19','2025-03-22 07:28:19',0,1,1,NULL,NULL),(11,'Sản phẩm mới',54,45000,'SAN_PHAM',NULL,NULL,0,0,1,'500 ml','Mới tinh'),(12,'Sản phẩm mới 12',42342,67000,'SAN_PHAM',NULL,NULL,0,1,1,'500 ml',''),(13,'Sản phẩm mới 1243',3,42332,'SAN_PHAM',NULL,NULL,0,1,1,'',''),(14,'Sản phẩm mới 1232',34,42334,'SAN_PHAM',NULL,'2025-03-25 08:32:09',1,1,1,'500 ml','3333333333333333333'),(15,'Nguyen Duc Thanh',98,89000,'SAN_PHAM',NULL,'2025-03-25 08:31:36',1,1,1,'800 ml','ghi chú'),(16,'Tạ Ngọc Mai',756,65000,'SAN_PHAM',NULL,'2025-03-25 08:31:28',1,1,1,'','');
/*!40000 ALTER TABLE `san_pham` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'moonhair'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-03-31 23:15:53
