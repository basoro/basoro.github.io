#!/bin/bash
PATH=/bin:/sbin:/usr/bin:/usr/sbin:/usr/local/bin:/usr/local/sbin:~/bin
export PATH

download_Url=$NODE_URL

Root_Path=`cat /var/bt_setupPath.conf`
Setup_Path=$Root_Path/server/mysql
Data_Path=$Root_Path/server/data
Is_64bit=`getconf LONG_BIT`
run_path='/root'
mysql_55='5.5.62'
mysql_56='5.6.44'
mysql_57='5.7.26'
#mysql_80='8.0.16'
#mariadb_55='5.5.55'
#mariadb_100='10.0.38'
#mariadb_101='10.1.40'
#mariadb_102='10.2.24'
#mariadb_103='10.3.15'

if [ -z "${cpuCore}" ]; then
	cpuCore="1"
fi

#检测hosts文件
hostfile=`cat /etc/hosts | grep 127.0.0.1 | grep localhost`
if [ "${hostfile}" = '' ]; then
	echo "127.0.0.1  localhost  localhost.localdomain" >> /etc/hosts
fi

gccVersionCheck(){
	gccV=$(gcc -dumpversion|grep ^[78])
	if [ "${gccV}" ]; then
		sed -i "s/field_names\[i\]\[num_fields\*2\].*/field_names\[i\]\[num_fields\*2\]= NULL;/" client/mysql.cc
	fi
}

Service_Add(){
	if [ "${PM}" == "yum" ] || [ "${PM}" == "dnf" ]; then
		chkconfig --add mysqld
		chkconfig --level 2345 mysqld on
	elif [ "${PM}" == "apt-get" ]; then
		update-rc.d mysqld defaults
	fi
}
Service_Del(){
 	if [ "${PM}" == "yum" ] || [ "${PM}" == "dnf" ]; then
		chkconfig --del mysqld
		chkconfig --level 2345 mysqld off
	elif [ "${PM}" == "apt-get" ]; then
		update-rc.d mysqld remove
	fi
}

printVersion(){
	if [ -z "${mariadbCheck}" ]; then
		echo "${sqlVersion}" > ${Setup_Path}/version.pl
	else
		echo "mariadb_${sqlVersion}" > ${Setup_Path}/version.pl
	fi
}

