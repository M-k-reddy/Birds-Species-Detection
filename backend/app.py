import os
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from detect_bird_species import detect_bird_species

# Determine frontend static directory (build output)
current_dir = os.path.dirname(os.path.abspath(__file__))
frontend_dir = os.environ.get(
    "FRONTEND_DIR",
    os.path.abspath(os.path.join(current_dir, "..", "build"))
)
if not os.path.exists(frontend_dir):
    frontend_dir = os.path.abspath(os.path.join(current_dir, "build"))

app = Flask(__name__, static_folder=frontend_dir, static_url_path="")
CORS(app)  # Enable CORS for all routes

# Set uploads folder path in the static directory for serving images
uploads_folder = os.path.join(current_dir, "static", "uploads")
os.makedirs(uploads_folder, exist_ok=True)  # Ensure the folder exists

@app.route("/api/health", methods=["GET", "HEAD"])
def health_check():
    """Health check endpoint for Cloud Run and uptime monitors."""
    return jsonify({"status": "healthy"}), 200

@app.route("/api/upload", methods=["POST"])
def upload_image():
    """Upload an image and run two-stage bird classification."""
    if "image" in request.files and request.files["image"].filename:
        image = request.files["image"]
        image_path = os.path.join(uploads_folder, image.filename)
        image.save(image_path)

        detected_birds = detect_bird_species(image_path)
        image_url = f"/static/uploads/{image.filename}"
        return jsonify({"birds": detected_birds, "image_url": image_url})

    return jsonify({"error": "No image uploaded"}), 400

@app.route("/static/uploads/<path:filename>")
def serve_upload(filename):
    """Serve uploaded user images."""
    return send_from_directory(uploads_folder, filename)

@app.route("/", defaults={"path": ""}, methods=["GET", "HEAD"])
@app.route("/<path:path>", methods=["GET", "HEAD"])
def serve_spa(path):
    """Serve the compiled React single page application."""
    if path != "" and os.path.exists(os.path.join(frontend_dir, path)):
        return send_from_directory(frontend_dir, path)
    if os.path.exists(os.path.join(frontend_dir, "index.html")):
        return send_from_directory(frontend_dir, "index.html")
    return jsonify({"message": "Bird Species Detection API is running"}), 200

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8080))
    app.run(host="0.0.0.0", port=port, debug=False, use_reloader=False)