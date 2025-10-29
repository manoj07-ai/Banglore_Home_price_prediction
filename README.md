🏠 Home Price Prediction using XGBoost + Flask + Tailwind

Predict Bengaluru home prices (in Lakhs INR) using a trained XGBoost regression model, served through a Flask backend API and a modern Tailwind-powered frontend, seamlessly deployed on Render (backend) and Vercel (frontend) — all for free.

🚀 Overview

This project predicts the estimated price of homes in Bengaluru based on:

📏 Square footage (total_sqft)

🛏️ Number of bedrooms (bhk)

🛁 Number of bathrooms (bath)

📍 Location

It uses machine learning (XGBoost Regressor) trained on real housing data, with a production-ready Flask API, and a responsive frontend built with HTML, CSS, and JavaScript (Tailwind).

✨ Key Features

✅ Machine Learning Model

XGBoost Regression trained and tuned with Random Search + Grid Search

Uses one-hot encoded location features for accurate predictions

Saved as .pkl file for efficient inference

✅ Flask Backend API

Minimal yet production-ready

Two key endpoints:

/get_location_names → Get list of locations

/predict_home_price → Predict price in Lakhs INR

Deployed on Render.com (Free Web Service plan)

Supports CORS for frontend API calls

✅ Responsive Frontend

Built with Tailwind CSS for fast, modern design

Includes dropdowns, form validation, and loading states

Dark mode toggle

Deployed on Vercel (Free Plan)

✅ Completely Free to Deploy

Backend → Render

Frontend → Vercel

No servers to manage, no database needed

📁 Project Structure
home-price-prediction/
├─ Client/                 # Frontend (HTML, CSS, JS)
│  ├─ index.html
│  ├─ script.js
│  └─ style.css
│
├─ Server/                 # Backend (Flask API)
│  ├─ server.py
│  └─ utils.py
│
├─ Artifacts/              # Model and feature files
│  ├─ bangalore_house_price_xgb_model.pkl
│  └─ columns.json
│
├─ Model/                  # Training notebooks and dataset
│  ├─ Banglore_Home_prices.ipynb
│  └─ Bengaluru_House_Data.csv
│
├─ requirements.txt
└─ README.md

⚙️ API Reference
Base URL (Local)

http://127.0.0.1:5000

Endpoints
GET /get_location_names

Response

{
  "locations": [
    "location_hsr layout",
    "location_whitefield",
    "location_koramangala",
    "..."
  ]
}

POST /predict_home_price

Request

{
  "total_sqft": 1200,
  "location": "location_hsr layout",
  "bhk": 2,
  "bath": 2
}


Response

{
  "estimated_price": 85.25
}


💡 The estimated price is returned in Lakhs INR, rounded to two decimals.

💻 Local Setup Guide
1️⃣ Create & activate virtual environment
python -m venv .venv
# Windows
. .venv/Scripts/activate
# macOS/Linux
source .venv/bin/activate

2️⃣ Install dependencies
pip install --upgrade pip
pip install -r requirements.txt

3️⃣ Run Flask backend
python Server/server.py
# Flask dev server runs on http://127.0.0.1:5000

4️⃣ Launch frontend

Option A:
Simply open Client/index.html in your browser.

Option B (Recommended for CORS Testing):

cd Client
python -m http.server 5500
# Visit http://127.0.0.1:5500


In Client/script.js, set:

const BASE_URL = "http://127.0.0.1:5000";

🧠 Model and Data

Algorithm: XGBoost Regressor

Tuning: RandomizedSearchCV + GridSearchCV

Target: Price (Lakhs INR)

Features:

total_sqft

bath

bhk

One-hot encoded location columns

Model files:

Artifacts/bangalore_house_price_xgb_model.pkl

Artifacts/columns.json

🧩 Minimal Flask Server Example
from flask import Flask, request, jsonify
from flask_cors import CORS
import utils

app = Flask(__name__)
CORS(app)

@app.before_first_request
def load_artifacts():
    utils.load_saved_artifacts()

@app.route('/get_location_names')
def get_location_names():
    return jsonify({'locations': utils.get_location_names()})

@app.route('/predict_home_price', methods=['POST'])
def predict_home_price():
    data = request.get_json()
    price = utils.get_estimated_price(
        data['location'],
        float(data['total_sqft']),
        int(data['bath']),
        int(data['bhk'])
    )
    return jsonify({'estimated_price': price})

if __name__ == "__main__":
    app.run(debug=True)

🌐 Free Deployment Guide
🔹 Backend → Render

Push your code to GitHub

Create a Render Web Service

Build Command:

pip install -r requirements.txt


Start Command:

gunicorn Server.server:app -b 0.0.0.0:$PORT


Root Directory: Leave empty

Enable CORS in Flask

🔹 Frontend → Vercel

Move frontend files (index.html, script.js, style.css) into /Client

Create a Vercel project and select /Client as the root

In script.js, update:

const BASE_URL = "https://your-backend.onrender.com";


Deploy – your frontend will be live instantly!

🧾 requirements.txt
flask
flask-cors
numpy
pandas
xgboost
scikit-learn
gunicorn

🛠️ Roadmap

🔁 Model retraining pipeline

✅ Automated input validation

🧪 Unit tests for utils and endpoints

📊 Add visual analytics dashboard

🤝 Contributing

Pull requests are welcome!
If you’d like to improve the model, UI, or deployment flow, please open an issue first to discuss your ideas.

📜 License

This project is open source under the MIT License.

🌟 Show Your Support

If you like this project:
⭐ Star this repo on GitHub
🔗 Share it with others learning Flask + ML
💬 Give feedback to make it even better!
