import pandas as pd
import pandas_datareader.data as web

# stooqから指定された証券コードの株価データを取得
def get_stock_data(code):
    code_data = str(code) + '.JP'
    data = web.DataReader(code_data, 'stooq').dropna()
    data = data.sort_index() # 最新データがトップに出るので日付でソート
    return data

# 指定された株価データをcsvとして出力
def save_csv(code, data):
    filename = 'csv/' + str(code) + '.csv'
    data.to_csv(filename, sep=',')

# main
def main():
    codes = [9997,6758,8267] #証券コードを指定する
    for code in codes:
        data = get_stock_data(code)
        save_csv(code, data)

if __name__ == '__main__':
    main()
