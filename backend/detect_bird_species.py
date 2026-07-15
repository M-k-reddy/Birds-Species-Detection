import os
import urllib.request
import numpy as np
from PIL import Image
import onnxruntime as ort

# Cache for the HuggingFace classifier to avoid reloading on every request
_classifier = None

# Paths for local model assets
backend_dir = os.path.dirname(os.path.abspath(__file__))
local_model_path = os.path.join(backend_dir, "mobilenetv2-7.onnx")
local_labels_path = os.path.join(backend_dir, "imagenet_classes.txt")

print("[INFO] Running in fully offline mode — no API keys required.")


def download_local_assets():
    """Downloads MobileNetV2 ONNX model and ImageNet labels if they are missing."""
    if not os.path.exists(local_model_path):
        print("[INFO] Downloading MobileNetV2 ONNX model (14.2MB) for offline detection...")
        url = "https://github.com/onnx/models/raw/main/validated/vision/classification/mobilenet/model/mobilenetv2-7.onnx"
        urllib.request.urlretrieve(url, local_model_path)
        print("[INFO] MobileNetV2 model downloaded successfully!")

    if not os.path.exists(local_labels_path):
        print("[INFO] Downloading ImageNet class labels...")
        url = "https://raw.githubusercontent.com/pytorch/hub/master/imagenet_classes.txt"
        urllib.request.urlretrieve(url, local_labels_path)
        print("[INFO] ImageNet labels downloaded successfully!")


def get_local_classifier():
    """Lazily loads the HuggingFace bird species classification pipeline (loaded once, cached)."""
    global _classifier
    if _classifier is None:
        print("[INFO] Initializing Hugging Face bird species classifier (525 species)...")
        from transformers import pipeline
        _classifier = pipeline(
            "image-classification",
            model="chriamue/bird-species-classifier",
            device=-1  # CPU
        )
        print("[INFO] Classifier ready!")
    return _classifier


def is_image_a_bird(image_path):
    """
    Stage 1: Uses MobileNetV2 (ONNX) to verify the image contains a bird.
    Returns (True/False, detected_label_string).
    """
    try:
        download_local_assets()

        # Load ImageNet class labels
        with open(local_labels_path, "r") as f:
            categories = [line.strip() for line in f.readlines()]

        # Run ONNX inference session
        session = ort.InferenceSession(local_model_path)

        # Preprocess image: resize → normalize → CHW → batch
        img = Image.open(image_path).convert("RGB")
        img = img.resize((224, 224))
        img_data = np.array(img).astype(np.float32) / 255.0
        mean = np.array([0.485, 0.456, 0.406], dtype=np.float32)
        std  = np.array([0.229, 0.224, 0.225], dtype=np.float32)
        img_data = (img_data - mean) / std
        img_data = np.transpose(img_data, (2, 0, 1))
        img_data = np.expand_dims(img_data, axis=0)

        # Inference
        input_name  = session.get_inputs()[0].name
        output_name = session.get_outputs()[0].name
        raw_result  = session.run([output_name], {input_name: img_data})[0]

        top_idx   = int(np.argmax(raw_result[0]))
        top_class = categories[top_idx].lower()

        # ImageNet bird class index ranges
        bird_indices = (
            set(range(7, 25))      # various birds
            | set(range(80, 101))  # waterfowl, raptors
            | set(range(127, 147)) # songbirds, parrots
        )

        # Bird keyword fallback for edge cases
        bird_keywords = [
            "bird", "owl", "eagle", "sparrow", "crow", "jay", "finch", "hawk",
            "falcon", "vulture", "osprey", "kite", "heron", "stork", "swan",
            "duck", "goose", "turkey", "chicken", "hen", "cock", "peacock",
            "quail", "partridge", "pheasant", "grouse", "penguin", "albatross",
            "pelican", "gull", "tern", "puffin", "toucan", "hornbill", "parrot",
            "macaw", "cockatoo", "parakeet", "dove", "pigeon", "woodpecker",
            "hummingbird", "swift", "swallow", "lark", "robin", "thrush",
            "bluebird", "warbler", "cardinal", "bunting", "oriole", "blackbird",
            "starling", "raven", "magpie", "chickadee", "titmouse", "nuthatch",
            "wren", "mockingbird", "tanager", "weaver", "waxwing", "kingfisher",
            "bee-eater", "roller", "trogon", "barbet", "hoopoe", "flycatcher",
            "martin", "nightjar", "cuckoo", "roadrunner", "shrike", "vireo",
        ]

        is_bird       = (top_idx in bird_indices) or any(kw in top_class for kw in bird_keywords)
        detected_label = top_class.split(",")[0].strip().title()

        return is_bird, detected_label

    except Exception as e:
        print(f"[ERROR] Bird verification failed: {e}")
        # Default to True — don't block classification on minor errors
        return True, "Unknown"


def detect_bird_species(image_path):
    """
    Full offline two-stage pipeline:
      Stage 1 — MobileNetV2 (ONNX): Is it a bird?
      Stage 2 — HuggingFace fine-grained: Which species? (525 classes)
    No API keys or internet required after first model download.
    """
    try:
        # --- Stage 1: Bird Verification ---
        is_bird, detected_label = is_image_a_bird(image_path)
        if not is_bird:
            print(f"[INFO] Not a bird — detected: {detected_label}")
            return [f"Not a Bird (Detected: {detected_label})"]

        # --- Stage 2: Fine-grained Species Classification ---
        classifier = get_local_classifier()
        img = Image.open(image_path)
        results = classifier(img)

        if results:
            top = results[0]
            species    = top["label"].split(",")[0].strip().title()
            confidence = top["score"]
            print(f"[INFO] Detected: {species} (confidence: {confidence:.2f})")

            if confidence < 0.35:
                return [f"{species} (Low Confidence: {confidence * 100:.1f}% — Try a clearer, centered photo)"]
            return [species]

    except Exception as e:
        print(f"[ERROR] Classification failed: {e}")

    return ["Classification Failed — Please try a clearer bird photo"]
