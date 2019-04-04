CREATE TABLE `bt_backup` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `type` tinyint(3) unsigned DEFAULT '0',
  `name` varchar(64) DEFAULT '',
  `pid` int(11) unsigned DEFAULT '0',
  `filename` varchar(255) DEFAULT '',
  `size` bigint(20) unsigned DEFAULT '0',
  `addtime` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

CREATE TABLE `bt_binding` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `pid` int(11) unsigned DEFAULT '0',
  `domain` varchar(64) DEFAULT '',
  `path` varchar(128) DEFAULT NULL,
  `port` int(7) unsigned DEFAULT '80',
  `addtime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `pid` (`pid`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

CREATE TABLE `bt_config` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `webserver` varchar(24) DEFAULT 'nginx',
  `backup_path` varchar(64) DEFAULT '/www/backup',
  `sites_path` varchar(64) DEFAULT '/www/wwwroot',
  `status` tinyint(3) unsigned DEFAULT '1',
  `mysql_root` varchar(128) DEFAULT 'No',
  `ping` varchar(12) DEFAULT 'true',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

INSERT INTO `bt_config` VALUES (1,'nginx','/www/backup','/www/wwwroot',0,'','true');

CREATE TABLE `bt_databases` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(64) DEFAULT NULL,
  `username` varchar(64) DEFAULT NULL,
  `password` varchar(128) DEFAULT NULL,
  `accept` varchar(24) DEFAULT '127.0.0.1',
  `ps` varchar(64) DEFAULT NULL,
  `addtime` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

CREATE TABLE `bt_firewall` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `port` varchar(24) DEFAULT NULL,
  `ps` varchar(64) DEFAULT NULL,
  `addtime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

INSERT INTO `bt_firewall` VALUES (2,'80','Website default port','2016-06-27 08:54:39'),(3,'888','WEB panel','2016-06-27 08:55:13'),(4,'21','FTP service','2016-06-27 08:55:28'),(5,'22','SSH remote management service','2016-06-27 08:55:42'),(6,'3306','MySQL service','2016-06-27 08:55:55');

CREATE TABLE `bt_ftps` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(32) DEFAULT NULL,
  `password` varchar(128) DEFAULT NULL,
  `path` varchar(128) DEFAULT NULL,
  `status` tinyint(3) unsigned DEFAULT '1',
  `ps` varchar(64) DEFAULT NULL,
  `addtime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

CREATE TABLE `bt_logs` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `type` varchar(32) DEFAULT NULL,
  `log` text,
  `addtime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

CREATE TABLE `bt_sites` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(64) DEFAULT '',
  `domain` text,
  `path` varchar(128) DEFAULT NULL,
  `status` varchar(12) DEFAULT 'Normal',
  `index` varchar(255) DEFAULT 'index.php,default.php,index.html,index.htm,default.html,default.htm',
  `ps` varchar(64) DEFAULT '',
  `addtime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

CREATE TABLE `bt_user` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(32) DEFAULT '',
  `password` varchar(32) DEFAULT '',
  `login_ip` varchar(15) DEFAULT NULL,
  `login_time` varchar(64) DEFAULT '',
  `phone` int(11) unsigned DEFAULT '0',
  `email` varchar(32) DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

INSERT INTO `bt_user` VALUES (1,'admin','',NULL,'0000-00-00 00:00:00',0,'');
