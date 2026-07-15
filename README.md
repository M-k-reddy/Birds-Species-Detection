# 🐦 Birds Species Detection
An AI-powered web application that identifies bird species from uploaded images using a two-stage hybrid deep learning classifier — with a beautiful, dynamic UI and real-time bird encyclopedia search.

---

## 🚀 Features

- **Two-Stage AI Classification:** First verifies the image is a bird using MobileNetV2 (ONNX), then identifies the exact species from **525 bird species** using a fine-grained Hugging Face model.
- **Non-Bird Rejection:** Automatically rejects non-bird uploads with a clear message showing what was detected instead.
- **Live Bird Slideshow:** Homepage background cycles through 7 stunning exotic bird images every 15 seconds with smooth cross-fade transitions.
- **Real-Time Bird Wiki:** Search any bird species live via the Wikipedia REST API — returns photos, summaries, and links instantly.
- **Modern UI:** Aurora glow animated background, frosted glassmorphism cards, and smooth micro-animations throughout.
- **Fully Offline AI:** Detection runs entirely on your local machine — no image data is sent to any external API.

---

## 🛠️ Prerequisites

Before running the project, ensure you have the following installed:

- **Python** (version 3.10 or higher)
- **Node.js** (version 16 or higher) & **npm**

---

## 💻 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/M-k-reddy/Birds-Species-Detection.git
cd Birds-Species-Detection
```

---

### 2. Setup & Run the Backend

The backend is powered by **Flask** and runs the AI classification pipeline.

Navigate to the backend directory:
```bash
cd backend
```

Create and activate a virtual environment:

**Windows (PowerShell):**
```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

**macOS/Linux:**
```bash
python -m venv .venv
source .venv/bin/activate
```

Install dependencies:
```bash
pip install -r requirements.txt
```

Start the backend server:
```bash
python app.py
```

The backend API will be available at **http://localhost:5000**

---

### 3. Setup & Run the Frontend

The frontend is built using **React.js**.

Navigate back to the root directory:
```bash
cd ..
```

Install node modules:
```bash
npm install
```

Start the React development server:
```bash
npm start
```

The application UI will open at **http://localhost:3000**

---

## 📂 Project Structure

```
Birds-Species-Detection/
├── backend/                        # Flask Backend & AI Models
│   ├── app.py                      # Flask REST API server
│   ├── detect_bird_species.py      # Two-stage AI classification logic
│   ├── mobilenetv2-7.onnx          # Stage 1: General bird verifier (MobileNetV2)
│   ├── bird_model.onnx             # Stage 2: Fine-grained 525-species classifier
│   ├── bird_config.json            # Species label mappings
│   ├── imagenet_classes.txt        # ImageNet class labels for Stage 1
│   ├── requirements.txt            # Python dependencies
│   └── static/                     # Uploaded images & served bird photos
│
├── src/                            # React Frontend Source Code
│   ├── App.js                      # Main app, routing & layout
│   ├── App.css                     # Global app styles & aurora animation
│   ├── index.css                   # CSS design system variables
│   └── components/
│       ├── MainContent.js          # Home page — upload, detect & bird slideshow
│       ├── MainContent.css         # Home page styles
│       ├── Search.js               # Real-time Bird Wiki (Wikipedia API)
│       ├── Search.css              # Search page styles
│       ├── About.js                # About page
│       ├── About.css               # About page styles
│       ├── Ui.js                   # Navbar component
│       └── Ui.css                  # Navbar styles
│
├── public/                         # Static assets
│   ├── hero_bird.jpg               # Slideshow bird images (7 exotic species)
│   ├── bird2.jpg
│   └── ...
│
├── package.json                    # Node.js dependencies & scripts
└── README.md                       # Project documentation
```

---

## 🤖 AI Tech Stack

| Component | Technology |
|---|---|
| **Stage 1 — Bird Verifier** | MobileNetV2 (ONNX Runtime) |
| **Stage 2 — Species Classifier** | `chriamue/bird-species-classifier` via Hugging Face Transformers |
| **Species Coverage** | 525 bird species |
| **Inference Engine** | PyTorch (CPU) + ONNX Runtime |
| **Backend Framework** | Python Flask + Flask-CORS |
| **Image Processing** | Pillow (PIL) + NumPy |

---

## 🌐 Frontend Tech Stack

| Component | Technology |
|---|---|
| **UI Framework** | React.js (Create React App) |
| **Styling** | Vanilla CSS (Glassmorphism + Aurora animations) |
| **HTTP Client** | Axios |
| **Icons** | React Icons |
| **Live Data** | Wikipedia REST API + Wikipedia Search API |

---

## 📸 How It Works

1. **Upload** any image on the Home page
2. **Stage 1** — MobileNetV2 checks if the image contains a bird
3. If not a bird → returns ❌ with the detected object name
4. If a bird → **Stage 2** fine-grained classifier identifies the exact species from 525 options
5. Result is displayed with species name, confidence score, and the uploaded image

---

## 🔗 Live Search

Visit the **Bird Wiki** tab to search any bird species in real time:
- Powered by the **Wikipedia REST API**
- Returns species photo, description, habitat info, and a Wikipedia link
- Works for thousands of bird species worldwide
