-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               8.0.34 - MySQL Community Server - GPL
-- Server OS:                    Win64
-- HeidiSQL Version:             12.10.0.7000
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for simdb
CREATE DATABASE IF NOT EXISTS `simdb` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `simdb`;

-- Dumping structure for table simdb.banner
CREATE TABLE IF NOT EXISTS `banner` (
  `id` int NOT NULL AUTO_INCREMENT,
  `char_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '0',
  `player_ign` varchar(50) NOT NULL DEFAULT '',
  `copy` int DEFAULT '0',
  `pity` json NOT NULL COMMENT '[pity,status]',
  `p_prime` int NOT NULL DEFAULT (0),
  `c` int NOT NULL DEFAULT (0),
  `c_total` int NOT NULL DEFAULT (0),
  `c_limited` int NOT NULL DEFAULT (0),
  `action` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `copy` (`copy`),
  KEY `banner_char` (`char_id`) USING BTREE,
  KEY `player_ign` (`player_ign`),
  CONSTRAINT `banner_char` FOREIGN KEY (`char_id`) REFERENCES `character` (`id`),
  CONSTRAINT `banner_ign` FOREIGN KEY (`player_ign`) REFERENCES `player` (`ign`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table simdb.character
CREATE TABLE IF NOT EXISTS `character` (
  `id` varchar(50) NOT NULL DEFAULT '000_char',
  `limited` tinyint(1) DEFAULT '1',
  `char_name` varchar(50) NOT NULL DEFAULT '',
  `class` varchar(50) NOT NULL DEFAULT '',
  `gender` enum('male','female') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'female',
  `tier` enum('high','mid','low') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'mid',
  `base_dmg` int NOT NULL DEFAULT (0),
  `c4_mult` int DEFAULT NULL,
  `c6_mult` int DEFAULT NULL,
  `sp_bmult` int DEFAULT NULL,
  `sp_4mult` int DEFAULT NULL,
  `sp_6mult` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table simdb.inventory
CREATE TABLE IF NOT EXISTS `inventory` (
  `id` int NOT NULL AUTO_INCREMENT,
  `player_id` int NOT NULL DEFAULT '0',
  `banner_id` int DEFAULT NULL,
  `ign_char_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '''000_char''',
  `cons` int DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `player_id` (`player_id`),
  KEY `cons` (`cons`),
  KEY `banner_id` (`banner_id`),
  CONSTRAINT `invent_banner` FOREIGN KEY (`banner_id`) REFERENCES `banner` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `invent_player` FOREIGN KEY (`player_id`) REFERENCES `player` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=47 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table simdb.player
CREATE TABLE IF NOT EXISTS `player` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ign` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `group` enum('whale','dolphin','f2p') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'f2p',
  `starglitter` int DEFAULT '0',
  `stardust` int DEFAULT '0',
  `fate` int DEFAULT '0',
  `tp_banner` int DEFAULT '0',
  `tp_total` int DEFAULT '0',
  `boss` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `ign` (`ign`)
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for trigger simdb.auto_insert_invent
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';
DELIMITER //
CREATE TRIGGER `auto_insert_invent` AFTER INSERT ON `player` FOR EACH ROW BEGIN
    DECLARE new_inventory_id INT;

    -- Insert inventory for the new player
    INSERT INTO inventory (player_id, cons) VALUES (NEW.id, 0);
    
    
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

-- Dumping structure for trigger simdb.insert_formatted_invent
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';
DELIMITER //
CREATE TRIGGER `insert_formatted_invent` BEFORE INSERT ON `inventory` FOR EACH ROW BEGIN
	SET NEW.ign_char_id = CONCAT((SELECT ign FROM player WHERE id = NEW.player_id), '-000-char');    
    
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
