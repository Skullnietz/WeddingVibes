-- phpMyAdmin SQL Dump
-- Recreate the full wedding application schema

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- Table: users
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `openId` varchar(255) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `loginMethod` varchar(50) DEFAULT NULL,
  `role` varchar(20) NOT NULL DEFAULT 'user',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `lastSignedIn` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_openId_unique` (`openId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: rsvps
CREATE TABLE IF NOT EXISTS `rsvps` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) NOT NULL,
  `guestName` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `isAttending` tinyint(1) NOT NULL DEFAULT 0,
  `numberOfCompanions` int(11) DEFAULT 0,
  `dietaryRestrictions` text DEFAULT NULL,
  `needsTransport` tinyint(1) DEFAULT 0,
  `transportFrom` varchar(255) DEFAULT NULL,
  `specialRequests` text DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: companions
CREATE TABLE IF NOT EXISTS `companions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `rsvpId` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `dietaryRestrictions` text DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: weddingPhotos
CREATE TABLE IF NOT EXISTS `weddingPhotos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `imageUrl` varchar(1024) NOT NULL,
  `category` varchar(100) DEFAULT 'general',
  `status` varchar(20) NOT NULL DEFAULT 'pending',
  `uploadedBy` int(11) DEFAULT NULL,
  `displayOrder` int(11) DEFAULT 0,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: preWeddingPhotos
CREATE TABLE IF NOT EXISTS `preWeddingPhotos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `imageUrl` varchar(1024) NOT NULL,
  `displayOrder` int(11) DEFAULT 0,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: invitations
CREATE TABLE IF NOT EXISTS `invitations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `slug` varchar(255) NOT NULL,
  `guestName` varchar(255) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `invitations_slug_unique` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: songRequests
CREATE TABLE IF NOT EXISTS `songRequests` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `trackId` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `artist` varchar(255) NOT NULL,
  `coverUrl` varchar(1024) DEFAULT NULL,
  `requestedBy` varchar(255) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

COMMIT;
