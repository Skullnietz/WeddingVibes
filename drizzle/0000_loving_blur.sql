CREATE TABLE `companions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`rsvpId` integer NOT NULL,
	`name` text NOT NULL,
	`dietaryRestrictions` text,
	`createdAt` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `preWeddingPhotos` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text,
	`description` text,
	`imageUrl` text NOT NULL,
	`displayOrder` integer DEFAULT 0,
	`createdAt` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `rsvps` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`userId` integer NOT NULL,
	`guestName` text NOT NULL,
	`email` text,
	`phone` text,
	`isAttending` integer DEFAULT false NOT NULL,
	`numberOfCompanions` integer DEFAULT 0,
	`dietaryRestrictions` text,
	`needsTransport` integer DEFAULT false,
	`transportFrom` text,
	`specialRequests` text,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`openId` text NOT NULL,
	`name` text,
	`email` text,
	`loginMethod` text,
	`role` text DEFAULT 'user' NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	`lastSignedIn` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_openId_unique` ON `users` (`openId`);--> statement-breakpoint
CREATE TABLE `weddingPhotos` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text,
	`description` text,
	`imageUrl` text NOT NULL,
	`category` text DEFAULT 'general',
	`displayOrder` integer DEFAULT 0,
	`createdAt` integer NOT NULL
);
