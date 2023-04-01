import os
import requests
from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

API_KEY = os.environ.get("OPENWEATHERMAP_API_KEY")

@app.route("/api/weather/<string:city>")
def get_weather(city):
    url = f"http://api.openweathermap.org/data/2.5/weather?q={city}&appid={API_KEY}&units=metric"
    response = requests.get(url)
    if response.status_code == 404:
        return jsonify({"error": "City not found"}), 404
    elif response.status_code != 200:
        return jsonify({"error": "Failed to fetch weather data"}), response.status_code
    return jsonify(response.json())

@app.route("/api/hourly_weather/<string:city>")
def get_hourly_weather(city):
    url = f"http://api.openweathermap.org/data/2.5/forecast?q={city}&appid={API_KEY}&units=metric"
    response = requests.get(url)
    if response.status_code == 404:
        return jsonify({"error": "City not found"}), 404
    elif response.status_code != 200:
        return jsonify({"error": "Failed to fetch weather data"}), response.status_code
    return jsonify(response.json())

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 8080)))

