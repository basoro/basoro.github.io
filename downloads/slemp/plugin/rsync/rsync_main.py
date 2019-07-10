 #coding: utf-8
import sys,os;
sys.path.append("");
reload(sys);
import rsync_init;
reload(rsync_init);

class rsync_main(rsync_init.plugin_rsync_init): pass;


if __name__ == "__main__":
    if sys.argv[1] == 'new':
        p = rsync_main()
        p.to_new_version(None)