Setup_Mysql_PyDb(){
	pyMysql=$1
	pyMysqlVer=$2

	wget -O src.zip ${download_Url}/install/src/${pyMysql}-${pyMysqlVer}.zip -T 20
	unzip src.zip
	mv ${pyMysql}-${pyMysqlVer} src
	cd src
	python setup.py install
	cd ..
	rm -f src.zip
	rm -rf src
	/etc/init.d/bt reload

}
Install_Mysql_PyDb(){
	pip uninstall MySQL-python mysqlclient PyMySQL -y
	pyVersion=$(python -V 2>&1|awk '{printf ("%d",$2)}')
	if [ -f "${Setup_Path}/mysqlDb3.pl" ]; then
		local pyMysql="mysqlclient"
		local pyMysqlVer="1.3.12"
	elif [ "${pyVersion}" = "2" ]; then
		local pyMysql="MySQL-python"
		local pyMysqlVer="1.2.5"
	else
		local pyMysql="PyMySQL"
		local pyMysqlVer="0.9.3"
	fi
	pipUrl=$(cat /root/.pip/pip.conf|awk 'NR==2 {print $3}')
	[ "${pipUrl}" ] && checkPip=$(curl --connect-timeout 5 --head -s -o /dev/null -w %{http_code} ${pipUrl})
	if [ "${checkPip}" = "200" ];then
		pip install ${pyMysql}
		[ "${pyVersion}" = "2" ] && pip install PyMySQL
	else
		Setup_Mysql_PyDb ${pyMysql} ${pyMysqlVer}
		[ "${pyVersion}" = "2" ] && Setup_Mysql_PyDb "PyMySQL" "0.9.3"
	fi
}
Drop_Test_Databashes(){
	sleep 1
	/etc/init.d/mysqld stop
	pkill -9 mysqld_safe
	pkill -9 mysql
	sleep 1
	/etc/init.d/mysqld start
	sleep 1
	/www/server/mysql/bin/mysql -uroot -p$mysqlpwd -e "drop database test";

}
#删除软链
DelLink()
{
	rm -f /usr/bin/mysql*
	rm -f /usr/lib/libmysql*
	rm -f /usr/lib64/libmysql*
}
#设置软件链
SetLink()
{
	ln -sf ${Setup_Path}/bin/mysql /usr/bin/mysql
	ln -sf ${Setup_Path}/bin/mysqldump /usr/bin/mysqldump
	ln -sf ${Setup_Path}/bin/myisamchk /usr/bin/myisamchk
	ln -sf ${Setup_Path}/bin/mysqld_safe /usr/bin/mysqld_safe
	ln -sf ${Setup_Path}/bin/mysqlcheck /usr/bin/mysqlcheck
	ln -sf ${Setup_Path}/bin/mysql_config /usr/bin/mysql_config

	rm -f /usr/lib/libmysqlclient.so.16
	rm -f /usr/lib64/libmysqlclient.so.16
	rm -f /usr/lib/libmysqlclient.so.18
	rm -f /usr/lib64/libmysqlclient.so.18
	rm -f /usr/lib/libmysqlclient.so.20
	rm -f /usr/lib64/libmysqlclient.so.20
	rm -f /usr/lib/libmysqlclient.so.21
	rm -f /usr/lib64/libmysqlclient.so.21

	if [ -f "${Setup_Path}/lib/libmysqlclient.so.18" ];then
		ln -sf ${Setup_Path}/lib/libmysqlclient.so.18 /usr/lib/libmysqlclient.so.16
		ln -sf ${Setup_Path}/lib/libmysqlclient.so.18 /usr/lib64/libmysqlclient.so.16
		ln -sf ${Setup_Path}/lib/libmysqlclient.so.18 /usr/lib/libmysqlclient.so.18
		ln -sf ${Setup_Path}/lib/libmysqlclient.so.18 /usr/lib64/libmysqlclient.so.18
		ln -sf ${Setup_Path}/lib/libmysqlclient.so.18 /usr/lib/libmysqlclient.so.20
		ln -sf ${Setup_Path}/lib/libmysqlclient.so.18 /usr/lib64/libmysqlclient.so.20
	elif [ -f "${Setup_Path}/lib/mysql/libmysqlclient.so.18" ];then
		ln -sf ${Setup_Path}/lib/mysql/libmysqlclient.so.18 /usr/lib/libmysqlclient.so.16
		ln -sf ${Setup_Path}/lib/mysql/libmysqlclient.so.18 /usr/lib64/libmysqlclient.so.16
		ln -sf ${Setup_Path}/lib/mysql/libmysqlclient.so.18 /usr/lib/libmysqlclient.so.18
		ln -sf ${Setup_Path}/lib/mysql/libmysqlclient.so.18 /usr/lib64/libmysqlclient.so.18
		ln -sf ${Setup_Path}/lib/mysql/libmysqlclient.so.18 /usr/lib/libmysqlclient.so.20
		ln -sf ${Setup_Path}/lib/mysql/libmysqlclient.so.18 /usr/lib64/libmysqlclient.so.20
	elif [ -f "${Setup_Path}/lib/libmysqlclient.so.16" ];then
		ln -sf ${Setup_Path}/lib/libmysqlclient.so.16 /usr/lib/libmysqlclient.so.16
		ln -sf ${Setup_Path}/lib/libmysqlclient.so.16 /usr/lib64/libmysqlclient.so.16
		ln -sf ${Setup_Path}/lib/libmysqlclient.so.16 /usr/lib/libmysqlclient.so.18
		ln -sf ${Setup_Path}/lib/libmysqlclient.so.16 /usr/lib64/libmysqlclient.so.18
		ln -sf ${Setup_Path}/lib/libmysqlclient.so.16 /usr/lib/libmysqlclient.so.20
		ln -sf ${Setup_Path}/lib/libmysqlclient.so.16 /usr/lib64/libmysqlclient.so.20
	elif [ -f "${Setup_Path}/lib/mysql/libmysqlclient.so.16" ];then
		ln -sf ${Setup_Path}/lib/mysql/libmysqlclient.so.16 /usr/lib/libmysqlclient.so.16
		ln -sf ${Setup_Path}/lib/mysql/libmysqlclient.so.16 /usr/lib64/libmysqlclient.so.16
		ln -sf ${Setup_Path}/lib/mysql/libmysqlclient.so.16 /usr/lib/libmysqlclient.so.18
		ln -sf ${Setup_Path}/lib/mysql/libmysqlclient.so.16 /usr/lib64/libmysqlclient.so.18
		ln -sf ${Setup_Path}/lib/mysql/libmysqlclient.so.16 /usr/lib/libmysqlclient.so.20
		ln -sf ${Setup_Path}/lib/mysql/libmysqlclient.so.16 /usr/lib64/libmysqlclient.so.20
	elif [ -f "${Setup_Path}/lib/libmysqlclient_r.so.16" ];then
		ln -sf ${Setup_Path}/lib/libmysqlclient_r.so.16 /usr/lib/libmysqlclient_r.so.16
		ln -sf ${Setup_Path}/lib/libmysqlclient_r.so.16 /usr/lib64/libmysqlclient_r.so.16
	elif [ -f "${Setup_Path}/lib/mysql/libmysqlclient_r.so.16" ];then
		ln -sf ${Setup_Path}/lib/mysql/libmysqlclient_r.so.16 /usr/lib/libmysqlclient_r.so.16
		ln -sf ${Setup_Path}/lib/mysql/libmysqlclient_r.so.16 /usr/lib64/libmysqlclient_r.so.16
	elif [ -f "${Setup_Path}/lib/libmysqlclient.so.20" ];then
		ln -sf ${Setup_Path}/lib/libmysqlclient.so.20 /usr/lib/libmysqlclient.so.16
		ln -sf ${Setup_Path}/lib/libmysqlclient.so.20 /usr/lib64/libmysqlclient.so.16
		ln -sf ${Setup_Path}/lib/libmysqlclient.so.20 /usr/lib/libmysqlclient.so.18
		ln -sf ${Setup_Path}/lib/libmysqlclient.so.20 /usr/lib64/libmysqlclient.so.18
		ln -sf ${Setup_Path}/lib/libmysqlclient.so.20 /usr/lib/libmysqlclient.so.20
		ln -sf ${Setup_Path}/lib/libmysqlclient.so.20 /usr/lib64/libmysqlclient.so.20
	elif [ -f "${Setup_Path}/lib/libmysqlclient.so.21" ];then
		ln -sf ${Setup_Path}/lib/libmysqlclient.so.21 /usr/lib/libmysqlclient.so.16
		ln -sf ${Setup_Path}/lib/libmysqlclient.so.21 /usr/lib64/libmysqlclient.so.16
		ln -sf ${Setup_Path}/lib/libmysqlclient.so.21 /usr/lib/libmysqlclient.so.18
		ln -sf ${Setup_Path}/lib/libmysqlclient.so.21 /usr/lib64/libmysqlclient.so.18
		ln -sf ${Setup_Path}/lib/libmysqlclient.so.21 /usr/lib/libmysqlclient.so.20
		ln -sf ${Setup_Path}/lib/libmysqlclient.so.21 /usr/lib64/libmysqlclient.so.20
		ln -sf ${Setup_Path}/lib/libmysqlclient.so.21 /usr/lib/libmysqlclient.so.21
		ln -sf ${Setup_Path}/lib/libmysqlclient.so.21 /usr/lib64/libmysqlclient.so.21
	elif [ -f "${Setup_Path}/lib/libmariadb.so.3" ]; then
		ln -sf ${Setup_Path}/lib/libmariadb.so.3 /usr/lib/libmysqlclient.so.16
		ln -sf ${Setup_Path}/lib/libmariadb.so.3 /usr/lib64/libmysqlclient.so.16
		ln -sf ${Setup_Path}/lib/libmariadb.so.3 /usr/lib/libmysqlclient.so.18
		ln -sf ${Setup_Path}/lib/libmariadb.so.3 /usr/lib64/libmysqlclient.so.18
		ln -sf ${Setup_Path}/lib/libmariadb.so.3 /usr/lib/libmysqlclient.so.20
		ln -sf ${Setup_Path}/lib/libmariadb.so.3 /usr/lib64/libmysqlclient.so.20
		ln -sf ${Setup_Path}/lib/libmariadb.so.3 /usr/lib/libmysqlclient.so.21
		ln -sf ${Setup_Path}/lib/libmariadb.so.3 /usr/lib64/libmysqlclient.so.21
	elif [ -f "${Setup_Path}/lib/mysql/libmysqlclient.so.20" ];then
		ln -sf ${Setup_Path}/lib/mysql/libmysqlclient.so.20 /usr/lib/libmysqlclient.so.16
		ln -sf ${Setup_Path}/lib/mysql/libmysqlclient.so.20 /usr/lib64/libmysqlclient.so.16
		ln -sf ${Setup_Path}/lib/mysql/libmysqlclient.so.20 /usr/lib/libmysqlclient.so.18
		ln -sf ${Setup_Path}/lib/mysql/libmysqlclient.so.20 /usr/lib64/libmysqlclient.so.18
		ln -sf ${Setup_Path}/lib/mysql/libmysqlclient.so.20 /usr/lib/libmysqlclient.so.20
		ln -sf ${Setup_Path}/lib/mysql/libmysqlclient.so.20 /usr/lib64/libmysqlclient.so.20
	fi
}

