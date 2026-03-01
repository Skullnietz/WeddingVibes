CREATE TABLE `invitations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`guestName` text NOT NULL,
	`createdAt` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `invitations_slug_unique` ON `invitations` (`slug`);--> statement-breakpoint
CREATE TABLE `songRequests` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`trackId` text NOT NULL,
	`title` text NOT NULL,
	`artist` text NOT NULL,
	`coverUrl` text,
	`requestedBy` text,
	`createdAt` integer NOT NULL
);
