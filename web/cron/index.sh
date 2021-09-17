#!/bin/bash

cd
cd ./web/cron/StockData
/usr/local/bin/python3 XNAS.py
/usr/local/bin/python3 XTKS.py

cd ../SetInfo
/usr/local/bin/python3 XNAS.py
/usr/local/bin/python3 XTKS.py

cd ../SetDbCSV

/usr/local/php/7.3/bin/php XNAS.php
/usr/local/php/7.3/bin/php XTKS.php