My_Cnf(){
	defaultEngine="InnoDB"
	cat > /etc/my.cnf<<EOF
[client]
#password	= your_password
port		= 3306
socket		= /tmp/mysql.sock

[mysqld]
port		= 3306
socket		= /tmp/mysql.sock
datadir = ${Data_Path}
default_storage_engine = ${defaultEngine}
skip-external-locking
key_buffer_size = 8M
max_allowed_packet = 100G
table_open_cache = 32
sort_buffer_size = 256K
net_buffer_length = 4K
read_buffer_size = 128K
read_rnd_buffer_size = 256K
myisam_sort_buffer_size = 4M
thread_cache_size = 4
query_cache_size = 4M
tmp_table_size = 8M
sql-mode=NO_ENGINE_SUBSTITUTION,STRICT_TRANS_TABLES

#skip-name-resolve
max_connections = 500
max_connect_errors = 100
open_files_limit = 65535

log-bin=mysql-bin
binlog_format=mixed
server-id = 1
slow_query_log=1
slow-query-log-file=${Data_Path}/mysql-slow.log
long_query_time=3
#log_queries_not_using_indexes=on


innodb_data_home_dir = ${Data_Path}
innodb_data_file_path = ibdata1:10M:autoextend
innodb_log_group_home_dir = ${Data_Path}
innodb_buffer_pool_size = 16M
innodb_log_file_size = 5M
innodb_log_buffer_size = 8M
innodb_flush_log_at_trx_commit = 1
innodb_lock_wait_timeout = 50

[mysqldump]
quick
max_allowed_packet = 500M

[mysql]
no-auto-rehash

[myisamchk]
key_buffer_size = 20M
sort_buffer_size = 20M
read_buffer = 2M
write_buffer = 2M

[mysqlhotcopy]
interactive-timeout
EOF

	if [ "${version}" == "8.0" ]; then
		sed -i '/server-id/a\binlog_expire_logs_seconds = 600000' /etc/my.cnf
		sed -i '/tmp_table_size/a\default_authentication_plugin = mysql_native_password' /etc/my.cnf
		sed -i '/default_authentication_plugin/a\lower_case_table_names = 1' /etc/my.cnf
		sed -i '/query_cache_size/d' /etc/my.cnf
	else
		sed -i '/server-id/a\expire_logs_days = 10' /etc/my.cnf
	fi

	if [ "${version}" != "5.5" ];then
		sed -i '/skip-external-locking/i\table_definition_cache = 400' /etc/my.cnf
		sed -i '/table_definition_cache/i\performance_schema_max_table_instances = 400' /etc/my.cnf
	fi

	sed -i '/innodb_lock_wait_timeout/a\innodb_max_dirty_pages_pct = 90' /etc/my.cnf
	sed -i '/innodb_max_dirty_pages_pct/a\innodb_read_io_threads = 4' /etc/my.cnf
	sed -i '/innodb_read_io_threads/a\innodb_write_io_threads = 4' /etc/my.cnf

	[ "${version}" == "5.5" ] && sed -i '/STRICT_TRANS_TABLES/d' /etc/my.cnf
	[ "${version}" == "5.7" ] || [ "${version}" == "8.0" ] && sed -i '/#log_queries_not_using_indexes/a\early-plugin-load = ""' /etc/my.cnf
	[ "${version}" == "5.6" ] || [ "${version}" == "5.7" ] || [ "${version}" == "8.0" ] && sed -i '/#skip-name-resolve/i\explicit_defaults_for_timestamp = true' /etc/my.cnf

}

