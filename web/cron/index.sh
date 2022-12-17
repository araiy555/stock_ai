#!/bin/bash


while :
do

cd
cd ./web/cron/StockData
/usr/local/bin/python3 XNAS.py
/usr/local/bin/python3 XTKS.py
#
## 株情報の保存
#
cd ../SetInfo
/usr/local/bin/python3 XNAS.py
/usr/local/bin/python3 XTKS.py

# 株のチャート情報

cd ../SetDbCSV
/usr/local/php/7.3/bin/php XNAS.php
/usr/local/php/7.3/bin/php XTKS.php

cd ../tenbagger
/usr/local/php/7.3/bin/php index.php

done
##https://icooon-mono.com/