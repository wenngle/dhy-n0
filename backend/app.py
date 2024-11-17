from flask import Flask, jsonify, request
import pandas as pd
from datetime import datetime
from pathlib import Path
import json
import numpy as np
import os

app = Flask(__name__)

files = sorted(Path('../eog-resources/data').glob('*.csv'))

@app.route('/api/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
        
    file = request.files['file']
    
    # Save file directly to the data directory
    filename = file.filename
    save_path = Path('../eog-resources/data') / filename
    file.save(save_path)
    
    # Add to files list
    files.append(save_path)
    
    return jsonify({
        'message': 'File uploaded successfully',
        'filename': filename
    }), 200

@app.route("/api/wells")
def list_wells():
    return jsonify([
        {
            'id': well_id,
            'has_hydrate': json.loads(get_well_data(well_id))[-1]['Hydrate'],
            'delta_volume': (lambda l: l[1]['Inj Gas Meter Volume Instantaneous'] - l[0]['Inj Gas Meter Volume Instantaneous'])(json.loads(get_well_data(well_id))[-2:]),
            'well_name': os.path.basename(file)[:-4],
        } for well_id, file in enumerate(files)
    ])

def detect_hydrates(df, window_size=3):
    """
    Detect potential hydrate formation events with strict boolean risk score
    """
    df = df.copy()
    
    max_volume = df['Inj Gas Meter Volume Instantaneous'].quantile(0.95)
    df['volume_change'] = df['Inj Gas Meter Volume Instantaneous'].diff(periods=window_size)
    df['volume_change_pct'] = df['volume_change'] / max_volume * 100
    
    df['Hydrate'] = (
        ((df['Inj Gas Meter Volume Instantaneous'] < 0.5 * max_volume) & (df["Inj Gas Valve Percent Open"] > 50)) |
        
        ((df['volume_change_pct'] < -20) & 
         (df["Inj Gas Valve Percent Open"].diff() > 0) & 
         (df["Inj Gas Valve Percent Open"] > 45)) |
        
        (df["Inj Gas Valve Percent Open"] > 90)
    ).astype(int).astype(bool)
    
    return df

@app.route("/api/well/<well_id>")
def get_well_data(well_id):
    df = pd.read_csv(files[int(well_id)]).ffill()
    df['Time'] = df['Time'].transform(lambda x: datetime.strptime(x, '%m/%d/%Y %I:%M:%S %p'))
    df = detect_hydrates(df)
    return df.to_json(orient='records')