MySQL_Opt()
{
	cpuInfo=`cat /proc/cpuinfo |grep "processor"|wc -l`
	sed -i 's/innodb_write_io_threads = 4/innodb_write_io_threads = '${cpuInfo}'/g' /etc/my.cnf
	sed -i 's/innodb_read_io_threads = 4/innodb_read_io_threads = '${cpuInfo}'/g' /etc/my.cnf
	MemTotal=`free -m | grep Mem | awk '{print  $2}'`
	if [[ ${MemTotal} -gt 1024 && ${MemTotal} -lt 2048 ]]; then
		sed -i "s#^key_buffer_size.*#key_buffer_size = 32M#" /etc/my.cnf
		sed -i "s#^table_open_cache.*#table_open_cache = 128#" /etc/my.cnf
		sed -i "s#^sort_buffer_size.*#sort_buffer_size = 768K#" /etc/my.cnf
		sed -i "s#^read_buffer_size.*#read_buffer_size = 768K#" /etc/my.cnf
		sed -i "s#^myisam_sort_buffer_size.*#myisam_sort_buffer_size = 8M#" /etc/my.cnf
		sed -i "s#^thread_cache_size.*#thread_cache_size = 16#" /etc/my.cnf
		sed -i "s#^query_cache_size.*#query_cache_size = 16M#" /etc/my.cnf
		sed -i "s#^tmp_table_size.*#tmp_table_size = 32M#" /etc/my.cnf
		sed -i "s#^innodb_buffer_pool_size.*#innodb_buffer_pool_size = 128M#" /etc/my.cnf
		sed -i "s#^innodb_log_file_size.*#innodb_log_file_size = 64M#" /etc/my.cnf
		sed -i "s#^innodb_log_buffer_size.*#innodb_log_buffer_size = 16M#" /etc/my.cnf
	elif [[ ${MemTotal} -ge 2048 && ${MemTotal} -lt 4096 ]]; then
		sed -i "s#^key_buffer_size.*#key_buffer_size = 64M#" /etc/my.cnf
		sed -i "s#^table_open_cache.*#table_open_cache = 256#" /etc/my.cnf
		sed -i "s#^sort_buffer_size.*#sort_buffer_size = 1M#" /etc/my.cnf
		sed -i "s#^read_buffer_size.*#read_buffer_size = 1M#" /etc/my.cnf
		sed -i "s#^myisam_sort_buffer_size.*#myisam_sort_buffer_size = 16M#" /etc/my.cnf
		sed -i "s#^thread_cache_size.*#thread_cache_size = 32#" /etc/my.cnf
		sed -i "s#^query_cache_size.*#query_cache_size = 32M#" /etc/my.cnf
		sed -i "s#^tmp_table_size.*#tmp_table_size = 64M#" /etc/my.cnf
		sed -i "s#^innodb_buffer_pool_size.*#innodb_buffer_pool_size = 256M#" /etc/my.cnf
		sed -i "s#^innodb_log_file_size.*#innodb_log_file_size = 128M#" /etc/my.cnf
		sed -i "s#^innodb_log_buffer_size.*#innodb_log_buffer_size = 32M#" /etc/my.cnf
	elif [[ ${MemTotal} -ge 4096 && ${MemTotal} -lt 8192 ]]; then
		sed -i "s#^key_buffer_size.*#key_buffer_size = 128M#" /etc/my.cnf
		sed -i "s#^table_open_cache.*#table_open_cache = 512#" /etc/my.cnf
		sed -i "s#^sort_buffer_size.*#sort_buffer_size = 2M#" /etc/my.cnf
		sed -i "s#^read_buffer_size.*#read_buffer_size = 2M#" /etc/my.cnf
		sed -i "s#^myisam_sort_buffer_size.*#myisam_sort_buffer_size = 32M#" /etc/my.cnf
		sed -i "s#^thread_cache_size.*#thread_cache_size = 64#" /etc/my.cnf
		sed -i "s#^query_cache_size.*#query_cache_size = 64M#" /etc/my.cnf
		sed -i "s#^tmp_table_size.*#tmp_table_size = 64M#" /etc/my.cnf
		sed -i "s#^innodb_buffer_pool_size.*#innodb_buffer_pool_size = 512M#" /etc/my.cnf
		sed -i "s#^innodb_log_file_size.*#innodb_log_file_size = 256M#" /etc/my.cnf
		sed -i "s#^innodb_log_buffer_size.*#innodb_log_buffer_size = 64M#" /etc/my.cnf
	elif [[ ${MemTotal} -ge 8192 && ${MemTotal} -lt 16384 ]]; then
		sed -i "s#^key_buffer_size.*#key_buffer_size = 256M#" /etc/my.cnf
		sed -i "s#^table_open_cache.*#table_open_cache = 1024#" /etc/my.cnf
		sed -i "s#^sort_buffer_size.*#sort_buffer_size = 4M#" /etc/my.cnf
		sed -i "s#^read_buffer_size.*#read_buffer_size = 4M#" /etc/my.cnf
		sed -i "s#^myisam_sort_buffer_size.*#myisam_sort_buffer_size = 64M#" /etc/my.cnf
		sed -i "s#^thread_cache_size.*#thread_cache_size = 128#" /etc/my.cnf
		sed -i "s#^query_cache_size.*#query_cache_size = 128M#" /etc/my.cnf
		sed -i "s#^tmp_table_size.*#tmp_table_size = 128M#" /etc/my.cnf
		sed -i "s#^innodb_buffer_pool_size.*#innodb_buffer_pool_size = 1024M#" /etc/my.cnf
		sed -i "s#^innodb_log_file_size.*#innodb_log_file_size = 512M#" /etc/my.cnf
		sed -i "s#^innodb_log_buffer_size.*#innodb_log_buffer_size = 128M#" /etc/my.cnf
	elif [[ ${MemTotal} -ge 16384 && ${MemTotal} -lt 32768 ]]; then
		sed -i "s#^key_buffer_size.*#key_buffer_size = 512M#" /etc/my.cnf
		sed -i "s#^table_open_cache.*#table_open_cache = 2048#" /etc/my.cnf
		sed -i "s#^sort_buffer_size.*#sort_buffer_size = 8M#" /etc/my.cnf
		sed -i "s#^read_buffer_size.*#read_buffer_size = 8M#" /etc/my.cnf
		sed -i "s#^myisam_sort_buffer_size.*#myisam_sort_buffer_size = 128M#" /etc/my.cnf
		sed -i "s#^thread_cache_size.*#thread_cache_size = 256#" /etc/my.cnf
		sed -i "s#^query_cache_size.*#query_cache_size = 256M#" /etc/my.cnf
		sed -i "s#^tmp_table_size.*#tmp_table_size = 256M#" /etc/my.cnf
		sed -i "s#^innodb_buffer_pool_size.*#innodb_buffer_pool_size = 2048M#" /etc/my.cnf
		sed -i "s#^innodb_log_file_size.*#innodb_log_file_size = 1024M#" /etc/my.cnf
		sed -i "s#^innodb_log_buffer_size.*#innodb_log_buffer_size = 256M#" /etc/my.cnf
	elif [[ ${MemTotal} -ge 32768 ]]; then
		sed -i "s#^key_buffer_size.*#key_buffer_size = 1024M#" /etc/my.cnf
		sed -i "s#^table_open_cache.*#table_open_cache = 4096#" /etc/my.cnf
		sed -i "s#^sort_buffer_size.*#sort_buffer_size = 16M#" /etc/my.cnf
		sed -i "s#^read_buffer_size.*#read_buffer_size = 16M#" /etc/my.cnf
		sed -i "s#^myisam_sort_buffer_size.*#myisam_sort_buffer_size = 256M#" /etc/my.cnf
		sed -i "s#^thread_cache_size.*#thread_cache_size = 512#" /etc/my.cnf
		sed -i "s#^query_cache_size.*#query_cache_size = 512M#" /etc/my.cnf
		sed -i "s#^tmp_table_size.*#tmp_table_size = 512M#" /etc/my.cnf
		sed -i "s#^innodb_buffer_pool_size.*#innodb_buffer_pool_size = 4096M#" /etc/my.cnf
	if [ "${version}" == "5.5" ];then
			sed -i "s#^innodb_log_file_size.*#innodb_log_file_size = 1024M#" /etc/my.cnf
			sed -i "s#^innodb_log_buffer_size.*#innodb_log_buffer_size = 256M#" /etc/my.cnf
		else
			sed -i "s#^innodb_log_file_size.*#innodb_log_file_size = 2048M#" /etc/my.cnf
			sed -i "s#^innodb_log_buffer_size.*#innodb_log_buffer_size = 512M#" /etc/my.cnf
		fi
	fi
}

