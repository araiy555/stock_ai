
import datetime
import pandas_datareader.data as web

#基本的なデータ処理のため
import pandas as pd
import numpy as np
import yfinance as yf

from pandas import Series,DataFrame
import matplotlib.pyplot as plt

import pandas_datareader.data as web
import pymysql as pm
import json
import time

DATABASE = {
    'host': 'mysql153.phy.lolipop.lan',
    'db': 'LAA1326943-stocktown',
    'user': 'LAA1326943',
    'password': 'q1w2e3r4',
    'port': 3306,
    'cursorclass': pm.cursors.DictCursor
}


def SetTrend(row, today, week):
    try:
        soaring_rate = ((today - week) / today) * 100
        soaring = format(soaring_rate, '.2f')
        print(soaring + '%')
        with conn.cursor() as cursor:
            sql = ("SELECT count(1) as count FROM trend WHERE marketstock_id=%s")
            cursor.execute(sql, (row['id']))
            result = cursor.fetchone()
            print(result)
        if result['count'] == 0:
            with conn.cursor() as cursor:
                sql = ('INSERT INTO trend (marketstock_id, soaring_rate) VALUES (%s, %s)')
                cursor.execute(sql, (row['id'], soaring))
                conn.commit()
                print('insert ok' + row['symbol'])
        else:
            with conn.cursor() as cursor:
                sql = ('UPDATE trend SET soaring_rate = %s , update_at = %s WHERE marketstock_id = %s')
                cursor.execute(sql, (soaring, time.strftime('%Y-%m-%d %H:%M:%S'), row['id']))
                conn.commit() # コミットし、更新を反映->こないとDBにデータ流れない
                print('update ok' + row['symbol'])
    except:
        print('error' + row['symbol'])
    return 0

def today(pair):
    try:
        # 現在時刻
        code = pair['symbol'].replace('XTKS', 'T')

        today = datetime.date.today() - datetime.timedelta(days=1)
        today = today.strftime('%Y-%m-%d')

        # 為替pairを所定の形に変更
        #code = f'{pair}.T'
        # dataの取得
        data = web.get_data_yahoo(code, today)
        # 最終日（今日）の終値（リアルタイム値）を返す
        return data['Close'][-1]
    except:
        print('errortoday')
    return 0

def week(pair):
    try:
        # 現在時刻
        code = pair['symbol'].replace('XTKS', 'T')
        start = datetime.date.today() - datetime.timedelta(days=1)
        end = datetime.date.today() - datetime.timedelta(days=7)
        start = start.strftime('%Y-%m-%d')
        end = end.strftime('%Y-%m-%d')

        #為替pairを所定の形に変更
        #code = f'{pair}=T'

        # dataの取得
        data = web.get_data_yahoo(code, end, start)
        print(data['Close'][-2])
        # 最終日（今日）の終値（リアルタイム値）を返す

        return data['Close'][-2]
    except:
        print('errorweek')
    return 0


conn = pm.connect(**DATABASE)

with conn.cursor() as cursor:
    sql = "SELECT * FROM marketstock WHERE stock_exchange_country = 'USA'"
    cursor.execute(sql)

ret = cursor.fetchall()

for row in ret:
    TODAY = today(row)
    WEEK = week(row)
    SetTrend(row, int(TODAY), int(WEEK))

# DB操作終了
conn.close()


