#!/bin/bash
PATH=/www/server/panel/pyenv/bin:/bin:/sbin:/usr/bin:/usr/sbin:/usr/local/bin:/usr/local/sbin:~/bin
export PATH
install_tmp='/tmp/bt_install.pl'
public_file=/www/server/panel/install/public.sh

if [ ! -f $public_file ];then
	wget -O $public_file http://download.bt.cn/install/public.sh -T 5;
fi

. $public_file
download_Url=$NODE_URL
pluginPath=/www/server/panel/plugin/dns_manager

Install_Bind9()
{
    yum install bind bind-chroot bind-devel* -y
    if [ ! -f /var/named/chroot/etc/named.rfc1912.zones ];then
        if [ -d '/usr/share/doc/bind/' ];then
          cp -R /usr/share/doc/bind/sample/var/named/* /var/named/chroot/var/named/
        else
          cp -R /usr/share/doc/bind-*/sample/var/named/* /var/named/chroot/var/named/
        fi
        touch /var/named/chroot/var/named/data/cache_dump.db
        touch /var/named/chroot/var/named/data/named_stats.txt
        touch /var/named/chroot/var/named/data/named_mem_stats.txt
        touch /var/named/chroot/var/named/data/named.run
        mkdir /var/named/chroot/var/named/dynamic
        touch /var/named/chroot/var/named/dynamic/managed-keys.bind
        chown -R named.named /var/named/chroot/var/named/data/*
        chmod 744 /var/named/chroot/var/named/data/named.run
        chown -R named.named /var/named/chroot/var/named/dynamic/*
        cp -p /etc/named.* /var/named/chroot/etc/
        sed -i 's/127.0.0.1;/any;/g' /var/named/chroot/etc/named.conf
        sed -i 's/localhost;/any;/g' /var/named/chroot/etc/named.conf
        sed -i 's/recursion yes;/recursion no;/g' /var/named/chroot/etc/named.conf
    fi
  systemctl start named-chroot
	systemctl enable named-chroot
}

Install_Powerdns_Redhat()
{
  yum install pdns -y
  groupadd named
  useradd -g named -s /sbin/nologin named
  mv /etc/pdns/pdns.conf /etc/pdns/pdns.conf_bt
  wget -O /etc/pdns/pdns.conf $download_Url/install/plugin/dns_manager/pdns.conf -T 5
  chmod 644 /etc/pdns/pdns.conf
  mkdir -p /var/named/chroot/etc
  mkdir -p /var/named/chroot/var/named
  chmod  755 /var/named
  chmod  755 /var/named/chroot
  chmod  755 /var/named/chroot/etc
  chmod  755 /var/named/chroot/var
  chmod  755 /var/named/chroot/var/named
  chmod -R 644 /var/named/chroot/etc/*
  chmod -R 644 /var/named/chroot/var/named/*
  if [ ! -f "/var/named/chroot/etc/named.rfc1912.zones" ];then
    touch /var/named/chroot/etc/named.rfc1912.zones
  fi
  bind_conf=$(grep 'file "/var/' /var/named/chroot/etc/named.rfc1912.zones)
  if [ "$bind_conf" == "" ];then
    sed -i 's/file\s*\"/file \"\/var\/named\/chroot\/var\/named\//g' /var/named/chroot/etc/named.rfc1912.zones
  fi
  systemctl stop systemd-resolved
  systemctl disable systemd-resolved
	systemctl stop named-chroot
	systemctl disable named-chroot
  systemctl enable pdns
  systemctl restart pdns
}

Install_Powerdns_Ubuntu()
{
  ubuntu=$(cat /etc/issue)
  if [[ "$ubuntu" =~ "Ubuntu" ]];then
    systemctl disable systemd-resolved
    systemctl stop systemd-resolved
    rm /etc/resolv.conf
    echo "nameserver 8.8.8.8" > /etc/resolv.conf
  fi
  curl https://repo.powerdns.com/FD380FBB-pub.asc | sudo apt-key add -
  apt-get update
  apt-get install pdns-server -y
  groupadd named
  useradd -g named -s /sbin/nologin named
  mv /etc/powerdns/pdns.conf /etc/powerdns/pdns.conf_bt
  wget -O /etc/powerdns/pdns.conf $download_Url/install/plugin/dns_manager/pdns.conf -T 5
  chmod 600 /etc/powerdns/pdns.conf
  mkdir -p /var/named/chroot/etc
  mkdir -p /var/named/chroot/var/named
  if [ ! -f "/var/named/chroot/etc/named.rfc1912.zones" ];then
    touch /var/named/chroot/etc/named.rfc1912.zones
  fi
  systemctl enable pdns
  systemctl restart pdns
}

Install_Powerdns()
{
  if [ -f '/etc/redhat-release' ];then
    Install_Powerdns_Redhat
  else
    Install_Powerdns_Ubuntu
  fi
}

Install_DnsManager()
{
  rm -f $pluginPath/dns_manager_main.py
	mkdir -p $pluginPath
	Install_Powerdns
	/usr/bin/pip install dnspython
	echo '正在安装脚本文件...' > $install_tmp
	grep "English" /www/server/panel/config/config.json
	if [ "$?" -ne 0 ];then
        wget -O $pluginPath/dns_manager_main.py $download_Url/install/plugin/dns_manager/dns_manager_main.py -T 5
        wget -O $pluginPath/index.html $download_Url/install/plugin/dns_manager/index.html -T 5
        wget -O $pluginPath/info.json $download_Url/install/plugin/dns_manager/info.json -T 5
        wget -O $pluginPath/icon.png $download_Url/install/plugin/dns_manager/icon.png -T 5
    else
        wget -O $pluginPath/dns_manager_main.py $download_Url/install/plugin/dns_manager_en/dns_manager_main.py -T 5
        wget -O $pluginPath/index.html $download_Url/install/plugin/dns_manager_en/index.html -T 5
        wget -O $pluginPath/info.json $download_Url/install/plugin/dns_manager_en/info.json -T 5
        wget -O $pluginPath/icon.png $download_Url/install/plugin/dns_manager_en/icon.png -T 5
	fi
    \cp -a -r /www/server/panel/plugin/dns_manager/icon.png /www/server/panel/static/img/soft_ico/ico-dns_manager.png

	echo '安装完成' > $install_tmp
}

update_DnsManager()
{
#  if [ ! -f "/usr/sbin/pdns_server" ];then
  Install_Powerdns
#  fi
	echo 'Installing ...' > $install_tmp
	grep "English" /www/server/panel/config/config.json
	if [ "$?" -ne 0 ];then
        wget -O $pluginPath/dns_manager_main.py $download_Url/install/plugin/dns_manager/dns_manager_main.py -T 5
        wget -O $pluginPath/index.html $download_Url/install/plugin/dns_manager/index.html -T 5
        wget -O $pluginPath/info.json $download_Url/install/plugin/dns_manager/info.json -T 5
        wget -O $pluginPath/icon.png $download_Url/install/plugin/dns_manager/icon.png -T 5
    else
        wget -O $pluginPath/dns_manager_main.py $download_Url/install/plugin/dns_manager_en/dns_manager_main.py -T 5
        wget -O $pluginPath/index.html $download_Url/install/plugin/dns_manager_en/index.html -T 5
        wget -O $pluginPath/info.json $download_Url/install/plugin/dns_manager_en/info.json -T 5
        wget -O $pluginPath/icon.png $download_Url/install/plugin/dns_manager_en/icon.png -T 5
	fi
    \cp -a -r /www/server/panel/plugin/dns_manager/icon.png /www/server/panel/static/img/soft_ico/ico-dns_manager.png

	echo 'The installation is complete' > $install_tmp
}

Uninstall_DnsManager()
{
	rm -rf $pluginPath
	rm -f /var/named/chroot/etc/named.rfc1912.zones_bak
	mv /var/named/chroot/etc/named.rfc1912.zones /var/named/chroot/etc/named.rfc1912.zones_bak
  mv /var/named/chroot/var/named /var/named/chroot/var/named_bak
  rm -rf /var/named/chroot/var/named
	/usr/bin/systemctl stop named-chroot
	systemctl disable named-chroot
	systemctl stop pdns
	systemctl disable pdns
}

if [ "${1}" == 'install' ];then
	Install_DnsManager
elif  [ "${1}" == 'update' ];then
	update_DnsManager
elif [ "${1}" == 'uninstall' ];then
	Uninstall_DnsManager
fi
