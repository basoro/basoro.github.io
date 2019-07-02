#!/bin/bash
PATH=/bin:/sbin:/usr/bin:/usr/sbin:/usr/local/bin:/usr/local/sbin:~/bin
export PATH
LANG=en_US.UTF-8

echo "
+----------------------------------------------------------------------
| Panel 1.x FOR CentOS/Redhat/Fedora/Ubuntu/Debian
+----------------------------------------------------------------------
"
download_Url=http://128.1.164.196:5880

setup_path=/www
port='8888'

while [ "$go" != 'y' ] && [ "$go" != 'n' ]
do
	read -p "Do you want to install Bt-Panel to the $setup_path directory now?(y/n): " go;
done

if [ "$go" == 'n' ];then
	exit;
fi

startTime=`date +%s`

if [ -f "/usr/bin/apt-get" ];then
	ln -sf bash /bin/sh
	apt-get update -y
	apt-get install ruby -y
	apt-get install lsb-release -y
	for pace in wget curl python python-dev python-imaging zip unzip openssl libssl-dev gcc llibmysqld-dev ibxml2 libxml2-dev libxslt zlib1g zlib1g-dev libjpeg-dev libpng-dev lsof libpcre3 libpcre3-dev cron;
	do apt-get -y install $pace --force-yes; done
	apt-get -y install python-pip python-dev
	sleep 5
else
	setenforce 0
	sed -i 's/SELINUX=enforcing/SELINUX=disabled/' /etc/selinux/config
	for pace in wget unzip python-devel python-imaging zip unzip mysql-devel openssl openssl-devel gcc libxml2 libxml2-dev libxslt* zlib zlib-devel libjpeg-devel libpng-devel libwebp libwebp-devel freetype freetype-devel lsof pcre pcre-devel vixie-cron crontabs;
	do yum -y install $pace; done
	sleep 5
fi

wget -O setuptools-33.1.1.zip $download_Url/install/src/setuptools-33.1.1.zip -T 10
unzip setuptools-33.1.1.zip
rm -f setuptools-33.1.1.zip
cd setuptools-33.1.1
python setup.py install
cd ..
rm -rf setuptools-33.1.1

wget -O psutil-5.2.2.tar.gz $download_Url/install/src/psutil-5.2.2.tar.gz -T 10
tar xvf psutil-5.2.2.tar.gz
rm -f psutil-5.2.2.tar.gz
cd psutil-5.2.2
python setup.py install
cd ..
rm -rf psutil-5.2.2

wget -O MySQL-python-1.2.5.zip $download_Url/install/src/MySQL-python-1.2.5.zip -T 10
unzip MySQL-python-1.2.5.zip
rm -f MySQL-python-1.2.5.zip
cd MySQL-python-1.2.5
sed -i 's=www/server/mysql=usr=' site.cfg
python setup.py install
cd ..
rm -rf MySQL-python-1.2.5

wget -O chardet-2.3.0.tar.gz $download_Url/install/src/chardet-2.3.0.tar.gz -T 10
tar xvf chardet-2.3.0.tar.gz
rm -f chardet-2.3.0.tar.gz
cd chardet-2.3.0
python setup.py install
cd ..
rm -rf chardet-2.3.0

wget -O web.py-0.38.tar.gz $download_Url/install/src/web.py-0.38.tar.gz -T 10
tar xvf web.py-0.38.tar.gz
rm -f web.py-0.38.tar.gz
cd web.py-0.38
python setup.py install
cd ..
rm -rf web.py-0.38

mkdir -p /www/server
mkdir -p /www/wwwroot
mkdir -p /www/wwwlogs
mkdir -p /www/backup/database
mkdir -p /www/backup/site

wget -O panel.zip https://github.com/atilamedia/panel/archive/4.0.zip -T 10
wget -O /etc/init.d/bt $download_Url/install/src/bt.init -T 10

unzip -o panel.zip -d $setup_path/server/ > /dev/null
mv -f $setup_path/server/panel-4.0 $setup_path/server/panel

rm -f panel.zip

python -m compileall $setup_path/server/panel
rm -f $setup_path/server/panel/class/*.py
rm -f $setup_path/server/panel/*.py

chmod 777 /tmp
chmod +x /etc/init.d/bt

if [ -f "/usr/sbin/update-rc.d" ];then
	update-rc.d bt defaults
else
	chkconfig --add bt
	chkconfig --level 2345 bt on
fi

chmod -R 600 $setup_path/server/panel
chmod -R +x $setup_path/server/panel/script
ln -sf /etc/init.d/bt /usr/bin/bt
echo "$port" > $setup_path/server/panel/data/port.pl
/etc/init.d/bt start
password=`cat /dev/urandom | head -n 16 | md5sum | head -c 8`
cd $setup_path/server/panel/
username=`python tools.pyc panel $password`
cd ~
echo "$password" > $setup_path/server/panel/default.pl
chmod 600 $setup_path/server/panel/default.pl

if [ -f "/usr/bin/apt-get" ];then

	if [ ! -f "/usr/bin/ufw" ];then
		apt-get install -y ufw
	fi

	if [ -f "/usr/sbin/ufw" ];then
		ufw allow 888,22,80,$port/tcp
		ufw_status=`ufw status`
		echo y|ufw enable
		ufw default deny
		ufw reload
	fi

else

	if [ -f "/etc/init.d/iptables" ];then
		iptables -I INPUT -p tcp -m state --state NEW -m tcp --dport 22 -j ACCEPT
		iptables -I INPUT -p tcp -m state --state NEW -m tcp --dport 80 -j ACCEPT
		iptables -I INPUT -p tcp -m state --state NEW -m tcp --dport 888 -j ACCEPT
		iptables -I INPUT -p tcp -m state --state NEW -m tcp --dport $port -j ACCEPT
		iptables -A INPUT -p icmp --icmp-type any -j ACCEPT
		iptables -A INPUT -s localhost -d localhost -j ACCEPT
		iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT
		iptables -P INPUT DROP
		service iptables save
		service iptables restart
	fi

	if [ "${isVersion}" == '' ];then
		if [ ! -f "/etc/init.d/iptables" ];then
			yum install firewalld -y
			systemctl enable firewalld
			systemctl start firewalld
			firewall-cmd --set-default-zone=public > /dev/null 2>&1
			firewall-cmd --permanent --zone=public --add-port=22/tcp > /dev/null 2>&1
			firewall-cmd --permanent --zone=public --add-port=80/tcp > /dev/null 2>&1
			firewall-cmd --permanent --zone=public --add-port=888/tcp > /dev/null 2>&1
			firewall-cmd --permanent --zone=public --add-port=$port/tcp > /dev/null 2>&1
			firewall-cmd --reload
		fi
	fi

fi

echo -e "=================================================================="
echo -e "\033[32mCongratulations! Install succeeded!\033[0m"
echo -e "=================================================================="
echo  "Bt-Panel: http://$address:$port"
echo -e "username: $username"
echo -e "password: $password"
echo -e "\033[33mWarning:\033[0m"
echo -e "\033[33mIf you cannot access the panel, \033[0m"
echo -e "\033[33mrelease the following port (8888|888|80|22) in the security group\033[0m"
echo -e "=================================================================="

endTime=`date +%s`
((outTime=($endTime-$startTime)/60))
echo -e "Time consumed:\033[32m $outTime \033[0mMinute!"
rm -f install.sh
rm -f slemp.sh 
