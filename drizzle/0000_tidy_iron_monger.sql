CREATE TABLE `customerOrderItems` (
	`id` int AUTO_INCREMENT NOT NULL,
	`orderId` int NOT NULL,
	`productId` varchar(100) NOT NULL,
	`productName` varchar(180) NOT NULL,
	`unitPriceCents` int NOT NULL,
	`size` varchar(20) NOT NULL,
	`quantity` int NOT NULL,
	CONSTRAINT `customerOrderItems_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `customerOrders` (
	`id` int AUTO_INCREMENT NOT NULL,
	`customerName` varchar(180) NOT NULL,
	`customerPhone` varchar(40) NOT NULL,
	`totalCents` int NOT NULL,
	`status` enum('sent_whatsapp') NOT NULL DEFAULT 'sent_whatsapp',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `customerOrders_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `productImages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`productId` varchar(100) NOT NULL,
	`url` text NOT NULL,
	`storageKey` varchar(512),
	`alt` varchar(180),
	`position` int NOT NULL DEFAULT 0,
	CONSTRAINT `productImages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `productSizes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`productId` varchar(100) NOT NULL,
	`size` varchar(20) NOT NULL,
	`available` boolean NOT NULL DEFAULT true,
	`position` int NOT NULL DEFAULT 0,
	CONSTRAINT `productSizes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `storeProducts` (
	`id` varchar(100) NOT NULL,
	`name` varchar(180) NOT NULL,
	`description` text NOT NULL,
	`priceCents` int NOT NULL,
	`category` varchar(40) NOT NULL,
	`badge` varchar(60),
	`tagsJson` text NOT NULL,
	`shopeeUrl` varchar(2048),
	`active` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `storeProducts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`openId` varchar(64) NOT NULL,
	`name` text,
	`email` varchar(320),
	`loginMethod` varchar(64),
	`role` enum('user','admin') NOT NULL DEFAULT 'user',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastSignedIn` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_openId_unique` UNIQUE(`openId`)
);
--> statement-breakpoint
CREATE INDEX `orderItems_order_idx` ON `customerOrderItems` (`orderId`);--> statement-breakpoint
CREATE INDEX `productImages_product_idx` ON `productImages` (`productId`);--> statement-breakpoint
CREATE INDEX `productSizes_product_idx` ON `productSizes` (`productId`);