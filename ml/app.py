from flask import Flask, request, jsonify
import pickle
import numpy as np
import pandas as pd
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# 📦 Load Model
with open("model.pkl", 'rb') as file:
    model = pickle.load(file)

# 📄 Excel file path
EXCEL_FILE = "Stu_hour_score.xlsx"

# 📄 If Excel file doesn't exist, create it with headers
if not os.path.exists(EXCEL_FILE):
    df_init = pd.DataFrame(columns=["hours", "score"])
    df_init.to_excel(EXCEL_FILE, index=False)

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    hours = data.get('hours')

    if hours is None:
        return jsonify({"error": "Missing 'hours' in request"}), 400
    
    if hours<0 or hours>12:
        return jsonify({"error":"Hours must be between 0 to 12"}),400

    try:
        # 🔢 Convert hours to array and predict
        hours_array = np.array([[float(hours)]])
        prediction = model.predict(hours_array)[0]

        # ✅ Clamp to max 100 (marks cannot go above 100)
        prediction = min(prediction, 100.0)

        # 📝 Append data to Excel
        new_row = pd.DataFrame({"hours": [hours], "score": [round(prediction, 2)]})
        df = pd.read_excel(EXCEL_FILE)
        df = pd.concat([df, new_row], ignore_index=True)
        df.to_excel(EXCEL_FILE, index=False)

        # ✅ Response
        return jsonify({
            "hours": hours,
            "predicted_score": round(prediction, 2)
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "ok"}), 200

if __name__ == '__main__':
    app.run(debug=True)
