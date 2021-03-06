from back.mongo.data.collect.ions import find_collection
from back.mongo.data.collect.countries.model import Country

collection = find_collection("countries")

def find_country(query={}, filter={"_id": 0}):

    return dict(collection.find_one(query, filter))

def find_countries(query={}, filter={"_id": 0}, sort=[("name", 1)], limit=0):

    collection.create_index(sort)

    return list(collection.find(query, filter).sort(sort).limit(limit))

def update_country(country):

    return collection.update_one({"code": country["code"]}, {"$set": country})

def update_countries():

    for country in find_countries():

        update_country(country)
