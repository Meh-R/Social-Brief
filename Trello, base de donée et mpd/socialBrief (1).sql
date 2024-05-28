CREATE TABLE `user` (
  `id_user` integer(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `email` varchar(55) DEFAULT null,
  `password` varchar(255) DEFAULT null,
  `role_id` integer(11) DEFAULT null,
  `Pseudo` varchar(55) DEFAULT null,
  `created_at` timestamp DEFAULT (now()),
  `updated_at` timestamp NOT NULL DEFAULT (now()) COMMENT 'TODO: Add ON UPDATE ON UPDATE CURRENT_TIMESTAMP',
  `isActive` tinyint(1) NOT NULL
);

CREATE TABLE `role` (
  `id_role` integer(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `name` varchar(11) DEFAULT null
);

CREATE TABLE `follow` (
  `id_follow` integer(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `id_follower` integer(11) DEFAULT null,
  `id_following` integer(11) DEFAULT null
);

ALTER TABLE `user` ADD FOREIGN KEY (`role_id`) REFERENCES `role` (`id_role`);

ALTER TABLE `follow` ADD FOREIGN KEY (`id_following`) REFERENCES `user` (`id_user`);

ALTER TABLE `follow` ADD FOREIGN KEY (`id_follower`) REFERENCES `user` (`id_user`);
