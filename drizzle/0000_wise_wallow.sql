CREATE TABLE `companions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`rsvpId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`dietaryRestrictions` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `companions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `invitations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(255) NOT NULL,
	`guestName` varchar(255) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `invitations_id` PRIMARY KEY(`id`),
	CONSTRAINT `invitations_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `preWeddingPhotos` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255),
	`description` text,
	`imageUrl` varchar(1024) NOT NULL,
	`displayOrder` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `preWeddingPhotos_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `rsvps` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`guestName` varchar(255) NOT NULL,
	`email` varchar(255),
	`phone` varchar(50),
	`isAttending` boolean NOT NULL DEFAULT false,
	`numberOfCompanions` int DEFAULT 0,
	`dietaryRestrictions` text,
	`needsTransport` boolean DEFAULT false,
	`transportFrom` varchar(255),
	`specialRequests` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `rsvps_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `songRequests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`trackId` varchar(255) NOT NULL,
	`title` varchar(255) NOT NULL,
	`artist` varchar(255) NOT NULL,
	`coverUrl` varchar(1024),
	`requestedBy` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `songRequests_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`openId` varchar(255) NOT NULL,
	`name` varchar(255),
	`email` varchar(255),
	`loginMethod` varchar(50),
	`role` varchar(20) NOT NULL DEFAULT 'user',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastSignedIn` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_openId_unique` UNIQUE(`openId`)
);
--> statement-breakpoint
CREATE TABLE `weddingPhotos` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255),
	`description` text,
	`imageUrl` varchar(1024) NOT NULL,
	`category` varchar(100) DEFAULT 'general',
	`displayOrder` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `weddingPhotos_id` PRIMARY KEY(`id`)
);
