#!/bin/bash

cd
cd ./web/cron/StockData
/usr/local/bin/python3 XNAS.py
/usr/local/bin/python3 stockinfo.py