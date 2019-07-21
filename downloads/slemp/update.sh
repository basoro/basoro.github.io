#!/bin/bash
wget -O panel.zip https://basoro.id/downloads/slemp/panel.zip -T 10
wget -O /etc/init.d/slemp https://basoro.id/downloads/slemp/init/slemp.init -T 10
unzip panel.zip
yes | cp -a panel/*.py /opt/slemp/server/panel
yes | cp -a panel/static/* /opt/slemp/server/panel/static/
yes | cp -a panel/templates/* /opt/slemp/server/panel/templates/
python -m compileall /opt/slemp/server/panel/
rm -f /opt/slemp/server/panel/*.py
rm -f /opt/slemp/server/panel/data/plugin.db
rm -f panel.zip
chmod +x /etc/init.d/slemp
slemp restart
