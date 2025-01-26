from flask import Flask, request, jsonify
import pandas as pd
import openai
import os
import json
from dotenv import load_dotenv
from flask_cors import CORS  # Add CORS support for cross-origin requests

# Load environment variables
load_dotenv()

# Set up OpenAI API key
openai.api_key = os.getenv('OPENAI_API_KEY')

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

# Function to generate medicine description using OpenAI API
# English
def get_medicine_description_en(medicine):
    prompt = f"Explain what the following medicine does in very simple words, like you’re talking to a child. Keep it short and easy to understand:\n{medicine}:"
    try:
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a medical assistant providing simple medicine descriptions in less than two sentences."},
                {"role": "user", "content": prompt}
            ]
        )
        return response['choices'][0]['message']['content'].strip()
    except Exception as e:
        return f"Error fetching description for {medicine}: {str(e)}"

# Chinese
def get_medicine_description_ch(medicine):
    prompt = f"用非常简单的语言解释以下药物的作用，就像在给孩子讲解一样。保持简短易懂：\n{medicine}:"
    try:
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "你是一名医学助手，请用中文提供简单的药物描述，不超过两句话。"},
                {"role": "user", "content": prompt}
            ]
        )
        return response['choices'][0]['message']['content'].strip()
    except Exception as e:
        return f"Error fetching description for {medicine}: {str(e)}"

@app.route('/api/save-prescription', methods=['POST'])
def save_prescription():
    prescription_data = request.json
    medicines = [item['medicine'] for item in prescription_data]
    prescription_file_path = './data/prescription.json'
    with open(prescription_file_path, 'w') as f:
        json.dump(prescription_data, f, indent=2)

    #different languages that may be worked on
    explanations_en = []
    #explanations_ch = []
    for medicine in medicines:
        explanation_en = get_medicine_description_en(medicine)
        #explanation_ch = get_medicine_description_ch(medicine)
        explanations_en.append({"medicine": medicine, "explanation": explanation_en})
        #explanations_ch.append({"medicine": medicine, "explanation": explanation_ch})
    explanations_file_path = './data/explanation.json'
    with open(explanations_file_path, 'w') as f:
        json.dump(explanations_en, f, indent=2)
    print("Generated explanations (EN):", explanations_en)  # Debug print statement
    #print("Generated explanations (CH):", explanations_ch)  # Debug print statement

    return jsonify({
        "status": "success",
        "message": "Explanations generated successfully",
        "explanations_en": explanations_en,
        
    })

if __name__ == '__main__':
    print("Starting Flask server...")  # Debug print statement
    app.run(debug=True, port=5000)