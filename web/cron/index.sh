#!/bin/bash

# -----ログ出力関数（コピペで他のスクリプトにも利用できる）  --------------------------

function log () {
   # ログ出力先とログ名を設定。ログ名は自動で[シェル名].logとなる
   LOG="/home/users/2/versus.jp-stocktown/web/log/index.log"

   # ログ出力日時のフォーマットを yyyy/mm/dd hh:mm:ss に設定する
   time=$(date '+%Y/%m/%d %T')

   # 最初の引数の文字列をログ出力する
   echo $time $1 >> $LOG

   # 2番目の引数があればそれもログに出力する（エラーログで使用）
   if [[ $2 != "" ]]; then
       echo $2 >> $LOG
   fi
}
# ----------------------------------------------------------------------
while :
do
# 処理開始logを出力
# 手順　marketstockテーブルからCSVを作成する。
# CSVからmarketstockindexに格納する

log "処理開始"

cd
cd ./web/cron/StockData
/usr/local/bin/python3 INDX.py
log "INDX.py 処理終了"
/usr/local/bin/python3 XNAS.py
log "XNAS.py 処理終了"
/usr/local/bin/python3 XTKS.py
log "XTKS.py 処理終了"

cd ../SetInfo
/usr/local/bin/python3 INDX.py
log "INDX.py 処理終了"
/usr/local/bin/python3 XNAS.py
log "XNAS.py 処理終了"
/usr/local/bin/python3 XTKS.py
log "XTKS.py 処理終了"

cd ../SetDbCSV
/usr/local/php/7.3/bin/php INDX.php
log "INDX.php 処理終了"
/usr/local/php/7.3/bin/php XNAS.php
log "XNAS.php 処理終了"
/usr/local/php/7.3/bin/php XTKS.php
log "XTKS.php 処理終了"

cd ../../
/usr/local/php/7.3/bin/php markettranslation.php

log "処理終了"

done
##https://icooon-mono.com/