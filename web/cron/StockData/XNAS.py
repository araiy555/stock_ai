import pandas as pd
import datetime as dt
import numpy as np
import pandas_datareader.data as web
import mysql.connector
import time

def setCsv(row):
    try:
     df_ntt = web.DataReader(row[2],"yahoo")
     df_ntt.to_csv('../../csv/XNAS/' + row[2] + '.csv')
     print('ok' + row[2])
    except:
        print('error' + row[2])
    return 0

# コネクション作成
conn = mysql.connector.connect(
    host='mysql153.phy.lolipop.lan',
    port='3306',
    user='LAA1326943',
    password='q1w2e3r4',
    database='LAA1326943-stocktown'
)

# カーソル作成
cur = conn.cursor()

sql = "SELECT * FROM marketstock WHERE mic = 'XNAS'"
cur.execute(sql)

ret = cur.fetchall()

for row in ret:
    setCsv(row)

# DB操作終了
conn.close()

##snp = web.DataReader('^GSPC', 'yahoo', start, end)
##nyse = web.DataReader('^NYA', 'yahoo', start, end)
##djia = web.DataReader('^DJI', 'yahoo', start, end)
##nikkei = web.DataReader('^N225', 'yahoo', start, end)
##hangseng = web.DataReader('000001.SS', 'yahoo', start, end)
##ftse = web.DataReader('^FTSE', 'yahoo', start, end)
##dax = web.DataReader('^GDAXI', 'yahoo', start, end)
##aord = web.DataReader('^AORD', 'yahoo', start, end)

##df_ntt = web.DataReader('7203.T',"yahoo") XTKS
##df_ntt = web.DataReader('BHP.AX',"yahoo") XASX
##df_ntt = web.DataReader('AAPL',"yahoo") XASE
##df_ntt = web.DataReader('ALICORI1.LM',"yahoo") 	XLIM
##df_ntt = web.DataReader('^N225',"yahoo") INDX
##df_ntt = web.DataReader('ITLC34.SA',"yahoo") BVMF
##df_ntt = web.DataReader('NBB.BH',"yahoo")

#print(df_ntt)

##df_ntt.to_csv('csv/AX/BHP.csv')