import pandas_datareader.data as web
from pandas_datareader.nasdaq_trader import get_nasdaq_symbols
from tqdm import tqdm

symbols = get_nasdaq_symbols()

data = {}
error_symbols = []
for s in tqdm(symbols.index):
    try:
        data[s] = web.DataReader(s,"yahoo","2019/1/1")
    except:
        error_symbols.append(s)

