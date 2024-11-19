from flask import Flask, jsonify, request
from flask_cors import CORS
import random, requests
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app)

# Generate random temperature and time data
def generate_device_data():
    now = datetime.now()
    time_stamps = [(now - timedelta(minutes=30 * i)).strftime("%H:%M") for i in range(50)][::-1]
    temperatures = [random.randint(18, 30) for _ in range(50)]
    return {
        "lastUpdated": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "isActive": True,
        "graphData": {
            "time": time_stamps,
            "temperature": temperatures,
        }
    }

# # Hardcoded user credentials
# users = {
#     "Abhas": {"username": "ABHAS", "password": "124"},
#     "user2": {"username": "AMIT", "password": "129"},
# }

USER_CREDENTIALS = {
    "ABHAS": "2021UEE0124",
    "AMIT": "2021UEE0129",
}


@app.route('/login', methods=['POST'])
def login():
    if not request.is_json:
        return jsonify({"error": "Invalid request format. JSON expected."}), 400

    data = request.json
    username = data.get("username")
    password = data.get("password")
    print(username, password)

    if not username or not password:
        return jsonify({"error": "Username and password are required."}), 400

    # Validate credentials
    if USER_CREDENTIALS.get(username) == password:
        return jsonify({"message": "Login successful"}), 200
    else:
        return jsonify({"error": "Invalid username or password."}), 401


# Route to provide data for all devices
@app.route('/api/devices', methods=['GET'])
def get_device_data():
    devices = {
        "Device1": generate_device_data(),
        "Device2": generate_device_data(),
        "Device3": generate_device_data(),
    }
    return jsonify(devices)

if __name__ == "__main__":
    app.run(debug=True)