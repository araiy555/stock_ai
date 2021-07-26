import pandas as pd
import datetime as dt
import numpy as np
import pandas_datareader.data as web


##df_ntt = web.DataReader('7203.T',"yahoo")

df_ntt = web.DataReader('BHP.AX',"yahoo")

print(df_ntt)

df_ntt.to_csv('csv/AX/BHP.csv')