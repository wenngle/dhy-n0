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
    return

def uptick(df):
    shape = df.shape
    rows = shape[0]
    df.loc(rows - 1)[""]

    return

def downtick(df):
    pass