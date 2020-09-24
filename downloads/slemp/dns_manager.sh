#!/bin/bash
PATH=/bin:/sbin:/usr/bin:/usr/sbin:/usr/local/bin:/usr/local/sbin:~/bin
export PATH

download_Url=https://basoro.id/downloads/slemp
install_tmp='/tmp/slemp_install.pl'
public_file=/opt/slemp/server/panel/script/public.sh
if [ ! -f $public_file ];then
	wget -O $public_file $download_Url/public.sh -T 5;
fi
. $public_file

pluginPath=/opt/slemp/server/panel/plugin/dns_manager

Install_Powerdns()
{
  yum install pdns -y
  groupadd named
  useradd -g named -s /sbin/nologin named
  mv /etc/pdns/pdns.conf /etc/pdns/pdns.conf_bt
  wget -O /etc/pdns/pdns.conf $download_Url/plugin/dns_manager/pdns.conf -T 5
  chmod 644 /etc/pdns/pdns.conf
  mkdir -p /var/named/chroot/etc
  mkdir -p /var/named/chroot/var/named
  chmod  755 /var/named
  chmod  755 /var/named/chroot
  chmod  755 /var/named/chroot/etc
  chmod  755 /var/named/chroot/var
  chmod  755 /var/named/chroot/var/named
  if [ ! -f "/var/named/chroot/etc/named.rfc1912.zones" ];then
    touch /var/named/chroot/etc/named.rfc1912.zones
  fi
  systemctl enable pdns
  systemctl restart pdns
}

Install_DnsManager()
{
  rm -f $pluginPath/dns_manager_main.py
	mkdir -p $pluginPath
	Install_Powerdns
	/usr/bin/pip install dnspython
	echo 'Installing...' > $install_tmp
	wget -O $pluginPath/dns_manager_main.py $download_Url/plugin/dns_manager/dns_manager_main.py -T 5
	wget -O $pluginPath/index.html $download_Url/plugin/dns_manager/index.html -T 5
	wget -O $pluginPath/info.json $download_Url/plugin/dns_manager/info.json -T 5
	wget -O $pluginPath/icon.png $download_Url/plugin/dns_manager/icon.png -T 5
	\cp -a -r /opt/slemp/server/panel/plugin/dns_manager/icon.png /opt/slemp/server/panel/static/img/soft_ico/ico-dns_manager.png

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
elif [ "${1}" == 'uninstall' ];then
	Uninstall_DnsManager
fi

