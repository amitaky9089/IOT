from flask import Flask, jsonify
from flask_cors import CORS
import random
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app)

# Generate random temperature and time data
def generate_device_data():
    now = datetime.now()
    time_stamps = [(now - timedelta(minutes=30 * i)).strftime("%H:%M") for i in range(5)][::-1]
    temperatures = [random.randint(18, 30) for _ in range(5)]
    return {
        "lastUpdated": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "isActive": True,
        "graphData": {
            "time": time_stamps,
            "temperature": temperatures,
        }
    }

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