Install_Configure(){
	if [ "${version}" == "5.5" ]; then
		gccVersionCheck
		cmake -DCMAKE_INSTALL_PREFIX=${Setup_Path} -DSYSCONFDIR=/etc -DWITH_MYISAM_STORAGE_ENGINE=1 -DWITH_INNOBASE_STORAGE_ENGINE=1 -DWITH_PARTITION_STORAGE_ENGINE=1 -DWITH_FEDERATED_STORAGE_ENGINE=1 -DEXTRA_CHARSETS=all -DDEFAULT_CHARSET=utf8mb4 -DDEFAULT_COLLATION=utf8mb4_general_ci -DWITH_READLINE=1 -DWITH_EMBEDDED_SERVER=1 -DENABLED_LOCAL_INFILE=1
	elif [  "${version}" == "5.6" ]; then
		cmake -DCMAKE_INSTALL_PREFIX=${Setup_Path} -DSYSCONFDIR=/etc -DWITH_MYISAM_STORAGE_ENGINE=1 -DWITH_INNOBASE_STORAGE_ENGINE=1 -DWITH_PARTITION_STORAGE_ENGINE=1 -DWITH_FEDERATED_STORAGE_ENGINE=1 -DEXTRA_CHARSETS=all -DDEFAULT_CHARSET=utf8mb4 -DDEFAULT_COLLATION=utf8mb4_general_ci -DWITH_EMBEDDED_SERVER=1 -DENABLED_LOCAL_INFILE=1
	elif [ "${version}" == "5.7" ]; then
		mkdir install
		cd install
		cmake .. -DCMAKE_INSTALL_PREFIX=${Setup_Path} -DSYSCONFDIR=/etc -DWITH_MYISAM_STORAGE_ENGINE=1 -DWITH_INNOBASE_STORAGE_ENGINE=1 -DWITH_PARTITION_STORAGE_ENGINE=1 -DWITH_FEDERATED_STORAGE_ENGINE=1 -DEXTRA_CHARSETS=all -DDEFAULT_CHARSET=utf8mb4 -DDEFAULT_COLLATION=utf8mb4_general_ci -DWITH_EMBEDDED_SERVER=1 -DENABLED_LOCAL_INFILE=1 -DWITH_BOOST=../boost
	elif [ "${version}" == "8.0" ]; then
		mkdir install
		cd install
		cmakeV="cmake"
		if [ "${PM}" = "yum" ]; then
			yum install centos-release-scl-rh -y
			yum install devtoolset-7-gcc devtoolset-7-gcc-c++ -y
			yum install cmake3 -y
			cmakeV="cmake3"
			export CC=/opt/rh/devtoolset-7/root/usr/bin/gcc
			export CXX=/opt/rh/devtoolset-7/root/usr/bin/g++
		fi
		${cmakeV} .. -DCMAKE_INSTALL_PREFIX=${Setup_Path} -DSYSCONFDIR=/etc -DWITH_MYISAM_STORAGE_ENGINE=1 -DWITH_INNOBASE_STORAGE_ENGINE=1 -DWITH_PARTITION_STORAGE_ENGINE=1 -DDEFAULT_CHARSET=utf8mb4 -DDEFAULT_COLLATION=utf8mb4_general_ci -DENABLED_LOCAL_INFILE=1 -DWITH_BOOST=../boost
	elif [ "${version}" == "mariadb_10.0" ]; then
		cmake -DCMAKE_INSTALL_PREFIX=${Setup_Path} -DWITH_ARIA_STORAGE_ENGINE=1 -DWITH_XTRADB_STORAGE_ENGINE=1 -DWITH_INNOBASE_STORAGE_ENGINE=1 -DWITH_PARTITION_STORAGE_ENGINE=1 -DWITH_MYISAM_STORAGE_ENGINE=1 -DWITH_FEDERATED_STORAGE_ENGINE=1 -DEXTRA_CHARSETS=all -DDEFAULT_CHARSET=utf8mb4 -DDEFAULT_COLLATION=utf8mb4_general_ci -DWITH_READLINE=1 -DWITH_EMBEDDED_SERVER=1 -DENABLED_LOCAL_INFILE=1
	else
		cmake -DCMAKE_INSTALL_PREFIX=${Setup_Path} -DWITH_ARIA_STORAGE_ENGINE=1 -DWITH_XTRADB_STORAGE_ENGINE=1 -DWITH_INNOBASE_STORAGE_ENGINE=1 -DWITH_PARTITION_STORAGE_ENGINE=1 -DWITH_MYISAM_STORAGE_ENGINE=1 -DWITH_FEDERATED_STORAGE_ENGINE=1 -DEXTRA_CHARSETS=all -DDEFAULT_CHARSET=utf8mb4 -DDEFAULT_COLLATION=utf8mb4_general_ci -DWITH_READLINE=1 -DWITH_EMBEDDED_SERVER=1 -DENABLED_LOCAL_INFILE=1 -DWITHOUT_TOKUDB=1
	fi

}

