import os
import logging
from flask import Flask, jsonify
import psutil
from flask_cors import CORS
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)

# Enable CORS for the entire app
CORS(app)

# Configure logging for production
logging.basicConfig(level=logging.INFO)
app.logger.addHandler(logging.StreamHandler())

@app.route('/metrics', methods=['GET'])
def get_metrics():
    # CPU usage
    cpu_percent = psutil.cpu_percent(interval=1)
    # Memory usage
    memory = psutil.virtual_memory()
    memory_data = {
        "Total Memory (GB)": round(memory.total / (1024 ** 3), 2),
        "Used Memory (GB)": round(memory.used / (1024 ** 3), 2),
        "Free Memory (GB)": round(memory.available / (1024 ** 3), 2),
        "Memory Usage (%)": memory.percent
    }
    # Disk usage
    disk = psutil.disk_usage('/')
    disk_data = {
        "Total Disk Space (GB)": round(disk.total / (1024 ** 3), 2),
        "Used Disk Space (GB)": round(disk.used / (1024 ** 3), 2),
        "Free Disk Space (GB)": round(disk.free / (1024 ** 3), 2),
        "Disk Usage (%)": disk.percent
    }
    # Network stats
    net = psutil.net_io_counters()
    network_data = {
        "Total Bytes Received (MB)": round(net.bytes_recv / (1024 ** 2), 2),
        "Total Bytes Sent (MB)": round(net.bytes_sent / (1024 ** 2), 2)
    }

    # Combine all metrics
    metrics = {
        "CPU Usage (%)": cpu_percent,
        "Memory": memory_data,
        "Disk": disk_data,
        "Network": network_data
    }
    return jsonify(metrics)

if __name__ == '__main__':
    # Run the application using Gunicorn in production
    app.run(host='0.0.0.0', port=5000)
