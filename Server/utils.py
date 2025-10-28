import json
import pickle
import numpy as np

__locations=None
__model=None
__data_columns=None
def get_estimated_price(location,sqft,bath,bhk):
    try:
        loc_index=__data_columns.index(location.lower())
    except:
        loc_index=-1
    x=np.zeros(len(__data_columns))
    x[0]=sqft
    x[1]=bath
    x[2]=bhk
    if loc_index>=0:
        x[loc_index]=1

    return round(__model.predict([x])[0],2)

def get_location_names():
    return __locations
def load_saved_artifacts():
    global __locations
    global __model
    global __data_columns
    with open("./Artifacts/columns.json","r") as f:
        __data_columns=json.load(f)["data_columns"]
        __locations=__data_columns[3:]

    with open("./Artifacts/bangalore_house_price_xgb_model.pkl","rb") as f:
        __model=pickle.load(f)

