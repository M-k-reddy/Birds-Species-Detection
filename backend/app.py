import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from detect_bird_species import detect_bird_species

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Set uploads folder path in the static directory for serving images
uploads_folder = os.path.join(app.root_path, "static", "uploads")
os.makedirs(uploads_folder, exist_ok=True)  # Ensure the folder exists

@app.route("/api/upload", methods=["POST"])
def upload_image():
    if "image" in request.files and request.files["image"].filename:
        image = request.files["image"]
        image_path = os.path.join(uploads_folder, image.filename)
        image.save(image_path)

        detected_birds = detect_bird_species(image_path)
        image_url = f"static/uploads/{image.filename}"  # Pass the relative path for rendering
        return jsonify({"birds": detected_birds, "image_url": image_url})

    return jsonify({"error": "No image uploaded"}), 400

if __name__ == "__main__":
    # Disable the reloader to avoid repeated restarts caused by filesystem changes
    app.run(debug=False, use_reloader=False)