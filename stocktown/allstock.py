import numpy as np
import pandas as pd
import pandas.io.data as web
import datetime

start = datetime.datetime(2000, 1, 1)
end = datetime.datetime(2015, 10, 23)

for code in range(1300, 9999):
  try:
    data = web.DataReader(str(code), 'yahoo', start, end)
    data.to_csv('stockprice_data/stockprice_' +  str(code) + '.csv')
  except:
    print('Error : ' + str(code))