import os
from google.cloud import vision

# Cache for local pipeline to avoid loading the model on every request
_classifier = None

# Set up Google Cloud credentials using local path if present
backend_dir = os.path.dirname(os.path.abspath(__file__))
default_key_path = os.path.join(backend_dir, "service_account_key.json")

if os.path.exists(default_key_path) and os.path.getsize(default_key_path) > 10:
    os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = default_key_path
    print(f"[INFO] Using Google Cloud Vision credentials from: {default_key_path}")
else:
    # Check if GOOGLE_APPLICATION_CREDENTIALS is already set in environment and valid
    env_key = os.environ.get("GOOGLE_APPLICATION_CREDENTIALS")
    if env_key and os.path.exists(env_key):
        print(f"[INFO] Using Google Cloud Vision credentials from environment: {env_key}")
    else:
        print("[INFO] Google Cloud Vision credentials not found. Using local Hugging Face classifier for offline bird species detection.")

def get_local_classifier():
    """Lazily loads the local HuggingFace bird species classification pipeline"""
    global _classifier
    if _classifier is None:
        print("[INFO] Initializing Hugging Face offline bird species classifier...")
        from transformers import pipeline
        # Load the pipeline on CPU device
        _classifier = pipeline(
            "image-classification", 
            model="chriamue/bird-species-classifier", 
            device=-1
        )
        print("[INFO] Offline classifier initialized successfully!")
    return _classifier

def detect_bird_species(image_path):
    """Detects bird species from an image using Google Cloud Vision API with offline HF pipeline fallback"""
    creds_path = os.environ.get("GOOGLE_APPLICATION_CREDENTIALS")
    
    # 1. Try Google Cloud Vision API if credentials are configured
    if creds_path and os.path.exists(creds_path) and os.path.getsize(creds_path) > 10:
        try:
            client = vision.ImageAnnotatorClient()

            # Read the image file
            with open(image_path, "rb") as image_file:
                content = image_file.read()

            image = vision.Image(content=content)
            response = client.object_localization(image=image)

            # Handle potential API errors
            if response.error.message:
                raise Exception(f"Error in Vision API: {response.error.message}")

            objects = response.localized_object_annotations

            # Extract bird species with confidence threshold
            birds = [obj.name for obj in objects if obj.score > 0.5]
            if birds:
                return birds
        except Exception as e:
            print(f"[ERROR] Failed to run Vision API: {e}")
            print("[INFO] Falling back to local offline classifier due to error.")

    # 2. Offline Fallback Mode: Hugging Face EfficientNet Bird Classifier
    try:
        from PIL import Image
        
        # Load classifier and open image
        classifier = get_local_classifier()
        img = Image.open(image_path)
        
        # Run classification
        results = classifier(img)
        
        if results and len(results) > 0:
            top_prediction = results[0]
            detected_species = top_prediction["label"].split(',')[0].strip().title()
            confidence = top_prediction["score"]
            print(f"[INFO] Local offline classification result: {detected_species} (confidence: {confidence:.2f})")
            
            # If the model is not very confident, let the user know and provide guidance
            if confidence < 0.35:
                return [f"{detected_species} (Low Confidence: {confidence*100:.1f}% - Make sure the bird is centered & clear)"]
            else:
                return [detected_species]
        
    except Exception as e:
        print(f"[ERROR] Failed to run local offline classifier: {e}")
        
    return ["Bird (Offline Classifier failed)"]
