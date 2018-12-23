CREATE TABLE IF NOT EXISTS `antrian_cs` (
  `kd` int(50) NOT NULL,
  `noantrian` varchar(50) NOT NULL,
  `postdate` datetime NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=68 DEFAULT CHARSET=latin1 ROW_FORMAT=DYNAMIC;

ALTER TABLE `antrian_cs`
  ADD PRIMARY KEY (`kd`);


  CREATE TABLE IF NOT EXISTS `antrian_loket` (
    `kd` int(50) NOT NULL,
    `noantrian` varchar(50) NOT NULL,
    `postdate` datetime NOT NULL
  ) ENGINE=InnoDB AUTO_INCREMENT=6414 DEFAULT CHARSET=latin1 ROW_FORMAT=DYNAMIC;


  ALTER TABLE `antrian_loket`
  ADD PRIMARY KEY (`kd`);
