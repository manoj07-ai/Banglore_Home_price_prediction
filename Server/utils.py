import json
import pickle
import numpy as np
import os

__locations = None
__model = None
__data_columns = None


BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ART_DIR = os.path.normpath(os.path.join(BASE_DIR, "..", "Artifacts"))

def get_estimated_price(location, sqft, bath, bhk):
    loc_index = -1
    try:
        loc_index = __data_columns.index(location.lower())
    except Exception:
        loc_index = -1

    x = np.zeros(len(__data_columns))
    x[0] = sqft
    x[1] = bath
    x[2] = bhk
    if loc_index >= 0:
        x[loc_index] = 1

    return round(float(__model.predict([x])[0]), 2)

def get_location_names():
    return __locations

def load_saved_artifacts():
    global __locations, __model, __data_columns
    with open(os.path.join(ART_DIR, "columns.json"), "r") as f:
        __data_columns = json.load(f)["data_columns"]
        __locations = __data_columns[3:]
    with open(os.path.join(ART_DIR, "bangalore_house_price_xgb_model.pkl"), "rb") as f:
        __model = pickle.load(f)
