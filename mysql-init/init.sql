CREATE DATABASE IF NOT EXISTS `bank_app` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `bank_app`;

CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `users` (`id`, `username`, `password`) VALUES
  (1,'testuser','password123'),
  (2,'ja','ja'),
  (3,'hallå','hallå'),
  (4,'a','a'),
  (6,'hej','hej'),
  (7,'bajs','bajs'),
  (8,'knas','knas'),
  (9,'mm','mm');

CREATE TABLE `accounts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `amount` decimal(10,2) DEFAULT '0.00',
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `accounts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `accounts` (`id`, `user_id`, `amount`) VALUES
  (1,1,1000.00),
  (2,2,0.00),
  (3,3,0.00),
  (4,6,0.00),
  (5,7,0.02),
  (6,8,0.03),
  (7,9,0.01);

CREATE TABLE `sessions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `token` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `token` (`token`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `sessions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `sessions` (`id`, `user_id`, `token`) VALUES
  (1,1,'randomtoken123'),
  (2,6,'602339'),
  (3,7,'504623'),
  (4,7,'486607'),
  (5,7,'553528'),
  (6,8,'379597'),
  (7,9,'950775'),
  (8,9,'745898'),
  (9,9,'513762'),
  (10,9,'228768');
