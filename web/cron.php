<?php

$cmd = 'ssh loripop sh /home/users/2/versus.jp-stocktown/web/cron/index.sh';

$output = shell_exec($cmd);
var_dump($output);