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

def today(pair):
    # 現在時刻
    today = datetime.date.today() - datetime.timedelta(days=1)
    today = today.strftime('%Y-%m-%d')

    # 為替pairを所定の形に変更
    code = f'{pair}'
    # dataの取得
    data = web.get_data_yahoo(code, today)
    # 最終日（今日）の終値（リアルタイム値）を返す
    return data['Close'][-1]

def week(pair):
    # 現在時刻

    start = datetime.date.today() - datetime.timedelta(days=1)
    end = datetime.date.today() - datetime.timedelta(days=7)
    start = start.strftime('%Y-%m-%d')
    end = end.strftime('%Y-%m-%d')

     # 為替pairを所定の形に変更
    code = f'{pair}'

    # dataの取得
    data = web.get_data_yahoo(code, end, start)

    # 最終日（今日）の終値（リアルタイム値）を返す
    return data['Close'][-5]

def img(pair):

   start = datetime.date(2015,1,1)
   end = datetime.date.today()
   code = f'{pair}'
   img = f'../../img/{pair}.png'

   data_YD = web.DataReader(code, 'yahoo', start, end) #get data

   plt.plot(data_YD['Adj Close'],label=pair)
   plt.title(pair)
   plt.xlabel('date')
   plt.ylabel(pair)
   plt.savefig(img)
   plt.legend()
   plt.show()

   return data_YD



data = ["AUDJPY=X", "CADJPY=X", "^DJI", "EURJPY=X", "GBPJPY=X","^GSPC","^HSI","^KS11","^NDX","^N225","^NSEI","^RUT","USDJPY=X","^VIX"]

for item in data:

    conn = pm.connect(**DATABASE)
    cursor = conn.cursor()

    sql = ("SELECT count(1) as count FROM moneyorder WHERE code_name=%s")
    cursor.execute(sql, item)
    result = cursor.fetchone()

    WEEK = week(item)
    TODAY = today(item)
    result2 = img(item)

    rate = ((TODAY - WEEK) / TODAY) * 100
    soaring = format(rate, '.2f')

    if result['count'] == 0:
        sql = ('INSERT INTO moneyorder (code_name, today, week, rate ) VALUES (%s, %s, %s, %s)')
        cursor.execute(sql, (item, TODAY, WEEK, soaring))
        conn.commit()
    else:
        sql = ('UPDATE moneyorder SET today = %s, week = %s , rate = %s  ,create_at = %s WHERE code_name = %s')
        cursor.execute(sql, (TODAY, WEEK, soaring,time.strftime('%Y-%m-%d %H:%M:%S'), item))

    conn.commit()
conn.close()
