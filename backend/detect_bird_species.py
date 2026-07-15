import os
import urllib.request
import numpy as np
from PIL import Image
import onnxruntime as ort

# Google Cloud Vision is optional — only imported if credentials are present
try:
    from google.cloud import vision as gcloud_vision
    _gcloud_available = True
except ImportError:
    _gcloud_available = False

# Cache for local pipeline to avoid loading the model on every request
_classifier = None

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
        print("[INFO] Google Cloud Vision credentials not found. Using local Hugging Face classifier for offline bird species detection.")

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

def is_image_a_bird(image_path):
    """Runs a fast local MobileNetV2 inference to verify if the image actually contains a bird"""
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
        mean = np.array([0.485, 0.456, 0.406], dtype=np.float32)
        std = np.array([0.229, 0.224, 0.225], dtype=np.float32)
        img_data = (img_data - mean) / std
        
        img_data = np.transpose(img_data, (2, 0, 1))
        img_data = np.expand_dims(img_data, axis=0)
        
        # Run inference
        input_name = session.get_inputs()[0].name
        output_name = session.get_outputs()[0].name
        raw_result = session.run([output_name], {input_name: img_data})[0]
        
        # Get top predicted ImageNet class
        top_idx = np.argmax(raw_result[0])
        top_class = categories[top_idx].lower()
        
        # ImageNet bird indices lists (indices of all bird-related categories in ImageNet)
        bird_indices = set(range(7, 25)).union(set(range(80, 101))).union(set(range(127, 147)))
        
        # Bird keywords for fallback string matching
        bird_keywords = [
            'bird', 'owl', 'eagle', 'sparrow', 'crow', 'jay', 'finch', 'hawk', 'falcon', 
            'vulture', 'osprey', 'kite', 'heron', 'stork', 'swan', 'duck', 'goose', 'turkey', 
            'chicken', 'hen', 'cock', 'peacock', 'quail', 'partridge', 'pheasant', 'grouse', 
            'penguin', 'albatross', 'pelican', 'gull', 'tern', 'puffin', 'toucan', 'hornbill', 
            'parrot', 'macaw', 'cockatoo', 'parakeet', 'dove', 'pigeon', 'woodpecker', 
            'hummingbird', 'swift', 'swallow', 'lark', 'robin', 'thrush', 'bluebird', 
            'warbler', 'cardinal', 'bunting', 'oriole', 'blackbird', 'starling', 'raven', 
            'magpie', 'chickadee', 'titmouse', 'nuthatch', 'wren', 'mockingbird', 'tanager', 
            'weaver', 'waxwing', 'pipit', 'accentor', 'kinglet', 'gnatcatcher', 'vireo', 
            'shrike', 'flycatcher', 'martin', 'nightjar', 'cuckoo', 'turaco', 'roadrunner', 
            'hoopoe', 'kingfisher', 'bee-eater', 'roller', 'trogon', 'jacamar', 'puffbird', 
            'barbet', 'honeyguide', 'piculet', 'wryneck'
        ]
        
        is_bird = (top_idx in bird_indices) or any(kw in top_class for kw in bird_keywords)
        detected_label = top_class.split(',')[0].strip().title()
        
        return is_bird, detected_label
    except Exception as e:
        print(f"[ERROR] Failed to run bird verification: {e}")
        # Default to True so we don't block actual classification in case of minor errors
        return True, "Unknown"

def detect_bird_species(image_path):
    """Detects bird species from an image using Google Cloud Vision API with offline HF pipeline fallback"""
    creds_path = os.environ.get("GOOGLE_APPLICATION_CREDENTIALS")
    
    # 1. Try Google Cloud Vision API if credentials are configured and library available
    if _gcloud_available and creds_path and os.path.exists(creds_path) and os.path.getsize(creds_path) > 10:
        try:
            client = gcloud_vision.ImageAnnotatorClient()

            # Read the image file
            with open(image_path, "rb") as image_file:
                content = image_file.read()

            image = gcloud_vision.Image(content=content)
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
        # Step 2a: Run MobileNetV2 verification first to ensure the image contains a bird
        is_bird, detected_label = is_image_a_bird(image_path)
        if not is_bird:
            print(f"[INFO] Verification failed: Image is not a bird (Detected: {detected_label})")
            return [f"Not a Bird (Detected: {detected_label})"]
        
        # Step 2b: If it's a bird, run the high-accuracy classifier
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
