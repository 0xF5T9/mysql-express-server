> MySQL Server deployed with node.js express.

# Prerequisites

-   npm >= v10.5.2
-   node >= v20.13.1
-   MySQL >= v8.4.0

# Install

## 1. Install dependencies

```
npm install
```

## 2. Set environment variables

```
MYSQL_HOST=
MYSQL_USER=
MYSQL_PASSWORD=
MYSQL_DATABASE=
JWT_EXPIRES_IN=
JWT_SECRET_KEY=
NODE_ENV=development
PORT=1284
```

## 3. Create MySQL tables

```sql
-- Users table.
CREATE TABLE `users` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `role` varchar(255) NOT NULL DEFAULT 'member',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
);

-- Credentials table.
CREATE TABLE `credentials` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `password` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  CONSTRAINT `fk_username` FOREIGN KEY (`username`) REFERENCES `users` (`username`) ON UPDATE CASCADE
);

-- Test posts table.
CREATE TABLE `posts` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL,
  `text` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
);
```

# Usage

```
npm start
```
