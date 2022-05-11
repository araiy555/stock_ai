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

log "処理開始"
cd
cd ./web/cron/MoneyOrder
/usr/local/bin/python3 USDJPY.py
log "USDJPY.py 処理終了"

log "処理終了"

##https://icooon-mono.com/