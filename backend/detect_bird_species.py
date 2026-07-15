import os
import urllib.request
import numpy as np
from PIL import Image
import onnxruntime as ort
from google.cloud import vision

# Set up Google Cloud credentials using local path if present
backend_dir = os.path.dirname(os.path.abspath(__file__))
default_key_path = os.path.join(backend_dir, "service_account_key.json")

# Model and Labels paths for local fallback
local_model_path = os.path.join(backend_dir, "mobilenetv2-7.onnx")
local_labels_path = os.path.join(backend_dir, "imagenet_classes.txt")

if os.path.exists(default_key_path) and os.path.getsize(default_key_path) > 10:
    os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = default_key_path
    print(f"[INFO] Using Google Cloud Vision credentials from: {default_key_path}")
else:
    # Check if GOOGLE_APPLICATION_CREDENTIALS is already set in environment and valid
    env_key = os.environ.get("GOOGLE_APPLICATION_CREDENTIALS")
    if env_key and os.path.exists(env_key):
        print(f"[INFO] Using Google Cloud Vision credentials from environment: {env_key}")
    else:
        print("[INFO] Google Cloud Vision credentials not found. Using local ONNX classifier (MobileNetV2) for offline bird species detection.")

def download_local_assets():
    """Downloads MobileNetV2 ONNX model and ImageNet labels if they are missing"""
    if not os.path.exists(local_model_path):
        print("[INFO] Downloading MobileNetV2 ONNX model (14.2MB) for offline detection...")
        url = "https://github.com/onnx/models/raw/main/validated/vision/classification/mobilenet/model/mobilenetv2-7.onnx"
        urllib.request.urlretrieve(url, local_model_path)
        print("[INFO] Model downloaded successfully!")
        
    if not os.path.exists(local_labels_path):
        print("[INFO] Downloading ImageNet labels...")
        url = "https://raw.githubusercontent.com/pytorch/hub/master/imagenet_classes.txt"
        urllib.request.urlretrieve(url, local_labels_path)
        print("[INFO] Labels downloaded successfully!")

def detect_bird_species(image_path):
    """Detects bird species from an image using Google Cloud Vision API with offline ONNX fallback"""
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
            print("[INFO] Falling back to local ONNX classifier due to error.")

    # 2. Offline Fallback Mode: MobileNetV2 ONNX Classifier
    try:
        download_local_assets()
        
        # Load labels
        with open(local_labels_path, "r") as f:
            categories = [line.strip() for line in f.readlines()]
            
        # Load model session
        session = ort.InferenceSession(local_model_path)
        
        # Preprocess image
        img = Image.open(image_path).convert('RGB')
        img = img.resize((224, 224))
        
        img_data = np.array(img).astype(np.float32) / 255.0
        
        # ImageNet normalization
        mean = np.array([0.485, 0.456, 0.406], dtype=np.float32)
        std = np.array([0.229, 0.224, 0.225], dtype=np.float32)
        img_data = (img_data - mean) / std
        
        # Transpose HWC -> CHW and add batch dimension (1, 3, 224, 224)
        img_data = np.transpose(img_data, (2, 0, 1))
        img_data = np.expand_dims(img_data, axis=0)
        
        # Run inference
        input_name = session.get_inputs()[0].name
        output_name = session.get_outputs()[0].name
        
        raw_result = session.run([output_name], {input_name: img_data})[0]
        
        # Get top class
        scores = raw_result[0]
        top_idx = np.argmax(scores)
        
        # Extract the clean category name (first synonym, capitalized)
        detected_species = categories[top_idx].split(',')[0].strip().title()
        
        print(f"[INFO] Local ONNX classification result: {detected_species} (confidence score: {scores[top_idx]:.2f})")
        return [detected_species]
        
    except Exception as e:
        print(f"[ERROR] Failed to run local ONNX classifier: {e}")
        # Final safety fallback
        return ["Bird (Offline Classifier failed)"]


