
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

def setCsv(row):
    try:
        xtks = row['symbol'].replace('XTKS', 'T')
        df = web.DataReader(xtks, "yahoo")
        Open = df.tail(1)['Open'].values
        High = df.tail(1)['High'].values
        Low = df.tail(1)['Low'].values
        Close = df.tail(1)['Close'].values
        Volume = df.tail(1)['Volume'].values
        tp =  Volume * Close
        data = yf.Ticker(xtks)

        #print(data.balance_sheet)

        #print(data.quarterly_cashflow)
        #print(data.financials)

        with conn.cursor() as cursor:
            sql = ("SELECT count(1) as count FROM marketstockinfo WHERE marketstock_id=%s")
            cursor.execute(sql, (row['id']))
            result = cursor.fetchone()
            print(result)
        if result['count'] == 0:
            with conn.cursor() as cursor:
                    sql = ('INSERT INTO marketstockinfo (marketstock_id, closing_price, open_price, high_price, low_price, volume, trading_price, data, balance_sheet) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)')
                    cursor.execute(sql, (row['id'], str(Close), str(Open), str(High), str(Low), str(Volume), str(tp), json.dumps(data.info), str(data.balance_sheet)))

                    conn.commit() # コミットし、更新を反映->こないとDBにデータ流れない
                    print('insert ok' + xtks)
        else:
            with conn.cursor() as cursor:
                        sql = ('UPDATE marketstockinfo SET closing_price = %s, open_price = %s, high_price = %s, low_price = %s, volume = %s, trading_price = %s, data = %s, balance_sheet = %s, update_at = %s WHERE marketstock_id = %s')
                        cursor.execute(sql, (str(Close), str(Open), str(High), str(Low), str(Volume), str(tp), json.dumps(data.info), str(data.balance_sheet), time.strftime('%Y-%m-%d %H:%M:%S'), row['id']))

                        conn.commit() # コミットし、更新を反映->こないとDBにデータ流れない
                        print('update ok' + xtks)
    except:
        print('error' + xtks)
    return 0

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
    sql = "SELECT * FROM marketstock WHERE mic = 'XTKS'"
    cursor.execute(sql)

ret = cursor.fetchall()

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








#不要な文字列の削除
#def delete_words(x):
 #  x = str(x).replace("""<td class="overflow__cell"><div class="cell__content"><span class="">""","").replace("</div>","").replace("</span>","").replace("</td>","").replace("""<td class="valueCell">""","").replace("</p>","").replace("""<p class="data lastcolumn">""","").replace("'","").replace("""<li class="kv__item">""","").replace("""<small class="label">Shares Outstanding</small>""","").replace("""<span class="primary">""","").replace("""<span class="secondary no-value">""","").replace("""</li>""","")
 #  x = str(x).replace(""" ""","").replace("\n","").replace("""<tdclass="overflow__cell"><divclass="cell__content">""","").replace("""<spanclass="negative">""","").replace("""<smallclass="label">Open</small>""","").replace("""<spanclass="primaryis-na">""","")
 #  return x

# 株価の取得
#df= web.DataReader('GOOG',"yahoo")

# ##始値 	int Open_price
#Open = df.tail(1)['Open'].values
##高値 int High_price
#print(Open)
#High = df.tail(1)['High'].values
# 出力
#print(High)
##安値 int Low_price
#Low = df.tail(1)['Low'].values
# 出力
#print(Low)
# 前日終値の取得
#Close = df.tail(1)['Close'].values
# 出力
#print(Close)

##出来高 	int Volume
#Volume = df.tail(1)['Volume'].values
# 出力
#print(Volume)


##売買代金 int Trading_price 出来高×株価
#tp =  Volume * Close
#print(tp)
#発行済株式数（SHARES OUTSTANDING）を抽出する

#URLのセット
#url_shares = "https://www.marketwatch.com/investing/stock/goog?mod=mw_quote_tab"

#request
#test_url_shares = requests.get(url_shares)

#BeautifulSoup
#test_soup_shares = BeautifulSoup(test_url_shares.text,"html.parser")

#数値が入っているliタグだけを取得
#test_information_shares = test_soup_shares.find_all("li", class_="kv__item")

#確認
#test_information_shares

#shares_outstanding = test_information_shares[4]
#shares_outstanding = delete_words(shares_outstanding)
#print(shares_outstanding)

#msft = yf.Ticker("MSFT")

# get stock info
#print(msft.info )

##値幅制限 int Price_range_limit https://kabukiso.com/siryou/nehaba.html 前日終値 - 規定値

##時価総額 int Market_capitalization　株価×発行済み株式数 320 *

##発行済株式数 int Number_of_issued_shares
##、k=キロ、M=メガ、でしょうから、kなら×1000 Mなら×1000000 T 1000000000

##配当利回り（会社予想） int Dividend_yield
##1株配当（会社予想） int Dividend_per_share
##PER（会社予想） int per 時価総額÷純利益 株価÷一株当たり利益
##PBR（実績）  int pbr
##EPS（会社予想） int eps
##BPS（実績）  int bps
##最低購入代金 int Minimum_purchase_price
##単元株数 	int Number_of_shares_per_unit
##年初来高値 int Year_to_date_high
##年初来安値 int Year_to_date_lows

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

