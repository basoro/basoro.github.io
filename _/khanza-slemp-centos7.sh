#!/bin/bash
PATH=/bin:/sbin:/usr/bin:/usr/sbin:/usr/local/bin:/usr/local/sbin:~/bin
export PATH

if [ -f "/usr/bin/wget" ];then
	wget -O install.sh https://raw.githubusercontent.com/basoro/basoro.github.io/master/_/slemp.sh && sh install.sh
	exit;
fi
