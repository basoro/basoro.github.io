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

Install_docker()
{
	Install_Docker_ce
	mkdir -p /opt/slemp/server/panel/docker
	echo '正在安装脚本文件...' > $install_tmp
	wget -O /opt/slemp/server/panel/docker/docker_main.py $download_Url/plugin/docker/docker_main.py -T 5
	wget -O /opt/slemp/server/panel/docker/index.html $download_Url/plugin/docker/index.html -T 5
	wget -O /opt/slemp/server/panel/docker/info.json $download_Url/plugin/docker/info.json -T 5
	wget -O /opt/slemp/server/panel/docker/login-docker.html $download_Url/plugin/docker/login-docker.html -T 5
	wget -O /opt/slemp/server/panel/docker/userdocker.html $download_Url/plugin/docker/userdocker.html -T 5
	echo '安装完成' > $install_tmp
}

Install_Docker_ce()
{
	#install docker-ce
	if [ -f "/usr/bin/apt-get" ];then
		apt-get remove docker docker-engine docker.io -y
		apt install docker.io -y
	else
		yum remove docker docker-common docker-selinux docker-engine -y
		yum install -y yum-utils device-mapper-persistent-data lvm2 -y
		yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
		yum-config-manager --enable docker-ce-edge
		yum install docker-ce -y
		yum-config-manager --disable docker-ce-edge
	fi

	#move docker data to /opt/slemp/server/docker
	echo 'move docker data to /opt/slemp/server/docker ...';
	if [ -f /usr/bin/systemctl ];then
		systemctl stop docker
	else
		service docker stop
	fi
	if [ ! -d /opt/slemp/server/docker ];then
		mv -f /var/lib/docker /opt/slemp/server/docker
	else
		rm -rf /var/lib/docker
	fi

	ln -sf /opt/slemp/server/docker /var/lib/docker

	#systemctl or service
	if [ -f /usr/bin/systemctl ];then
		systemctl stop getty@tty1.service
		systemctl mask getty@tty1.service
		systemctl enable docker
		systemctl start docker
	else
		chkconfig --add docker
		chkconfig --level 2345 docker on
		service docker start
	fi

	#install python-docker
	pip install docker

	#pull image of bt-panel
	#imageVersion='5.6.0'
	#docker pull registry.cn-hangzhou.aliyuncs.com/bt-panel/panel:$imageVersion
	#docker tag `docker images|grep bt-panel|awk '{print $3}'` bt-panel:$imageVersion
}

Uninstall_docker()
{
	rm -rf /opt/slemp/server/panel/docker
	if [ -f /usr/bin/systemctl ];then
		systemctl disable docker
		systemctl stop docker
	else
		service docker stop
		chkconfig --level 2345 docker off
		chkconfig --del docker
	fi
	pip uninstall docker -y
}


action=$1
if [ "${1}" == 'install' ];then
	Install_docker
else
	Uninstall_docker
fi
