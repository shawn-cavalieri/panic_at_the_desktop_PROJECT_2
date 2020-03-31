from pandas_datareader import data as web
import matplotlib.pyplot as plt
import pandas as pd
from datetime import datetime

def prices(ticker, startDate, endDate, name):
    mydata = web.DataReader(ticker,
                        start = startDate,
                        end = endDate,
                        data_source='yahoo')['Adj Close']
    normalize = (mydata / mydata.iloc[0] * 100)
    data = pd.DataFrame(mydata)
    data = data.merge(normalize, on='Date')
    data = data.rename(columns={'Adj Close_x': f'{name}_Price', 'Adj Close_y': f'{name}_Percent'})
    data = data.reset_index()
    return data
    #data.to_csv(f"/Users/jackharvey/Documents/panic_at_the_desktop_project_2-master/assets/data/{name}.csv")

today = datetime.date(datetime.now())

prices('^GSPC', '1929-1-1', '1954-12-31', 'GSPC_GD')
gspc = prices('^GSPC', '01/31/2020', today, 'GSPC')

zoom = prices('ZM', '01/31/2020', today, 'Zoom')
data = gspc.merge(zoom, on='Date')

boeing = prices('BA', '01/31/2020', today, 'Boeing')
data = data.merge(boeing, on='Date')

royal_cruise = prices('RCL', '01/31/2020', today, 'Royal_Cruise')
data = data.merge(royal_cruise, on='Date')

jnj = prices('JNJ', '01/31/2020', today, 'JNJ')
data = data.merge(jnj, on='Date')

chevron = prices('CVX', '01/31/2020', today, 'Chevron')
data = data.merge(chevron, on='Date')

adidas = prices('ADDYY', '01/31/2020', today, 'Adidas')
data = data.merge(adidas, on='Date')

gild = prices('GILD', '01/31/2020', today, 'GILD')
data = data.merge(gild, on='Date')

ford = prices('FORD', '01/31/2020', today, 'FORD')
data = data.merge(ford, on='Date')

mondera = prices('MRNA', '01/31/2020', today, 'MRNA')
data = data.merge(mondera, on='Date')

marriott = prices('MAR', '01/31/2020', today, 'Marriott')
data = data.merge(marriott, on='Date')
data['Center'] = '100'
data.to_csv(f"/Users/jackharvey/Documents/panic_at_the_desktop_project_2-master/assets/data/stocks.csv")

#def normalize_plot(ticker, startDate, endDate):
# tickers = ["ZM", "JNJ", "BA", 'RCL','MAR','FORD', 'MRNA', '^GSPC']
# mydata = pd.DataFrame()
# for t in tickers:
#     mydata[t] = web.DataReader(t,
#                         start = "2020-2-1",
#                         end = today,
#                         data_source='yahoo')['Adj Close']

# normalize = (mydata / mydata.iloc[0] * 100)
# normalize.plot(figsize=(15,6))
# plt.grid()
# plt.show()

# #normalize_plot('PMO', '2018-1-1', today)