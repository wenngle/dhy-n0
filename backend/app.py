from flask import Flask, jsonify
import pandas as pd
from datetime import datetime
from pathlib import Path
import json

app = Flask(__name__)

files = sorted(Path('../eog-resources/data').glob('*.csv'))

@app.route("/api/hello")
def hello_world():
    return jsonify({'message':'hello'})

@app.route("/api/test_data")
def test_data():
    df = pd.read_csv(files[0])
    df['Time'] = df['Time'].transform(lambda x: datetime.strptime(x, '%m/%d/%Y %I:%M:%S %p'))
    return df.ffill().to_json(orient='records')

@app.route("/api/wells")
def list_wells():
    return jsonify([
        {
            'id': well_id,
            'has_hydrate': json.loads(get_well_data(well_id))[-1]['Hydrate'],
            'delta_volume': (lambda l: l[1]['Inj Gas Meter Volume Instantaneous'] - l[0]['Inj Gas Meter Volume Instantaneous'])(json.loads(get_well_data(well_id))[-2:])
        } for well_id, file in enumerate(files)
    ])

@app.route("/api/well/<well_id>")
def get_well_data(well_id):
    df = pd.read_csv(files[int(well_id)]).ffill()
    df['Time'] = df['Time'].transform(lambda x: datetime.strptime(x, '%m/%d/%Y %I:%M:%S %p'))
    df['Hydrate'] = (df["Inj Gas Meter Volume Instantaneous"] <= 1) & (df["Inj Gas Valve Percent Open"] >= 90)
    return df.to_json(orient='records')