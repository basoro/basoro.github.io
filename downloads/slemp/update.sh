#!/bin/bash
git clone https://github.com/basoro/slemp.git
yes | cp -a slemp/*.py /opt/slemp/server/panel
yes | cp -a slemp/static/* /opt/slemp/server/panel/static/
yes | cp -a slemp/templates/* /opt/slemp/server/panel/templates/
python -m compileall /opt/slemp/server/panel/
rm -f /opt/slemp/server/panel/*.py
rm -rf slemp
slemp restart
