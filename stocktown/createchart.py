import pandas as pd
import mplfinance as mpf
import io

# 指定されたcsvファイルを読み込み
def load_csv(code):
    return pd.read_csv('/home/vagrant/work/csv/' + str(code) + '.csv', index_col=0, parse_dates=True)

# 指定された株価データを使ってローソク足チャート(+移動平均線+出来高)を生成
def draw_chart(code):
    data_range = 50 #チャートにする営業日の範囲(50営業日)
    data = load_csv(code)

    data_num = len(data)
    create_num = data_num - data_range - 5 #5営業日後が存在するか確認するため
    if create_num <= 0: #5営業日後が存在しない場合はチャートを作らない
        return
    for i in range(create_num):
        # 指定範囲の翌営業日の株価が5営業日後に上昇しているか判定
        open_value = data.iat[i+data_range, 0] #チャートの範囲はi～i+data_range-1なので翌営業日はi+data_range
        close_value = data.iat[i+data_range+4, 3] #5営業日後はi+data_range+4
        ch_rate = close_value / open_value
        # 上昇or下落で格納するフォルダを分離
        if ch_rate > 1.05: #5%上昇する場合は上昇と判定
            filename = '/home/vagrant/work/chart/up/' + str(code) + '_' + str(i) + '.png'
        else:
            filename = '/home/vagrant/work/chart/down/' + str(code) + '_' + str(i) + '.png'
        mpf.plot(data[i:i+data_range], type='candle', volume=True, mav=(5, 25), savefig=filename)

# main
def main():
    codes = [9997,6758,8267]
    for index in range(len(codes)):
        draw_chart(codes[index])

if __name__ == '__main__':
    main()