from flask import Flask, jsonify
import pandas as pd
from datetime import datetime

app = Flask(__name__)

@app.route("/api/hello")
def hello_world():
    return jsonify({'message':'hello'})

@app.route("/api/test_data")
def test_data():
    df = pd.read_csv('../eog-resources/data/Bold_744H-10_31-11_07.csv')
    df['Time'] = df['Time'].transform(lambda x: datetime.strptime(x, '%m/%d/%Y %I:%M:%S %p'))
    return df.ffill().to_json(orient='records')

@app.route("/api/test_data/<path>")
def test_data(path):
    df = pd.read_csv(path)
    df['Time'] = df['Time'].transform(lambda x: datetime.strptime(x, '%m/%d/%Y %I:%M:%S %p'))
    return df.ffill().to_json(orient='records')

def chance_of_hydrite(df):
    new_df = df[(df["Inj Gas Meter Volume Instantaneous"] <= 1) & (df["Inj Gas Valve Percent Open"] >= 90)]
    return new_df

def get_tick(df):
    ''' 
    Use for green up arrow and red down arrow in frontend to
    show user if 
    '''
    shape = df.shape
    delta = df.loc[shape[0] - 1]["Inj Gas Meter Volume Instantaneous"] - df.loc[shape[0] - 2]["Inj Gas Meter Volume Instantaneous"]
    return delta