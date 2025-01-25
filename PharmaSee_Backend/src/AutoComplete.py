from flask import Flask, request, jsonify, render_template
import pandas as pd
from flask_cors import CORS  # Add CORS support for cross-origin requests

app = Flask(__name__)
CORS(app)  # Enable CORS

df = pd.read_csv('./data/medicine.csv')

@app.route('/api/autocomplete', methods=['GET'])
def autocomplete():
    query = request.args.get('query', '').lower()
    if not query:
        return jsonify([])

    # Filter medicines based on the query prefix (case-insensitive)
    matches = df['medicine'].dropna().unique()
    suggestions = [med for med in matches if med.lower().startswith(query)]

    return jsonify(suggestions)

@app.route('/api/save-prescription', methods=['POST'])
def save_prescription():
    prescription_data = request.json
    print("Received prescription data:", prescription_data)
    # Here you could save to a database or process the data
    return jsonify({"status": "success", "message": "Prescription saved"})

if __name__ == '__main__':
    app.run(debug=True, port=5000)