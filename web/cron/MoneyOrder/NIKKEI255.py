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
    code = pair
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
    code = pair

    # dataの取得
    data = web.get_data_yahoo(code, end, start)

    # 最終日（今日）の終値（リアルタイム値）を返す
    return data['Close'][-5]

def img(pair):

   start = datetime.date(2015,1,1)
   end = datetime.date.today()

   data_YD = web.DataReader('^N225', 'yahoo', start, end) #get data

   plt.plot(data_YD['Adj Close'],label='N225')
   plt.title("N225")
   plt.xlabel('date')
   plt.ylabel('N225')
   plt.savefig("../../img/N225.png")
   plt.legend()
   plt.show()

   return data_YD



conn = pm.connect(**DATABASE)
cursor = conn.cursor()

sql = ("SELECT count(1) as count FROM moneyorder WHERE code_name=%s")
cursor.execute(sql, 'N225')
result = cursor.fetchone()

TODAY = today('^N225')
WEEK = week('^N225')
result2 = img('N225')

if result['count'] == 0:
    sql = ('INSERT INTO moneyorder (code_name, today, week) VALUES (%s, %s, %s)')
    cursor.execute(sql, ('N225', TODAY, WEEK))
    conn.commit()
else:
    sql = ('UPDATE moneyorder SET today = %s, week = %s , create_at = %s WHERE code_name = %s')
    cursor.execute(sql, (TODAY, WEEK, time.strftime('%Y-%m-%d %H:%M:%S'), 'N225'))

conn.commit()
conn.close()




# -----------------------------------------------------------------------------------
# Symble指定は "JPY=X" でも "N225=X" でも同じ。 開始日/終了日は date型でも指定可能
#  https://info.finance.yahoo.co.jp/fx/detail/?code=EURJPY=FX
# -----------------------------------------------------------------------------------
