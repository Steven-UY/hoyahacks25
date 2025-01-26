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

#Spanish
def get_medicine_description_es(medicine):
    prompt = f"Explica de manera muy sencilla para un niño qué hace el siguiente medicamento. Hazlo corto y fácil de entender:\n{medicine}:"
    try:
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "Eres un asistente médico que proporciona descripciones sencillas de medicamentos en no más de dos oraciones."},
                {"role": "user", "content": prompt}
            ]
        )
        return response['choices'][0]['message']['content'].strip()
    except Exception as e:
        return f"Error fetching description for {medicine}: {str(e)}"

@app.route('/api/save-prescription', methods=['POST'])
def save_prescription():
    print("save_prescription endpoint called")  # Debug print statement
    prescription_data = request.json
    print("Received prescription data:", prescription_data)  # Debug print statement

    # Read existing data from the JSON file
    prescription_file_path = './data/saved_prescription.json'
    try:
        if os.path.exists(prescription_file_path):
            with open(prescription_file_path, 'w', encoding='utf-8') as f:
                existing_data = json.load(f)
        else:
            existing_data = []
    except Exception as e:
        print(f"Error reading existing prescription data: {str(e)}")  # Debug print statement
        existing_data = []

    # Append new prescription data to existing data
    existing_data.extend(prescription_data)

    # Save updated prescription data to the JSON file
    try:
        with open(prescription_file_path, 'w', encoding='utf-8') as f:
            json.dump(existing_data, f, indent=2, ensure_ascii=False)
        print(f"Prescription data saved to {prescription_file_path}")  # Debug print statement
    except Exception as e:
        print(f"Error saving prescription data: {str(e)}")  # Debug print statement

    # Extract medicine names
    medicines = [item['medicine'] for item in prescription_data]
    print("Extracted medicines:", medicines)  # Debug print statement

    # Generate explanations
    explanations = []
    language = 'en'
    for medicine in medicines:
        if language == 'en':
            explanation = get_medicine_description_en(medicine)
        elif language == 'ch':
            explanation = get_medicine_description_ch(medicine)
        elif language == 'es':
            explanation = get_medicine_description_es(medicine)
        else:
            explanation = get_medicine_description_en(medicine)

        explanations.append({"medicine": medicine, "explanation": explanation})

    # Append explanations to the existing data
    for item in existing_data:
        for explanation in explanations:
            if item['medicine'] == explanation['medicine']:
                item['explanation'] = explanation['explanation']

    # Save updated data with explanations to the JSON file
    try:
        with open(prescription_file_path, 'w', encoding='utf-8') as f:
            json.dump(existing_data, f, ensure_ascii=False, indent=2)
        print(f"Explanations saved to {prescription_file_path}")  # Debug print statement
    except Exception as e:
        print(f"Error saving explanations: {str(e)}")  # Debug print statement

    return jsonify({
        "status": "success",
        "message": "Explanations generated successfully",
        "explanations_en": explanations,
    })

if __name__ == '__main__':
    print("Starting Flask server...") 
    app.run(debug=True, port=5000)