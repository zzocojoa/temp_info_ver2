# server\utils\thresholdProcess.py

import sys
import pandas as pd
import json

def thresholdProcess(file_path):
    data = pd.read_csv(file_path, encoding='utf-8')
    median_temperature = data['temperature'].median()
    threshold = data['temperature'].quantile(0.25)
    filtered_data = data[data['temperature'] >= threshold]
    median_filtered = filtered_data['temperature'].median()

    result = {
        'file_path': file_path,
        'threshold': threshold,
        'outliers_detected': len(data) - len(filtered_data),
        'median_before': median_temperature,
        'median_after': median_filtered,
        'filtered_data': filtered_data.to_dict(orient='records')
    }

    return result

if __name__ == '__main__':
    file_paths = sys.argv[1:]
    results = [thresholdProcess(file_path) for file_path in file_paths]
    print(json.dumps(results, ensure_ascii=False))
