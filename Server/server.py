from flask import Flask, request, jsonify
from flask_cors import CORS
import utils
import os

app = Flask(__name__)
CORS(app)

utils.load_saved_artifacts()
@app.route("/get_location_names")
def get_location_names():
    return jsonify({"locations": utils.get_location_names()})

@app.route("/predict_home_price", methods=['POST'])
def predict_home_price():
    data = request.get_json(force=True)
    total_sqft = float(data['total_sqft'])
    location = data['location']  # expects exact column key like "location_hsr layout"
    bath = int(data['bath'])
    bhk = int(data['bhk'])
    return jsonify({'estimated_price': float(utils.get_estimated_price(location, total_sqft, bath, bhk))})

if __name__ == "__main__":
    print("Starting Flask server for home price prediction")
    utils.load_saved_artifacts()
    port = int(os.environ.get("PORT", "5000"))
    app.run(host="0.0.0.0", port=port, debug=False)
