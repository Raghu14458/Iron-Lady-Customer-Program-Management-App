from flask import Flask, render_template, request, jsonify
import json
import os

app = Flask(__name__)
DATA_FILE = "customers.json"

# Load data from JSON
def load_data():
    if not os.path.exists(DATA_FILE):
        return []
    with open(DATA_FILE, "r", encoding="utf-8") as f:
        return json.load(f)

# Save data to JSON
def save_data(data):
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=4)

# Home route
@app.route("/")
def home():
    return render_template("index.html")

# Get all customers
@app.route("/customers", methods=["GET"])
def get_customers():
    return jsonify(load_data())

# Add customer
@app.route("/add", methods=["POST"])
def add_customer():
    data = load_data()
    new_cust = request.json
    new_cust["id"] = len(data) + 1
    data.append(new_cust)
    save_data(data)
    return jsonify({"message": "Customer added successfully"})

# Update customer
@app.route("/update/<int:cust_id>", methods=["PUT"])
def update_customer(cust_id):
    data = load_data()
    for cust in data:
        if cust["id"] == cust_id:
            cust.update(request.json)
            save_data(data)
            return jsonify({"message": "Customer updated successfully"})
    return jsonify({"error": "Customer not found"}), 404

# Delete customer
@app.route("/delete/<int:cust_id>", methods=["DELETE"])
def delete_customer(cust_id):
    data = load_data()
    data = [cust for cust in data if cust["id"] != cust_id]
    save_data(data)
    return jsonify({"message": "Customer deleted successfully"})

if __name__ == "__main__":
    # Run on localhost:8000
    app.run(debug=True, host="127.0.0.1", port=8000)
