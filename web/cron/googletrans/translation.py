from googletrans import Translator

import datetime
import pandas_datareader.data as web

#基本的なデータ処理のため
import pandas as pd
import numpy as np
import yfinance as yf

from pandas import Series,DataFrame

import pandas_datareader.data as web
import pymysql as pm
import json
import time


def set(row):
    try:
        dec = json.loads(row['info'])
        tr = Translator()
        stock_name = row['stock_name']
        longBusinessSummary = tr.translate(dec['longBusinessSummary'], src="en", dest="ja").text

        with conn.cursor() as cursor:
             sql = ("SELECT count(1) as count FROM market_translation WHERE marketstock_id = %s")
             cursor.execute(sql, (row['id']))
             result = cursor.fetchone()

        if result['count'] == 0:
             with conn.cursor() as cursor:
                 sql = ('INSERT INTO market_translation (marketstock_id,company,overview) VALUES (%s, %s, %s)')
                 cursor.execute(sql, (row['id'],longBusinessSummary,stock_name))
                 conn.commit() # コミットし、更新を反映->こないとDBにデータ流れない
                 print('insert ok')
                 update(row['id'])
        else:
             with conn.cursor() as cursor:
                 sql = ('UPDATE market_translation SET company = %s, overview = %s, update_at = %s WHERE marketstock_id = %s')
                 cursor.execute(sql, (longBusinessSummary, stock_name, time.strftime('%Y-%m-%d %H:%M:%S'), row['id']))
                 conn.commit() # コミットし、更新を反映->こないとDBにデータ流れない
                 print('update ok')
                 update(row['id'])
    except:
        print('error')
        print(row['id'])
    return

def update(id):
    with conn.cursor() as cursor:
        sql = ('UPDATE marketstock SET translation_flag = 1 WHERE id = %s')
        cursor.execute(sql, (id))
        conn.commit() # コミットし、更新を反映->こないとDBにデータ流れない
        print('update ok')

def delete():
    with conn.cursor() as cursor:
        sql = ("DELETE FROM market_translation WHERE company = '' OR overview = ''")
        cursor.execute(sql)
        result = cursor.fetchone()

DATABASE = {
    'host': 'mysql153.phy.lolipop.lan',
    'db': 'LAA1326943-stocktown',
    'user': 'LAA1326943',
    'password': 'q1w2e3r4',
    'port': 3306,
    'cursorclass': pm.cursors.DictCursor
}

conn = pm.connect(**DATABASE)

with conn.cursor() as cursor:
    sql = "SELECT ms.id, ms.stock_name, msi.data as info  FROM marketstock AS ms INNER JOIN marketstockinfo as msi ON msi.marketstock_id = ms.id WHERE mic != 'INDX' AND ms.translation_flag = 0"
    cursor.execute(sql)

ret = cursor.fetchall()

delete()

for row in ret:
    set(row)

conn.close()