Install_Mysql(){
	if [ "${actionType}" == "install" ];then
		Close_MySQL
		cd ${run_path}
		mkdir -p ${Setup_Path}
		rm -rf ${Setup_Path}/*
		groupadd mysql
		useradd -s /sbin/nologin -M -g mysql mysql
	fi
	cd ${Setup_Path}

	mariadbCheck=$(echo ${version}|grep mariadb)
	if [ -z "${mariadbCheck}" ]; then
		sqlName="mysql"
	else
		sqlName="mariadb"
	fi

	if [ "${version}" == "5.7" ] || [ "${version}" == "8.0" ]; then
		wget -O ${Setup_Path}/src.tar.gz ${download_Url}/src/mysql-boost-${sqlVersion}.tar.gz -T20
	else
		wget -O ${Setup_Path}/src.tar.gz ${download_Url}/src/${sqlName}-${sqlVersion}.tar.gz -T20
	fi

	tar -zxvf src.tar.gz

	armCheck=$(uname -m|grep arm)
	if [ "${version}" == "5.5" ] || [ "${armCheck}" ]; then
		wget -O mysql-5.5-fix-arm-client_plugin.patch ${download_Url}/src/patch/mysql-5.5-fix-arm-client_plugin.patch
		patch -p0 < mysql-5.5-fix-arm-client_plugin.patch
		rm -f mysql-5.5-fix-arm-client_plugin.patch
	fi

	mv ${sqlName}-${sqlVersion} src
	cd src

	Install_Configure

	make -j${cpuCore}
	if [ "${actionType}" == "update" ]; then
		/etc/init.d/mysqld stop
		sleep 2
		make install
		sleep 2
		/etc/init.d/mysqld start
		printVersion
		rm -f ${Setup_Path}/version_check.pl
		rm -f ${Setup_Path}/src.tar.gz
		rm -rf ${Setup_Path}/src

		exit;
	fi
	make install

	# if [ ! -f "${Setup_Path}/bin/mysqld" ];then
	# 	echo -e "install failed"
	# 	rm -rf ${Setup_Path}
	# 	exit 0;
	# fi

	My_Cnf
	MySQL_Opt

	if [ -d "${Data_Path}" ]; then
		rm -rf ${Data_Path}/*
	else
		mkdir -p ${Data_Path}
	fi

	chown -R mysql:mysql ${Data_Path}
	chgrp -R mysql ${Setup_Path}/.

	if [ "${version}" == "5.7" ] || [ "${version}" == "8.0" ];then
		${Setup_Path}/bin/mysqld --initialize-insecure --basedir=${Setup_Path} --datadir=${Data_Path} --user=mysql
	else
		${Setup_Path}/scripts/mysql_install_db --defaults-file=/etc/my.cnf --basedir=${Setup_Path} --datadir=${Data_Path} --user=mysql
	fi

	\cp support-files/mysql.server /etc/init.d/mysqld
	chmod 755 /etc/init.d/mysqld


	if [ "${version}" != "5.7" ];then
		if [ "${version}" != "8.0" ]; then
			sed -i "s#\"\$\*\"#--sql-mode=\"NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION\"#" /etc/init.d/mysqld
		fi
	fi

	sed -i '/case "$mode" in/i\ulimit -s unlimited' /etc/init.d/mysqld

	cat > /etc/ld.so.conf.d/mysql.conf<<EOF
${Setup_Path}/lib
EOF
	ldconfig
	ln -sf ${Setup_Path}/lib/mysql /usr/lib/mysql
	ln -sf ${Setup_Path}/include/mysql /usr/include/mysql
	/etc/init.d/mysqld start

	SetLink
	ldconfig


	[ "${version}" == "8.0" ] || [ "${version}" == "mariadb_10.2" ] || [ "${version}" == "mariadb_10.3" ] && echo "True" > ${Setup_Path}/mysqlDb3.pl

	${Setup_Path}/bin/mysqladmin -u root password "${mysqlpwd}"

	Service_Add

	/etc/init.d/mysqld start

	cd ${Setup_Path}
	rm -f src.tar.gz
	rm -rf src

	printVersion
	Install_Mysql_PyDb

	if [ -f '/www/server/panel/tools.py' ];then
		python /www/server/panel/tools.py root $mysqlpwd
	else
		python /www/server/panel/tools.pyc root $mysqlpwd
	fi
}
Close_MySQL()
{
	[ -f "/etc/init.d/mysqld" ] && /etc/init.d/mysqld stop

	if [ "${PM}" = "yum" ];then
		mysqlVersion=`rpm -qa |grep bt-mysql-`
		mariadbVersion=`rpm -qa |grep bt-mariadb-`
		[ "${mysqlVersion}" ] && rpm -e $mysqlVersion --nodeps
		[ "${mariadbVersion}" ] && rpm -e $mariadbVersion --nodeps
		[ -f "${Setup_Path}/rpm.pl" ] && yum remove $(cat ${Setup_Path}/rpm.pl) -y
	fi

	if [ -f "${Setup_Path}/bin/mysql" ];then
		Service_Del
		rm -f /etc/init.d/mysqld
		rm -rf ${Setup_Path}
		mkdir -p /www/backup
		[ -d "/www/backup/oldData" ] && rm -rf /www/backup/oldData
		mv -f $Data_Path  /www/backup/oldData
		rm -rf $Data_Path
		rm -f /usr/bin/mysql*
		rm -f /usr/lib/libmysql*
		rm -f /usr/lib64/libmysql*
	fi
}

actionType=$1
version=$2

if [ "${actionType}" == 'install' ] || [ "${actionType}" == "update" ];then
	if [ -z "${version}" ]; then
		exit
	fi
	mysqlpwd=`cat /dev/urandom | head -n 16 | md5sum | head -c 16`
	case "$version" in
		'5.5')
			sqlVersion=${mysql_55}
			;;
		'5.6')
			sqlVersion=${mysql_56}
			;;
		'5.7')
			sqlVersion=${mysql_57}
			;;
		'8.0')
			sqlVersion=${mysql_80}
			;;
		'mariadb_10.0')
			sqlVersion=${mariadb_100}
			;;
		'mariadb_10.1')
			sqlVersion=${mariadb_101}
			;;
		'mariadb_10.2')
			sqlVersion=${mariadb_102}
			;;
		'mariadb_10.3')
			sqlVersion=${mariadb_103}
			;;
	esac
	Install_Mysql
elif [ "$actionType" == 'uninstall' ];then
	Close_MySQL del
fi
